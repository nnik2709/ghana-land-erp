# Ghana Land ERP - Map Implementation Guide

## What's Implemented in Demo App ✅

### Current Features (Just Added!)

1. **Interactive Leaflet Map** in Parcel Details Modal
   - Opens when clicking "View Details" on any parcel
   - Shows OpenStreetMap base layer
   - Displays parcel location with marker
   - Marker popup shows: Parcel ID, Location, Area, Land Type
   - Zoom level: 16 (street level detail)
   - Coordinates displayed below map

2. **Current Data Structure**
   ```json
   {
     "coordinates": "{\"lat\": 5.6037, \"lng\": -0.1870}"
   }
   ```
   - Single GPS point (center of parcel)
   - Stored as JSON string in database
   - Parsed and displayed on map

3. **Tech Stack**
   - **react-leaflet** 4.2.1 - React wrapper for Leaflet
   - **leaflet** 1.9.4 - Open-source JavaScript mapping library
   - **OpenStreetMap** tiles - Free, open-source map tiles

4. **What Works Now**
   - ✅ Marker placement at parcel coordinates
   - ✅ Interactive map (zoom, pan, drag)
   - ✅ Popup with parcel information
   - ✅ Responsive design (400px height)
   - ✅ Fallback for missing/invalid coordinates
   - ✅ Works for all 7 demo parcels

---

## What's Needed for Production-Ready App

### 1. Database Schema Changes

**Current (Demo):**
```sql
coordinates TEXT  -- '{"lat": 5.6037, "lng": -0.1870}'
```

**Production:**
```sql
-- Option A: GeoJSON Format (Recommended)
geometry TEXT  -- Full GeoJSON polygon with boundaries
-- Example:
{
  "type": "Polygon",
  "coordinates": [
    [
      [-0.1870, 5.6037],  -- [lng, lat]
      [-0.1875, 5.6037],
      [-0.1875, 5.6032],
      [-0.1870, 5.6032],
      [-0.1870, 5.6037]   -- Close polygon
    ]
  ]
}

-- Option B: PostGIS (Best for Large Scale)
-- Migrate from SQLite to PostgreSQL with PostGIS extension
geometry GEOMETRY(POLYGON, 4326)  -- Native spatial data type
```

**Add to Database:**
```sql
-- Boundary coordinates (multiple points forming parcel edges)
boundary_coordinates TEXT  -- JSON array of [lat, lng] pairs
centroid_lat REAL         -- Center point latitude
centroid_lng REAL         -- Center point longitude
area_sqm REAL            -- Calculated area in square meters
perimeter_m REAL         -- Calculated perimeter in meters
```

### 2. GPS Survey Data Collection

**Field Equipment Needed:**
1. **Total Station** - High accuracy (±5mm)
2. **GPS RTK (Real-Time Kinematic)** - Centimeter-level accuracy
3. **Drone with GPS** - For aerial surveys
4. **Mobile GIS Apps** - For field data collection

**Data Collection Process:**
```
1. Surveyor walks parcel boundaries
2. GPS device records waypoints every few meters
3. Creates closed polygon (first point = last point)
4. Records: timestamp, accuracy, instrument type
5. Uploads to backend API
```

**API Endpoint for Survey Upload:**
```javascript
POST /api/surveys/upload-coordinates
{
  "survey_id": "SUR-2025-001",
  "parcel_id": "GH-GAR-ACC-00001",
  "coordinates": [
    {"lat": 5.6037, "lng": -0.1870, "elevation": 45.2},
    {"lat": 5.6040, "lng": -0.1870, "elevation": 45.5},
    {"lat": 5.6040, "lng": -0.1875, "elevation": 45.3},
    {"lat": 5.6037, "lng": -0.1875, "elevation": 45.1},
    {"lat": 5.6037, "lng": -0.1870, "elevation": 45.2}
  ],
  "accuracy_meters": 0.02,
  "instrument": "GPS RTK",
  "timestamp": "2025-11-13T10:30:00Z"
}
```

### 3. Frontend Map Enhancements

**A. Polygon Display (instead of just marker)**

```javascript
import { Polygon, Polyline } from 'react-leaflet';

// Display parcel boundaries
const boundaryCoords = parcel.boundary_coordinates.map(
  coord => [coord.lat, coord.lng]
);

<Polygon
  positions={boundaryCoords}
  pathOptions={{
    color: '#006B3F',      // Ghana green
    fillColor: '#006B3F',
    fillOpacity: 0.2,
    weight: 3
  }}
>
  <Popup>
    <strong>{parcel.parcel_id}</strong><br/>
    Area: {parcel.area} hectares<br/>
    Status: {parcel.status}
  </Popup>
</Polygon>
```

