/**
 * Backend API Service
 * Centralized API client for communicating with the Spring Boot / TrackoBus backend.
 */
import { auth } from '../firebase';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

/**
 * Returns authentication headers with Firebase ID Bearer token.
 * Dynamically fetches fresh token from Firebase Auth or localStorage.
 */
export const getAuthHeaders = async () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  let token = null;

  // 1. Try Firebase Auth currentUser directly
  if (auth && auth.currentUser) {
    try {
      token = await auth.currentUser.getIdToken(/* forceRefresh */ false);
    } catch (e) {
      console.warn('[TrackoBus Auth] Could not retrieve token from auth.currentUser:', e);
    }
  }

  // 2. Fallback to localStorage / sessionStorage
  if (!token) {
    token = localStorage.getItem('token') || sessionStorage.getItem('token') || localStorage.getItem('firebaseToken');
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('[TrackoBus Auth] Attached Firebase Bearer Token to request header.');
  } else {
    console.warn('[TrackoBus Auth] Warning: No Firebase Auth Token found! The backend may reject this request with 401/403.');
  }

  return headers;
};

/**
 * Helper to convert any coordinate representation ({ lat, lng } or string)
 * into a Google Maps Directions API compatible "latitude,longitude" string.
 */
const toCoordString = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'object' && val.lat !== undefined && val.lng !== undefined) {
    return `${val.lat},${val.lng}`;
  }
  return val.name || '';
};

/**
 * Sends newly created route data to the backend database.
 * Formats all coordinates as "latitude,longitude" strings (e.g. "6.9271,79.8612").
 * Primary endpoint: /trck/api/admin/routes
 */
export const createRouteApi = async (routeData) => {
  const headers = await getAuthHeaders();

  // Normalize origin, destination, and waypoints to Strings ("latitude,longitude" or address names)
  const originStr = toCoordString(routeData.origin || routeData.originCoords);
  const destStr = toCoordString(routeData.destination || routeData.destCoords);
  const waypointsList = Array.isArray(routeData.waypoints)
    ? routeData.waypoints.map(w => toCoordString(w)).filter(Boolean)
    : [];

  const normalizedPayload = {
    routeNumber: String(routeData.routeNumber || '').trim(),
    routeName: String(routeData.routeName || '').trim(),
    origin: originStr || '',
    destination: destStr || '',
    waypoints: waypointsList,
  };

  const endpoints = [
    `${API_BASE_URL}/trck/api/admin/routes`,
    `${API_BASE_URL}/api/admin/routes`,
    `${API_BASE_URL}/api/routes`,
  ];

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      console.log(`[TrackoBus API] POST to: ${endpoint}`, normalizedPayload);
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(normalizedPayload),
      });

      console.log(`[TrackoBus API] Response status from ${endpoint}:`, res.status, res.statusText);

      if (res.ok) {
        const data = await res.json().catch(() => routeData);
        console.log(`[TrackoBus API] Route created successfully:`, data);
        return data;
      }

      if (res.status === 404) {
        console.warn(`[TrackoBus API] 404 on ${endpoint}, trying fallback...`);
        continue;
      }

      // If server returned 401/403/400/500
      const errJson = await res.json().catch(() => ({}));
      lastError = new Error(errJson.message || `Server error (${res.status}): ${res.statusText}`);
      break;
    } catch (err) {
      console.error(`[TrackoBus API] Network error connecting to ${endpoint}:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error(`Could not connect to backend server at ${API_BASE_URL}/trck/api/admin/routes`);
};

/**
 * Fetches all saved routes from the backend database.
 * Primary endpoint: /trck/api/routes
 */
export const fetchRoutesApi = async () => {
  const headers = await getAuthHeaders();
  const endpoints = [
    `${API_BASE_URL}/trck/api/routes`,
    `${API_BASE_URL}/trck/api/admin/routes`,
    `${API_BASE_URL}/api/routes`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`[TrackoBus API] GET from: ${endpoint}`);
      const res = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`[TrackoBus API] Loaded routes:`, data);
        return data;
      }

      if (res.status === 404) {
        continue;
      }
    } catch (err) {
      console.warn(`[TrackoBus API] Failed to fetch from ${endpoint}:`, err);
    }
  }

  return null;
};

/**
 * Deletes a route by ID from the backend database.
 * Primary endpoint: /trck/api/admin/routes/{id}
 */
export const deleteRouteApi = async (routeId) => {
  const headers = await getAuthHeaders();
  const endpoints = [
    `${API_BASE_URL}/trck/api/admin/routes/${routeId}`,
    `${API_BASE_URL}/api/admin/routes/${routeId}`,
    `${API_BASE_URL}/api/routes/${routeId}`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`[TrackoBus API] DELETE from: ${endpoint}`);
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers,
      });

      if (res.ok) {
        console.log(`[TrackoBus API] Successfully deleted route ${routeId}`);
        return true;
      }

      if (res.status === 404) {
        continue;
      }
    } catch (err) {
      console.warn(`[TrackoBus API] Failed to delete from ${endpoint}:`, err);
    }
  }

  return false;
};
