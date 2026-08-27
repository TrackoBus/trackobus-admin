/**
 * Place Search Service
 * Supports Google Maps Places API & Geocoding when an API key is provided,
 * with seamless fallback to OpenStreetMap (Nominatim & Photon) geocoding.
 */

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

let googleMapsPromise = null;

/**
 * Dynamically loads the Google Maps JavaScript API script if an API key is present.
 */
export const loadGoogleMaps = () => {
  if (typeof window === 'undefined') return Promise.resolve(null);
  
  if (window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve(window.google.maps);
  }

  if (!GOOGLE_API_KEY) {
    return Promise.resolve(null);
  }

  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve) => {
      const scriptId = 'google-maps-script';
      if (document.getElementById(scriptId)) {
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            clearInterval(checkInterval);
            resolve(window.google.maps);
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          resolve(window.google.maps);
        } else {
          resolve(null);
        }
      };
      script.onerror = () => {
        console.warn('Failed to load Google Maps script. Falling back to OpenStreetMap geocoding.');
        resolve(null);
      };
      document.head.appendChild(script);
    });
  }

  return googleMapsPromise;
};

/**
 * Searches places via Google Places Autocomplete & Geocoder.
 */
const searchGooglePlaces = async (query) => {
  const maps = await loadGoogleMaps();
  if (!maps || !maps.places) return null;

  return new Promise((resolve) => {
    try {
      const autocompleteService = new maps.places.AutocompleteService();
      const geocoder = new maps.Geocoder();

      autocompleteService.getPlacePredictions(
        {
          input: query,
        },
        async (predictions, status) => {
          if (status !== maps.places.PlacesServiceStatus.OK || !predictions || predictions.length === 0) {
            // Try geocoder as fallback
            geocoder.geocode({ address: query }, (geoResults, geoStatus) => {
              if (geoStatus === maps.GeocoderStatus.OK && geoResults && geoResults.length > 0) {
                const results = geoResults.slice(0, 6).map((item, index) => ({
                  id: item.place_id || `google-geo-${index}`,
                  name: item.formatted_address.split(',')[0],
                  address: item.formatted_address,
                  lat: parseFloat(item.geometry.location.lat().toFixed(6)),
                  lng: parseFloat(item.geometry.location.lng().toFixed(6)),
                  source: 'google',
                }));
                resolve(results);
              } else {
                resolve(null);
              }
            });
            return;
          }

          // Resolve predictions to lat/lng using Geocoder
          const results = await Promise.all(
            predictions.slice(0, 5).map(async (pred) => {
              return new Promise((res) => {
                geocoder.geocode({ placeId: pred.place_id }, (geoResults, geoStatus) => {
                  if (geoStatus === maps.GeocoderStatus.OK && geoResults && geoResults[0]) {
                    const loc = geoResults[0].geometry.location;
                    res({
                      id: pred.place_id,
                      name: pred.structured_formatting?.main_text || pred.description.split(',')[0],
                      address: pred.description,
                      lat: parseFloat(loc.lat().toFixed(6)),
                      lng: parseFloat(loc.lng().toFixed(6)),
                      source: 'google',
                    });
                  } else {
                    res({
                      id: pred.place_id,
                      name: pred.structured_formatting?.main_text || pred.description.split(',')[0],
                      address: pred.description,
                      lat: null,
                      lng: null,
                      source: 'google',
                    });
                  }
                });
              });
            })
          );

          resolve(results.filter(r => r.lat !== null && r.lng !== null));
        }
      );
    } catch (err) {
      console.warn('Google Places search error:', err);
      resolve(null);
    }
  });
};

/**
 * Searches places via OpenStreetMap Nominatim & Photon Geocoding (zero-key fallback).
 */
const searchOsmPlaces = async (query) => {
  try {
    // 1. First try Nominatim
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=6`;
    const res = await fetch(nominatimUrl, {
      headers: {
        'Accept-Language': 'en',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item) => {
          const mainName = item.name || item.display_name.split(',')[0];
          return {
            id: `osm-${item.place_id}`,
            name: mainName.trim(),
            address: item.display_name,
            lat: parseFloat(parseFloat(item.lat).toFixed(6)),
            lng: parseFloat(parseFloat(item.lon).toFixed(6)),
            source: 'osm',
          };
        });
      }
    }
  } catch (err) {
    console.warn('Nominatim search failed, trying Photon:', err);
  }

  // 2. Fallback to Photon API (Fast & CORS friendly)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6`;
    const res = await fetch(photonUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        return data.features.map((f, i) => {
          const props = f.properties || {};
          const name = props.name || props.city || props.street || query;
          const addressParts = [props.street, props.city, props.state, props.country].filter(Boolean);
          const address = addressParts.length > 0 ? addressParts.join(', ') : name;
          return {
            id: `photon-${props.osm_id || i}`,
            name,
            address,
            lat: parseFloat(f.geometry.coordinates[1].toFixed(6)),
            lng: parseFloat(f.geometry.coordinates[0].toFixed(6)),
            source: 'photon',
          };
        });
      }
    }
  } catch (err) {
    console.error('Photon fallback search error:', err);
  }

  return [];
};

/**
 * Main unified place search function.
 * Tries Google Places first (if configured), then OpenStreetMap.
 */
export const searchPlaces = async (query) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.trim();

  // If query is directly "lat, lng" coordinates (e.g. 6.9271, 79.8612)
  const coordMatch = cleanQuery.match(/^(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)$/);
  if (coordMatch) {
    const lat = parseFloat(parseFloat(coordMatch[1]).toFixed(6));
    const lng = parseFloat(parseFloat(coordMatch[3]).toFixed(6));
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return [
        {
          id: `coord-${lat}-${lng}`,
          name: `Point (${lat}, ${lng})`,
          address: `Custom Coordinates: ${lat}, ${lng}`,
          lat,
          lng,
          source: 'manual',
        },
      ];
    }
  }

  // Try Google Places if key exists
  if (GOOGLE_API_KEY) {
    try {
      const googleResults = await searchGooglePlaces(cleanQuery);
      if (googleResults && googleResults.length > 0) {
        return googleResults;
      }
    } catch (err) {
      console.warn('Google Places search error, falling back to OSM:', err);
    }
  }

  // Fallback to OSM
  return await searchOsmPlaces(cleanQuery);
};

/**
 * Reverse geocodes lat/lng into a place name.
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (res.ok) {
      const data = await res.json();
      const name = data.name || data.display_name?.split(',')[0] || `Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      return {
        name: name.trim(),
        address: data.display_name || '',
      };
    }
  } catch (err) {
    console.warn('Reverse geocode error:', err);
  }
  return {
    name: `Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
  };
};
