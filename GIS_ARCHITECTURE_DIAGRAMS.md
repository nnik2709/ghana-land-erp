# Ghana Lands Commission - GIS Architecture Diagrams
**Visual representation of the recommended GIS solution**

---

## 1. System Architecture - Six Layer Overview

```mermaid
flowchart TB
    subgraph Layer1["PRESENTATION LAYER"]
        WebApp["React Web App<br/>(Leaflet.js Maps)"]
        MobileApp["QField Mobile<br/>(Android/iOS)"]
        Desktop["QGIS Desktop<br/>(Staff Workstations)"]
    end

    subgraph Layer2["API LAYER"]
        NodeAPI["Node.js/Express API<br/>Port 5000"]
        GeoServerAPI["GeoServer REST API<br/>Port 8080"]
        Auth["JWT Authentication"]
    end

    subgraph Layer3["SERVICE LAYER"]
        GeoServer["GeoServer 2.24<br/>WMS/WFS/WCS"]
        TileServer["Vector Tile Server<br/>pg_tileserv"]
        Processing["QGIS Server<br/>Geoprocessing"]
    end

    subgraph Layer4["DATA LAYER"]
        PostGIS["PostgreSQL 15 + PostGIS 3.4<br/>10M+ Parcels"]
        Indexes["Spatial Indexes (GIST)<br/>Partitioning by Region"]
        CRS["Coordinate Systems<br/>EPSG:2136 | EPSG:4326"]
    end

    subgraph Layer5["STORAGE LAYER"]
        Imagery["Satellite Imagery<br/>COG Files (S3/MinIO)"]
        Documents["Survey PDFs<br/>Title Deeds"]
        Backup["Backup & Archive<br/>Incremental Dumps"]
    end

    subgraph Layer6["INTEGRATION LAYER"]
        GELIS["GELIS System<br/>(Existing Land Database)"]
        Payment["Payment Gateway"]
        Blockchain["Blockchain Network<br/>(Geometry Hashing)"]
    end

    WebApp --> NodeAPI
    MobileApp --> NodeAPI
    Desktop --> PostGIS

    NodeAPI --> GeoServer
    NodeAPI --> PostGIS
    GeoServerAPI --> GeoServer

    GeoServer --> PostGIS
    GeoServer --> Imagery
    TileServer --> PostGIS

    PostGIS --> Backup

    NodeAPI --> GELIS
    NodeAPI --> Payment
    NodeAPI --> Blockchain

    style Layer1 fill:#e1f5e1
    style Layer2 fill:#e3f2fd
    style Layer3 fill:#fff9c4
    style Layer4 fill:#fce4ec
    style Layer5 fill:#f3e5f5
    style Layer6 fill:#e0f2f1
```

---

## 2. Data Flow - Survey Submission Process

```mermaid
sequenceDiagram
    participant Surveyor
    participant QField
    participant API
    participant PostGIS
    participant Validation
    participant Blockchain
    participant GeoServer

    Surveyor->>QField: Draw property boundary<br/>(GPS + Satellite overlay)
    QField->>QField: Capture offline<br/>(Store locally)

    Note over QField,API: When connectivity available

    QField->>API: POST /api/surveys/submit<br/>(GeoJSON polygon)
    API->>PostGIS: ST_IsValid(geometry)
    PostGIS-->>API: Topology check: PASS

    API->>PostGIS: Check overlaps<br/>ST_Intersects(new, existing)
    PostGIS-->>API: No overlaps found

    API->>Validation: Calculate area, accuracy<br/>Generate confidence score
    Validation-->>API: Area: 2,450 sqm<br/>Confidence: 85%

    API->>PostGIS: INSERT INTO cadastral_parcels
    PostGIS-->>API: Parcel ID: abc-123

    API->>Blockchain: Hash geometry<br/>SHA-256(GeoJSON)
    Blockchain-->>API: Token ID: 0x789def

    API->>PostGIS: UPDATE parcel<br/>SET blockchain_token_id

    Note over GeoServer,PostGIS: Auto-refresh

    GeoServer->>PostGIS: Fetch new parcels<br/>(WFS query)
    PostGIS-->>GeoServer: Return geometry

    API-->>QField: Success + Parcel ID
    QField-->>Surveyor: Survey approved ✓
```