**B. Aerial Imagery / Satellite View**

```javascript
// Add Google Satellite layer
<TileLayer
  url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
  attribution="Google Satellite"
/>

// Or Mapbox Satellite
<TileLayer
  url="https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token={accessToken}"
  attribution="Mapbox Satellite"
/>

// Layer Control to switch between Street/Satellite
import { LayersControl } from 'react-leaflet';

<LayersControl position="topright">
  <LayersControl.BaseLayer checked name="Street Map">
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  </LayersControl.BaseLayer>
  <LayersControl.BaseLayer name="Satellite">
    <TileLayer url="satellite-url-here" />
  </LayersControl.BaseLayer>
</LayersControl>
```

**C. Drawing Tools (for digitizing parcels)**

```bash
npm install react-leaflet-draw leaflet-draw
```

```javascript
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

<FeatureGroup>
  <EditControl
    position="topright"
    onCreated={handleParcelDrawn}
    draw={{
      rectangle: false,
      circle: false,
      circlemarker: false,
      marker: true,
      polyline: false,
      polygon: {
        allowIntersection: false,
        drawError: { color: '#e1e100', message: '<strong>Error:</strong> Polygon edges cannot cross!' },
        shapeOptions: { color: '#006B3F' }
      }
    }}
  />
</FeatureGroup>
```

**D. Measurement Tools**

```javascript
import { useMap } from 'react-leaflet';
import 'leaflet-measure';

// Add measure control
const map = useMap();
useEffect(() => {
  const measureControl = L.control.measure({
    primaryLengthUnit: 'meters',
    primaryAreaUnit: 'hectares',
    activeColor: '#006B3F',
    completedColor: '#FCD116'
  });
  measureControl.addTo(map);
}, [map]);
```

**E. Search and Geocoding**

```bash
npm install react-leaflet-geosearch leaflet-geosearch
```

```javascript
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

// Add search box to find locations
const SearchControl = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: true,
      autoClose: true
    });
    map.addControl(searchControl);
  }, [map]);

  return null;
};
```

### 4. Backend GIS Processing

**A. Area Calculation**

```javascript
// Using turf.js for spatial calculations
const turf = require('@turf/turf');

function calculateParcelArea(coordinates) {
  const polygon = turf.polygon([coordinates]);
  const area = turf.area(polygon);  // Returns square meters
  return area / 10000;  // Convert to hectares
}

function calculatePerimeter(coordinates) {
  const line = turf.lineString(coordinates);
  return turf.length(line, { units: 'meters' });
}
```

**B. Spatial Queries**

```sql
-- PostGIS queries for production

-- Find parcels within radius
SELECT * FROM parcels
WHERE ST_DWithin(
  geometry,
  ST_SetSRID(ST_MakePoint(-0.1870, 5.6037), 4326),
  1000  -- 1km radius
);

-- Find adjacent parcels
SELECT p2.* FROM parcels p1
JOIN parcels p2 ON ST_Touches(p1.geometry, p2.geometry)
WHERE p1.parcel_id = 'GH-GAR-ACC-00001';

-- Check if point is inside parcel
SELECT * FROM parcels
WHERE ST_Contains(
  geometry,
  ST_SetSRID(ST_MakePoint(-0.1870, 5.6037), 4326)
);
```

**C. Coordinate Validation**

```javascript
// Validate parcel boundaries
function validateParcelBoundaries(coordinates) {
  // Check minimum 3 points
  if (coordinates.length < 3) {
    return { valid: false, error: 'At least 3 points required' };
  }

  // Check if polygon is closed
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  if (first.lat !== last.lat || first.lng !== last.lng) {
    return { valid: false, error: 'Polygon must be closed' };
  }

  // Check for self-intersection
  const polygon = turf.polygon([coordinates.map(c => [c.lng, c.lat])]);
  const kinks = turf.kinks(polygon);
  if (kinks.features.length > 0) {
    return { valid: false, error: 'Polygon has self-intersections' };
  }

  // Check if within Ghana boundaries
  const ghanaBox = {
    minLat: 4.5, maxLat: 11.2,
    minLng: -3.3, maxLng: 1.2
  };
  const withinBounds = coordinates.every(c =>
    c.lat >= ghanaBox.minLat && c.lat <= ghanaBox.maxLat &&
    c.lng >= ghanaBox.minLng && c.lng <= ghanaBox.maxLng
  );
  if (!withinBounds) {
    return { valid: false, error: 'Coordinates outside Ghana' };
  }

  return { valid: true };
}
```

