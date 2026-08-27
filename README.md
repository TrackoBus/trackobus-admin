# 🚌 TrackoBus Web Admin Console

The **TrackoBus Web Admin Console** is the administrative dashboard and route management interface for the **TrackoBus** real-time bus tracking and passenger rewards platform. 

The console primarily enables administrators to map, configure, and publish bus routes with precise stop coordinates and waypoints, while also offering fleet monitoring, reward claim management, system diagnostic logs, and platform configuration.

---

## ✨ Features

### 🗺️ 1. Interactive Route Creation & Management
- **Interactive Map Builder**: Place and visualize origin, destination, and intermediate bus stops using Leaflet and OpenStreetMap tiles.
- **Click-to-Add & Drag Stops**: Add waypoints dynamically on the map or reorder stops seamlessly.
- **Smart Place Autocomplete**: Search locations and bus stands using Google Places API, with built-in fallback to OpenStreetMap (Nominatim & Photon) geocoding.
- **Route Sync with Backend**: Save structured route paths (coordinates, stop lists, route numbers, and route names) directly to the backend database.
- **Route Catalog**: Search, filter, view status, and delete configured bus routes.

### 🔐 2. Authentication & Secure API Communication
- Secure email/password authentication backed by **Firebase Authentication**.
- Automatic synchronization of Firebase ID tokens attached as `Bearer` tokens on backend API requests.
- Developer bypass mode for local sandbox testing.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Maps & GIS** | [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/) |
| **Geocoding & Places** | Google Maps JavaScript API (Places & Geocoding) + OpenStreetMap (Nominatim / Photon) |
| **Authentication** | [Firebase Auth](https://firebase.google.com/docs/auth) |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) |
| **Backend Integration** | Spring Boot REST API |

---

## 📁 Project Structure

```text
trackobus-web/
├── public/                # Static public assets
├── src/
│   ├── assets/            # UI images, branding, and backgrounds
│   ├── components/        # Reusable UI components
│   │   ├── rewards/       # Reward catalog and redemption table components
│   │   ├── AdminLayout.jsx# Sidebar and main admin layout wrapper
│   │   └── PlaceSearchInput.jsx # Google / OSM location search input
│   ├── pages/             # Admin console views
│   │   ├── Addroute.jsx   # Interactive map-based route creation modal
│   │   ├── Dashboard.jsx  # Metrics overview and fleet summary
│   │   ├── Login.jsx      # Admin login and Firebase Auth page
│   │   ├── RouteManagement.jsx # Bus route catalog & actions
│   │   ├── Setting.jsx    # System preferences & admin settings
│   │   ├── SystemLogs.jsx # Diagnostic log viewer
│   │   └── UserRewards.jsx# Reward moderation dashboard
│   ├── services/          # API clients and geocoding services
│   │   ├── api.js         # Backend REST API calls with auth headers
│   │   └── placeSearch.js # Google Places & OpenStreetMap geocoding service
│   ├── firebase.js        # Firebase SDK initialization
│   ├── App.jsx            # App routing and auth token listeners
│   └── main.jsx           # React DOM root entry point
├── .env.example           # Template for environment variables
├── package.json           # Project dependencies and npm scripts
└── vite.config.js         # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher (packaged with Node.js)
- *(Optional)* A running instance of the **TrackoBus Backend** (Spring Boot) on `http://localhost:8080`.

---

### Installation & Configuration

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd trackobus-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Open `.env` and fill in your Firebase, Google Maps, and backend configuration values:
   ```env
   # Firebase Configuration (for Admin Authentication)
   VITE_FIREBASE_API_KEY="your-firebase-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"

   # Google Maps API Key (Places Autocomplete & Geocoding)
   # If left empty, the app will automatically fall back to OpenStreetMap (Nominatim)
   VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

   # Backend API Base URL (Spring Boot server)
   VITE_API_BASE_URL="http://localhost:8080"
   ```

---

### Running the Application

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal).

2. **Log In to Admin Console**:
   - Use your configured Firebase admin credentials to log in.
   - For offline or local testing without Firebase credentials, click **"Developer Bypass"** to access the dashboard directly.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles and bundles production-ready static assets into the `dist/` directory. |
| `npm run preview` | Runs a local web server to preview the production build in `dist/`. |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues. |

---

## 🔗 Backend API Integration

The admin console interacts with the TrackoBus Spring Boot backend service via [`src/services/api.js`](file:///src/services/api.js):

| Method | Primary Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/trck/api/admin/routes` | Creates a new bus route with origin, destination, and waypoint coordinates. |
| `GET` | `/trck/api/routes` | Retrieves the list of all active bus routes. |
| `DELETE` | `/trck/api/admin/routes/{id}` | Deletes a specified route from the database. |

All authenticated requests automatically attach the `Authorization: Bearer <Firebase_ID_Token>` header.