---

## 3. Technology Stack Components

```mermaid
graph LR
    subgraph Frontend["Frontend Technologies"]
        React["React 18.3.1"]
        Leaflet["Leaflet.js<br/>Interactive Maps"]
        Geoman["Leaflet Geoman<br/>Drawing Tools"]
        Turf["Turf.js<br/>Spatial Analysis"]
    end

    subgraph Backend["Backend Technologies"]
        Node["Node.js/Express"]
        PG["pg (PostgreSQL Driver)"]
        JWT["JWT Authentication"]
    end

    subgraph Database["Spatial Database"]
        PostgreSQL["PostgreSQL 15"]
        PostGIS_Ext["PostGIS 3.4 Extension"]
        GIST["GIST Spatial Index"]
    end

    subgraph MapServers["Map Services"]
        GeoSrv["GeoServer 2.24"]
        TileSrv["pg_tileserv<br/>(Vector Tiles)"]
        QGISServ["QGIS Server<br/>(Geoprocessing)"]
    end

    subgraph Desktop["Desktop Tools"]
        QGIS["QGIS 3.34 LTR"]
        Plugins["QField Sync Plugin"]
    end

    subgraph Mobile["Mobile Apps"]
        QField["QField 3.0"]
        GPS["GPS Integration"]
    end

    subgraph Storage["Storage Systems"]
        S3["MinIO (S3-compatible)"]
        COG["Cloud-Optimized GeoTIFF"]
    end

    subgraph Imagery["Satellite Data"]
        Sentinel["Sentinel-2 (Free)<br/>10m resolution"]
        Planet["Planet (Paid)<br/>3m resolution"]
        Maxar["Maxar (Paid)<br/>30cm resolution"]
    end

    React --> Leaflet
    Leaflet --> Geoman
    Leaflet --> Turf
    React --> Node

    Node --> PG
    PG --> PostgreSQL
    PostgreSQL --> PostGIS_Ext
    PostGIS_Ext --> GIST

    Node --> GeoSrv
    GeoSrv --> PostgreSQL
    TileSrv --> PostgreSQL

    QGIS --> PostgreSQL
    QGIS --> Plugins
    Plugins --> QField

    GeoSrv --> S3
    S3 --> COG
    Sentinel --> COG
    Planet --> COG
    Maxar --> COG

    style Frontend fill:#4CAF50,color:#fff
    style Backend fill:#2196F3,color:#fff
    style Database fill:#F44336,color:#fff
    style MapServers fill:#FF9800,color:#fff
    style Desktop fill:#9C27B0,color:#fff
    style Mobile fill:#00BCD4,color:#fff
    style Storage fill:#607D8B,color:#fff
    style Imagery fill:#795548,color:#fff
```

---

## 4. Spatial Query Flow - Find Parcels in Area