### 5. Integration with External GIS Systems

**A. GELIS (Ghana Enterprise Land Information System)**

```javascript
// Sync parcel data with GELIS
async function syncWithGELIS(parcelId, geometry) {
  const response = await fetch('https://gelis.gov.gh/api/parcels/sync', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GELIS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      parcel_id: parcelId,
      geometry: geometry,
      crs: 'EPSG:4326'  // WGS84
    })
  });

  return response.json();
}
```

**B. Ghana National Grid Integration**

```javascript
// Convert between coordinate systems
const proj4 = require('proj4');

// Define Ghana Meter Grid projection
proj4.defs('EPSG:2136', '+proj=tmerc +lat_0=4.666666666666667 +lon_0=-1 +k=0.99975 +x_0=274320.0 +y_0=0 +ellps=clrk80 +towgs84=-130,29,364,0,0,0,0 +units=m +no_defs');

// Convert WGS84 to Ghana Grid
function convertToGhanaGrid(lat, lng) {
  return proj4('EPSG:4326', 'EPSG:2136', [lng, lat]);
}

// Convert Ghana Grid to WGS84
function convertToWGS84(x, y) {
  return proj4('EPSG:2136', 'EPSG:4326', [x, y]);
}
```

### 6. Mobile App Features

**A. Offline Maps**

```javascript
// React Native with react-native-maps
import MapView, { Polygon, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import RNFS from 'react-native-fs';

// Download map tiles for offline use
async function downloadOfflineTiles(bounds) {
  const tiles = generateTileUrls(bounds, [14, 15, 16]);  // Zoom levels

  for (const tile of tiles) {
    const localPath = `${RNFS.DocumentDirectoryPath}/tiles/${tile.z}/${tile.x}/${tile.y}.png`;
    await RNFS.downloadFile({
      fromUrl: tile.url,
      toFile: localPath
    }).promise;
  }
}
```

**B. GPS Tracking for Surveyors**

```javascript
import Geolocation from '@react-native-community/geolocation';

// Track surveyor position while walking parcel boundary
const recordBoundaryPoints = () => {
  const points = [];

  const watchId = Geolocation.watchPosition(
    (position) => {
      points.push({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      });

      // Auto-save every 10 points
      if (points.length % 10 === 0) {
        saveBoundaryPoints(points);
      }
    },
    (error) => console.error(error),
    {
      enableHighAccuracy: true,
      distanceFilter: 5,  // Record every 5 meters
      interval: 1000
    }
  );

  return watchId;
};
```

### 7. Advanced Features for Production

**A. 3D Terrain Visualization**

```bash
npm install @deck.gl/react @deck.gl/layers @deck.gl/geo-layers
```

```javascript
import DeckGL from '@deck.gl/react';
import { PolygonLayer, TerrainLayer } from '@deck.gl/layers';

// 3D terrain with elevation
<DeckGL
  initialViewState={{
    longitude: -0.1870,
    latitude: 5.6037,
    zoom: 16,
    pitch: 60,
    bearing: 0
  }}
  layers={[
    new TerrainLayer({
      elevationData: 'elevation-tiles-url',
      texture: 'satellite-tiles-url'
    }),
    new PolygonLayer({
      data: parcels,
      getPolygon: d => d.coordinates,
      getFillColor: [0, 107, 63, 100],
      getLineColor: [0, 107, 63],
      lineWidthMinPixels: 2
    })
  ]}
/>
```

**B. Time-Series / Historical Changes**

```javascript
// Track parcel changes over time
async function getParcelHistory(parcelId) {
  return await db.query(`
    SELECT
      ph.*,
      u.full_name as changed_by
    FROM parcel_history ph
    JOIN users u ON ph.user_id = u.id
    WHERE ph.parcel_id = ?
    ORDER BY ph.changed_at DESC
  `, [parcelId]);
}

// Visualize boundary changes
<Timeline>
  {history.map(h => (
    <TimelineItem key={h.id}>
      <Polygon
        positions={JSON.parse(h.coordinates)}
        color={getColorForDate(h.changed_at)}
      />
    </TimelineItem>
  ))}
</Timeline>
```

