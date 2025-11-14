# GIS Architecture Diagrams

This directory contains visual diagrams for the Ghana Lands Commission GIS solution recommendation.

## Generated PNG Diagrams

All diagrams are available in high-resolution PNG format (2400x1600px) with transparent backgrounds, suitable for presentations and documentation.

### 1. System Architecture (01-system-architecture.png)
**Size:** 138 KB

Shows the complete six-layer architecture:
- **Presentation Layer:** React web app, QField mobile, QGIS desktop
- **API Layer:** Node.js/Express, GeoServer REST API, JWT authentication
- **Service Layer:** GeoServer WMS/WFS, Vector tile server, QGIS Server
- **Data Layer:** PostgreSQL + PostGIS with spatial indexes
- **Storage Layer:** Satellite imagery, documents, backups
- **Integration Layer:** GELIS, payment gateway, blockchain

### 2. Data Flow - Survey Submission (02-data-flow.png)
**Size:** 138 KB

Sequence diagram showing the complete workflow:
1. Surveyor captures boundary with QField (offline)
2. Syncs to API when connected
3. PostGIS validates geometry (topology, overlaps)
4. Backend generates confidence scores
5. Blockchain creates immutable token
6. GeoServer refreshes map layers

### 3. Technology Stack (03-technology-stack.png)
**Size:** 164 KB

Component diagram showing all technologies and their relationships:
- Frontend: React, Leaflet.js, Geoman, Turf.js
- Backend: Node.js, PostgreSQL driver, JWT
- Database: PostgreSQL 15, PostGIS 3.4, GIST indexes
- Map services: GeoServer, pg_tileserv, QGIS Server
- Desktop: QGIS 3.34, QField Sync
- Mobile: QField 3.0, GPS integration
- Storage: MinIO S3, Cloud-Optimized GeoTIFF
- Imagery: Sentinel-2 (free), Planet (paid), Maxar (paid)

### 4. Spatial Query Flow (04-spatial-query-flow.png)
**Size:** 80 KB

Detailed flowchart of "find parcels in area" feature:
1. User draws polygon on map
2. Convert to GeoJSON
3. Send to API
4. PostGIS performs ST_Intersects spatial query
5. Use GIST index for performance
6. Join with titles and mortgages
7. Calculate statistics
8. Render results on map

### 5. Implementation Timeline (05-implementation-timeline.png)
**Size:** 77 KB

12-month Gantt chart showing 5 implementation phases:
- **Phase 1 (Months 1-2):** PostgreSQL + PostGIS setup, database design, GeoServer installation
- **Phase 2 (Months 2-3):** QGIS workstations, QField mobile, surveyor training
- **Phase 3 (Months 3-5):** Sentinel-2 imagery, COG processing, WMS configuration
- **Phase 4 (Months 5-8):** Real-time validation API, blockchain integration, vector tiles, GELIS integration
- **Phase 5 (Months 9-12):** Load testing, database replication, production deployment, UAT

### 6. Database Schema (06-database-schema.png)
**Size:** 166 KB

Entity-relationship diagram showing:
- **cadastral_parcels:** Geometry, area, region, blockchain token
- **land_titles:** Title number, owner, parcel reference
- **mortgages:** Lender, amount, dates, title reference
- **surveys:** Survey geometry, accuracy, confidence score
- **applications:** Type, status, applicant
- **users:** Authentication and profile data

### 7. Cost Comparison (07-cost-comparison.png)
**Size:** 78 KB

Open Source vs ESRI cost breakdown:
- **Open Source Year 1:** $181,000
  - PostgreSQL + PostGIS: $0 (free)
  - GeoServer: $0 (free)
  - QGIS (20 licenses): $0 (free)
  - QField: $0 (free)
  - Sentinel-2 + Planet: $20k/year
  - Professional services: $161k (one-time)

- **ESRI Year 1:** $250,000
  - ArcGIS Enterprise SDE: $50k/year
  - ArcGIS Server: $40k/year
  - ArcGIS Pro (20 licenses): $30k/year
  - ArcGIS Field Maps: $10k/year
  - ArcGIS Imagery: $25k/year
  - Implementation: $95k (one-time)

**5-Year Total Cost:**
- Open Source: $505,000
- ESRI: $1,050,000
- **Savings: $545,000 (52% reduction)**

### 8. Deployment Architecture (08-deployment-architecture.png)
**Size:** 131 KB

Production infrastructure diagram:
- **Load balancer:** Nginx with SSL/TLS
- **Application servers:** 2x Node.js API servers (port 5000)
- **Map services:** 2x GeoServer (WMS/WFS), 1x Tile server (vector tiles)
- **Database cluster:** PostgreSQL primary + 2 read replicas
- **Object storage:** MinIO S3 for satellite imagery
- **Monitoring:** Grafana, Prometheus, ELK stack

### 9. Mobile Field Workflow (09-mobile-workflow.png)
**Size:** 157 KB

End-to-end surveyor process flowchart:
1. Open QField app at property site
2. Load survey project with Sentinel-2 basemap
3. Enable GPS, wait for accuracy < 5m
4. Draw property boundary walking perimeter
5. Take photos of corner markers
6. Fill survey form (owner, land use)
7. Validate geometry (self-intersection, area checks)
8. Save to local SQLite database
9. Continue to next property or return to office
10. Connect to WiFi, sync to PostGIS
11. Backend validates for overlaps
12. On approval, insert into cadastral_parcels
13. Create blockchain token with geometry hash

---

## File Formats

- **PNG files:** High-resolution images (2400x1600px) for presentations and documents
- **MMD files:** Source Mermaid diagram code for editing

## Editing Diagrams

To regenerate PNG files after editing .mmd source files:

```bash
cd /Users/nikolay/github/ghana/ghana/diagrams
mmdc -i 01-system-architecture.mmd -o 01-system-architecture.png -w 2400 -H 1600 -b transparent
```

Or batch convert all:

```bash
for file in *.mmd; do mmdc -i "$file" -o "${file%.mmd}.png" -w 2400 -H 1600 -b transparent; done
```

## Viewing Diagrams

- **PNG files:** Open directly in any image viewer or include in PowerPoint/Word documents
- **MMD files:** View/edit at https://mermaid.live/ or in VS Code with Mermaid extension

---

**Last updated:** 2025-11-14
**Generated using:** Mermaid CLI (@mermaid-js/mermaid-cli)
**Related documents:**
- `/Users/nikolay/github/ghana/ghana/GIS_SOLUTION_RECOMMENDATION.md`
- `/Users/nikolay/github/ghana/ghana/GIS_ARCHITECTURE_DIAGRAMS.md`