```mermaid
flowchart LR
    subgraph User["User Actions"]
        Draw["User draws polygon<br/>on map (Leaflet Geoman)"]
    end

    subgraph Client["Client-Side Processing"]
        GeoJSON["Convert to GeoJSON<br/>{type: 'Polygon', coordinates: [...]}"]
        API_Call["POST /api/spatial/analyze-area"]
    end

    subgraph Server["Server-Side Processing"]
        Parse["Parse GeoJSON"]
        Query1["PostGIS Query 1:<br/>ST_Intersects(parcel.geom, area)"]
        Query2["PostGIS Query 2:<br/>Find titles WHERE parcel_id IN (...)"]
        Query3["PostGIS Query 3:<br/>Find mortgages WHERE title_id IN (...)"]
        Stats["Calculate Statistics:<br/>- Total area<br/>- Count properties<br/>- Count titles<br/>- Count mortgages"]
    end

    subgraph Database["Database Execution"]
        Index["Use GIST Index<br/>(Fast spatial search)"]
        Filter["Filter by status, region"]
        Join["JOIN titles, mortgages"]
        Return["Return results"]
    end

    subgraph Response["Response to Client"]
        JSON["JSON Response:<br/>{parcels: [], titles: [],<br/>mortgages: [], stats: {}}"]
        Render["Render on map:<br/>- Highlight parcels<br/>- Show statistics<br/>- Display tables"]
    end

    Draw --> GeoJSON
    GeoJSON --> API_Call
    API_Call --> Parse
    Parse --> Query1
    Query1 --> Index
    Index --> Filter
    Filter --> Query2
    Filter --> Query3
    Query2 --> Join
    Query3 --> Join
    Join --> Stats
    Stats --> Return
    Return --> JSON
    JSON --> Render

    style User fill:#e8f5e9
    style Client fill:#e3f2fd
    style Server fill:#fff3e0
    style Database fill:#fce4ec
    style Response fill:#f3e5f5
```

---

## 5. Implementation Timeline (12 Months)

```mermaid
gantt
    title GIS Implementation Roadmap
    dateFormat YYYY-MM
    section Phase 1: Foundation
    PostgreSQL + PostGIS Setup           :p1a, 2025-01, 2M
    Database Schema Design               :p1b, 2025-01, 1M
    GeoServer Installation               :p1c, 2025-02, 1M

    section Phase 2: Desktop & Mobile
    QGIS Workstation Setup               :p2a, 2025-02, 1M
    QField Mobile Configuration          :p2b, 2025-03, 1M
    Surveyor Training                    :p2c, 2025-03, 1M

    section Phase 3: Satellite Imagery
    Sentinel-2 Data Acquisition          :p3a, 2025-03, 1M
    COG Processing Pipeline              :p3b, 2025-04, 1M
    GeoServer WMS Configuration          :p3c, 2025-05, 1M

    section Phase 4: Advanced Features
    Real-time Validation API             :p4a, 2025-05, 2M
    Blockchain Integration               :p4b, 2025-06, 2M
    Vector Tile Server                   :p4c, 2025-07, 1M
    GELIS Integration                    :p4d, 2025-08, 1M

    section Phase 5: Scale & Optimize
    Load Testing (10M parcels)           :p5a, 2025-09, 1M
    Database Replication                 :p5b, 2025-10, 1M
    Production Deployment                :p5c, 2025-11, 1M
    User Acceptance Testing              :p5d, 2025-12, 1M
```

---

## 6. Database Schema - Entity Relationships

```mermaid
erDiagram
    CADASTRAL_PARCELS ||--o{ LAND_TITLES : "has"
    LAND_TITLES ||--o{ MORTGAGES : "secures"
    CADASTRAL_PARCELS ||--o{ SURVEYS : "created_from"
    LAND_TITLES ||--o{ APPLICATIONS : "requested_by"
    USERS ||--o{ SURVEYS : "submits"
    USERS ||--o{ APPLICATIONS : "creates"

    CADASTRAL_PARCELS {
        uuid id PK
        varchar parcel_number UK
        geometry geometry_4326
        geometry geometry_2136
        decimal area_sqm
        geometry centroid
        varchar region
        varchar status
        varchar geometry_hash
        varchar blockchain_token_id
    }

    LAND_TITLES {
        uuid id PK
        varchar title_number UK
        uuid parcel_id FK
        varchar owner_name
        date issue_date
        boolean has_mortgage
        varchar blockchain_token_id
    }

    MORTGAGES {
        uuid id PK
        uuid title_id FK
        varchar lender_name
        decimal amount
        date start_date
        date maturity_date
        varchar status
    }

    SURVEYS {
        uuid id PK
        uuid parcel_id FK
        uuid surveyor_id FK
        geometry survey_geometry
        varchar accuracy_rating
        integer confidence_score
        date survey_date
    }

    APPLICATIONS {
        uuid id PK
        uuid applicant_id FK
        uuid parcel_id FK
        varchar application_type
        varchar status
        date submitted_at
    }

    USERS {
        uuid id PK
        varchar email UK
        varchar full_name
        varchar role
        timestamp created_at
    }
```