**C. Cadastral Map Layers**

```javascript
// Load cadastral boundaries from WMS server
<WMSTileLayer
  url="https://gis.landscommission.gov.gh/geoserver/wms"
  layers="cadastral:parcels,cadastral:boundaries"
  format="image/png"
  transparent={true}
  attribution="Ghana Lands Commission"
/>

// Load administrative boundaries
<WMSTileLayer
  url="https://gis.landscommission.gov.gh/geoserver/wms"
  layers="admin:regions,admin:districts"
  format="image/png"
  transparent={true}
/>
```

### 8. Performance Optimization

**A. Map Clustering (for many parcels)**

```bash
npm install react-leaflet-markercluster
```

```javascript
import MarkerClusterGroup from 'react-leaflet-markercluster';

<MarkerClusterGroup>
  {parcels.map(parcel => (
    <Marker key={parcel.id} position={[parcel.lat, parcel.lng]}>
      <Popup>{parcel.parcel_id}</Popup>
    </Marker>
  ))}
</MarkerClusterGroup>
```

**B. Tile Caching**

```javascript
// Cache map tiles for faster loading
import localforage from 'localforage';

const tileCache = localforage.createInstance({
  name: 'map-tiles'
});

// Custom tile layer with caching
class CachedTileLayer extends TileLayer {
  async createTile(coords) {
    const url = this.getTileUrl(coords);
    const cachedTile = await tileCache.getItem(url);

    if (cachedTile) {
      return this.createTileFromBlob(cachedTile);
    }

    // Download and cache
    const response = await fetch(url);
    const blob = await response.blob();
    await tileCache.setItem(url, blob);

    return this.createTileFromBlob(blob);
  }
}
```

---

## Implementation Roadmap

### Phase 1: Demo App (✅ COMPLETE)
- [x] Basic map with marker
- [x] OpenStreetMap tiles
- [x] Single point coordinates
- [x] Popup with parcel info

### Phase 2: Enhanced Demo (2-3 weeks)
- [ ] Polygon boundaries (simulated)
- [ ] Drawing tools for admins
- [ ] Layer control (Street/Satellite)
- [ ] Search functionality

### Phase 3: Production MVP (3-4 months)
- [ ] PostGIS database migration
- [ ] Real GPS survey data integration
- [ ] Mobile app for surveyors
- [ ] GELIS API integration
- [ ] Coordinate system conversion
- [ ] Area/perimeter calculations

### Phase 4: Advanced Features (6-12 months)
- [ ] 3D terrain visualization
- [ ] Drone imagery integration
- [ ] Historical change tracking
- [ ] Cadastral overlay layers
- [ ] Offline map support
- [ ] Real-time collaboration

---

## Cost Estimates

### Infrastructure
- **OpenStreetMap**: Free
- **Mapbox** (if used): $0-$5/month (free tier), then $5/1000 requests
- **Google Maps API**: $200/month credit, then $7/1000 requests
- **Satellite Imagery**: $500-2000/month (Planet, Maxar, or DigitalGlobe)

### Equipment
- **Total Station**: $5,000-$50,000
- **GPS RTK**: $2,000-$10,000
- **Survey-grade Drone**: $5,000-$20,000
- **Mobile GIS devices**: $500-$1,500 each

### Software Licenses
- **ArcGIS Pro**: $700/year per user
- **QGIS**: Free (open source)
- **PostGIS**: Free (open source)
- **GeoServer**: Free (open source)

---

## Testing the Demo Map

**To test the map right now:**

1. Refresh http://localhost:3000
2. Login as any user (citizen/demo123)
3. Go to "Parcels"
4. Click "View Details" on any parcel
5. Scroll down to see the interactive map!

**What you'll see:**
- 📍 Parcel location marked on OpenStreetMap
- 🗺️ Interactive map (zoom, pan, drag)
- 💬 Popup with parcel details when clicking marker
- 📊 Coordinates displayed below map

**Parcels with map data:**
- All 7 parcels have GPS coordinates
- Best examples:
  - **GH-GAR-ACC-00001** - East Legon, Accra
  - **GH-WR-SEK-00004** - Takoradi Harbor Area
  - **GH-BAR-BOL-00007** - Techiman Market Area

---

**Status:** ✅ Map feature fully implemented in demo!
**Next:** Deploy and test with stakeholders