---

## 7. Spatial Analysis - Use Cases

```mermaid
mindmap
  root((Spatial<br/>Analysis))
    Property Search
      Find by boundary
      Find by address
      Find by coordinates
      Find within radius

    Validation
      Overlap detection
      Topology check
      Area calculation
      Boundary verification

    Reporting
      Parcels in district
      Ownership statistics
      Mortgage coverage
      Disputed areas

    Planning
      Buffer analysis
      Proximity search
      Land use zoning
      Infrastructure impact

    Field Work
      Offline surveying
      GPS accuracy tracking
      Photo attachments
      Real-time sync
```

---

## 8. Cost Comparison: Open Source vs ESRI

```mermaid
graph TD
    subgraph OpenSource["Open Source Solution - $181k Year 1"]
        OS_DB["PostgreSQL + PostGIS<br/>$0 (Free)"]
        OS_Server["GeoServer<br/>$0 (Free)"]
        OS_Desktop["QGIS (20 licenses)<br/>$0 (Free)"]
        OS_Mobile["QField<br/>$0 (Free)"]
        OS_Imagery["Sentinel-2 + Planet<br/>$20k/year"]
        OS_Services["Professional Services<br/>$161k (one-time)"]
    end

    subgraph ESRI["ESRI Solution - $250k Year 1"]
        ESRI_DB["ArcGIS Enterprise SDE<br/>$50k/year"]
        ESRI_Server["ArcGIS Server<br/>$40k/year"]
        ESRI_Desktop["ArcGIS Pro (20 licenses)<br/>$30k/year"]
        ESRI_Mobile["ArcGIS Field Maps<br/>$10k/year"]
        ESRI_Imagery["ArcGIS Imagery<br/>$25k/year"]
        ESRI_Services["Implementation Services<br/>$95k (one-time)"]
    end

    OS_DB --> OS_Total["Year 1: $181k<br/>Year 2+: $81k/year"]
    OS_Server --> OS_Total
    OS_Desktop --> OS_Total
    OS_Mobile --> OS_Total
    OS_Imagery --> OS_Total
    OS_Services --> OS_Total

    ESRI_DB --> ESRI_Total["Year 1: $250k<br/>Year 2+: $200k/year"]
    ESRI_Server --> ESRI_Total
    ESRI_Desktop --> ESRI_Total
    ESRI_Mobile --> ESRI_Total
    ESRI_Imagery --> ESRI_Total
    ESRI_Services --> ESRI_Total

    OS_Total --> Savings["5-Year Savings:<br/>$545,000<br/>(52% reduction)"]
    ESRI_Total --> Savings

    style OpenSource fill:#4CAF50,color:#fff
    style ESRI fill:#F44336,color:#fff
    style Savings fill:#FFC107,color:#000
```

---

## 9. Deployment Architecture

```mermaid
graph TB
    subgraph Internet["Internet"]
        Users["Citizens, Surveyors,<br/>Officers, Admins"]
    end

    subgraph LoadBalancer["Load Balancer (Nginx)"]
        LB["nginx:443<br/>(SSL/TLS)"]
    end

    subgraph AppServers["Application Servers"]
        App1["Node.js API<br/>Server 1:5000"]
        App2["Node.js API<br/>Server 2:5000"]
    end

    subgraph MapServices["Map Services"]
        Geo1["GeoServer 1:8080<br/>(WMS/WFS)"]
        Geo2["GeoServer 2:8080<br/>(WMS/WFS)"]
        Tile["Tile Server:7800<br/>(Vector Tiles)"]
    end

    subgraph Database["Database Cluster"]
        PG_Primary["PostgreSQL Primary<br/>+ PostGIS"]
        PG_Replica1["PostgreSQL Replica 1<br/>(Read-only)"]
        PG_Replica2["PostgreSQL Replica 2<br/>(Read-only)"]
    end

    subgraph ObjectStorage["Object Storage"]
        MinIO["MinIO S3<br/>(Satellite Imagery)"]
    end

    subgraph Monitoring["Monitoring & Logs"]
        Grafana["Grafana Dashboard"]
        Prometheus["Prometheus Metrics"]
        Logs["ELK Stack (Logs)"]
    end

    Users --> LB
    LB --> App1
    LB --> App2

    App1 --> Geo1
    App1 --> PG_Primary
    App2 --> Geo2
    App2 --> PG_Primary

    Geo1 --> PG_Replica1
    Geo2 --> PG_Replica2
    Tile --> PG_Replica1

    Geo1 --> MinIO
    Geo2 --> MinIO

    PG_Primary --> PG_Replica1
    PG_Primary --> PG_Replica2

    App1 --> Prometheus
    App2 --> Prometheus
    Prometheus --> Grafana

    style Internet fill:#e3f2fd
    style LoadBalancer fill:#fff3e0
    style AppServers fill:#e8f5e9
    style MapServices fill:#fce4ec
    style Database fill:#f3e5f5
    style ObjectStorage fill:#e0f2f1
    style Monitoring fill:#fff9c4
```

---

## 10. Mobile Field Workflow

```mermaid
flowchart TD
    Start([Surveyor arrives<br/>at property])

    Start --> Open[Open QField app]
    Open --> Load[Load survey project<br/>Offline mode enabled]
    Load --> Satellite[View satellite basemap<br/>Sentinel-2 imagery]

    Satellite --> GPS[Enable GPS<br/>Wait for accuracy < 5m]
    GPS --> Draw[Draw property boundary<br/>Walk perimeter with GPS]

    Draw --> Photos[Take photos<br/>Corner markers, features]
    Photos --> Form[Fill survey form<br/>Owner name, land use, notes]

    Form --> Validate{Validation<br/>checks}
    Validate -->|Fail| Error[Show errors:<br/>- Self-intersection<br/>- Too small area]
    Error --> Draw

    Validate -->|Pass| Save[Save to local storage<br/>SQLite database]
    Save --> Continue{More<br/>properties?}

    Continue -->|Yes| Start
    Continue -->|No| Office[Return to office]

    Office --> Wifi[Connect to WiFi]
    Wifi --> Sync[QField Cloud Sync]
    Sync --> Upload[Upload to PostGIS<br/>via QGIS/API]

    Upload --> Backend[Backend validation<br/>Overlap check]
    Backend --> Approved{Approved?}

    Approved -->|No| Review[Send for review<br/>Flag conflicts]
    Approved -->|Yes| Insert[Insert into<br/>cadastral_parcels]

    Insert --> Blockchain[Create blockchain token<br/>Hash geometry]
    Blockchain --> Done([Survey complete])

    style Start fill:#4CAF50,color:#fff
    style Done fill:#4CAF50,color:#fff
    style Error fill:#F44336,color:#fff
    style Validate fill:#FF9800,color:#fff
    style Approved fill:#FF9800,color:#fff
```

---

## How to View These Diagrams

These diagrams use **Mermaid** syntax, which is supported by:

1. **GitHub** - Renders automatically in README.md files
2. **VS Code** - Install "Markdown Preview Mermaid Support" extension
3. **Online** - https://mermaid.live/ (copy/paste diagram code)
4. **Obsidian** - Native Mermaid support
5. **GitLab** - Native rendering in markdown files

---

## Summary

This document provides visual representations of:
- ✅ Six-layer architecture
- ✅ Data flow for survey submission
- ✅ Technology stack components
- ✅ Spatial query processing
- ✅ Implementation timeline (12 months)
- ✅ Database schema relationships
- ✅ Cost comparison (Open Source vs ESRI)
- ✅ Production deployment architecture
- ✅ Mobile field workflow

All diagrams align with the recommendations in `GIS_SOLUTION_RECOMMENDATION.md`.
