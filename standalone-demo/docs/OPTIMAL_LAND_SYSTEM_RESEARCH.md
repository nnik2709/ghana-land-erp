# Optimal Integrated Land Management System for Low-Resource Countries

## Research Report: Ghana, Papua New Guinea, and Cambodia

**Date:** November 2024
**Purpose:** Design recommendations for fit-for-purpose land administration systems applicable to developing countries with limited resources and complex tenure arrangements.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Global Context and Challenges](#global-context-and-challenges)
3. [Case Study Analysis](#case-study-analysis)
4. [Recommended System Architecture](#recommended-system-architecture)
5. [Country-Specific Adaptations](#country-specific-adaptations)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Use Cases and Scenarios](#use-cases-and-scenarios)
8. [Technology Recommendations](#technology-recommendations)
9. [Risk Mitigation](#risk-mitigation)
10. [Budget Framework](#budget-framework)

---

## Executive Summary

### The Problem

- Less than 30% of land globally is formally registered
- In Africa, less than 10% of land rights are documented
- 70% of land rights in low/middle-income countries are unrecorded
- Traditional cadastral systems cost $20-60 per parcel and take decades to complete
- Women, indigenous peoples, and the poor are systematically excluded

### The Solution

A **Hybrid Fit-for-Purpose (FFP) Land Administration System** that combines:

- **Tiered registration** (immediate recognition to formal title)
- **Community-based adjudication** (para-surveyors, not expensive professionals)
- **Appropriate technology** (drones, mobile apps, open-source software)
- **Inclusive design** (customary tenure, group rights, gender equity)
- **Incremental improvement** (start simple, enhance over time)

### Key Outcomes

| Metric | Traditional Approach | FFP Approach |
|--------|---------------------|--------------|
| Cost per parcel | $20-60 | $6-15 |
| Time to national coverage | 20-50 years | 5-10 years |
| Women's inclusion | 10-30% | 70-90% |
| Customary land coverage | Minimal | Full |
| Sustainability | Donor-dependent | Self-sustaining |

---

## Global Context and Challenges

### Why Land Administration Matters

1. **Economic Development**
   - Land and property taxes generate only 0.6% of GDP in low-income countries vs 2.2% in industrialized nations
   - Secure tenure increases investment by 8-12%
   - Land collateral enables access to credit

2. **Social Stability**
   - Land disputes account for 50-70% of court cases in many developing countries
   - Forced evictions affect 500,000+ Cambodians over 20 years
   - Conflict over land is a primary driver of instability

3. **Gender Equity**
   - Women produce 60-80% of food in developing countries but own only 10-20% of land
   - Secure land rights improve women's decision-making by 44% (Ethiopia study)

4. **Climate Resilience**
   - Indigenous lands contain 80% of world's remaining biodiversity
   - Secure tenure incentivizes sustainable land management
   - Land use planning requires accurate land information

### Common Challenges in Target Countries

| Challenge | Ghana | PNG | Cambodia |
|-----------|-------|-----|----------|
| Customary/traditional tenure | Stool/family lands (80%) | Clan ownership (97%) | Soft titles, customary claims |
| Institutional capacity | Fragmented agencies | Weak Lands Department | Corruption concerns |
| Technology infrastructure | Limited rural connectivity | Very limited | Improving but uneven |
| Legal framework | Multiple overlapping systems | ILG framework failing | 2001 Land Law gaps |
| Gender issues | Matrilineal vs patrilineal | Clan-based exclusion | Widow land grabbing |

---

## Case Study Analysis

### Success Stories

#### Rwanda: Land Tenure Regularization Program (LTRP)

**What They Did:**
- Registered 10.3 million parcels in 4 years (2009-2013)
- Used community para-surveyors instead of professionals
- General boundaries with ortho-photos, not precise surveys
- Mandatory joint registration for married couples

**Results:**
- Cost: $6-7 per parcel
- Coverage: Nearly 100% of national territory
- Women: 92% of titles include women's names
- Disputes: Significant reduction in land conflicts

**Key Lessons:**
- Political will at highest level is essential
- Simplification beats perfectionism
- Community involvement builds acceptance
- Legal framework must come first

#### Ethiopia: Second Level Land Certification (SLLC)

**What They Did:**
- Built on first-level certification (1998-2010)
- Added GPS coordinates and improved documentation
- Deployed Social Development Officers (SDOs) for women's inclusion
- Linked to agricultural credit programs

**Results:**
- 15+ million certificates issued by 2021
- 80% of certificates include women (individually or jointly)
- 10% increase in credit access
- 44% increase in women's crop decisions

**Key Lessons:**
- Certification alone isn't enough - need ongoing support
- Dedicated staff for women's participation works
- Link to economic benefits (credit) increases uptake
- Incremental improvement is sustainable

#### Indonesia: World Bank Land Program

**What They Did:**
- Systematic registration in priority areas
- Public-private partnerships for surveying
- Digital systems and e-services

**Results:**
- 60+ million parcels registered in 8 years
- 42% to women
- 38,000 jobs created
- 12x increase in private surveying firms

**Key Lessons:**
- Scale is achievable with right approach
- Private sector can be effectively engaged
- Job creation builds local capacity

### Cautionary Tales

#### Cambodia: LMAP World Bank Project

**What Happened:**
- Systematic registration excluded "disputed" areas
- Boeng Kak Lake evictions violated safeguards
- Project terminated due to World Bank policy breaches

**Lessons:**
- Cannot exclude difficult cases
- Must have robust safeguards
- Political interference undermines legitimacy
- Dispute resolution must precede registration

#### Papua New Guinea: Incorporated Land Groups (ILGs)

**What Happened:**
- ILGs designed for alienated land used for customary land
- Corruption in benefit distribution
- Land ceases to be customary upon registration
- Cultural severance of people-land connection

**Lessons:**
- Tools must match context
- Benefit distribution is critical
- Cultural values cannot be ignored
- Registration changes nature of tenure

#### Honduras/Ghana Blockchain Projects

**What Happened:**
- Honduras project never launched (political resistance)
- Ghana Bitland project never delivered objectives
- High expectations, limited results

**Lessons:**
- Technology doesn't solve governance problems
- Blockchain is not a priority for basic registration
- Start with fundamentals, add technology later

---

## Recommended System Architecture

### Core Principle: Fit-for-Purpose

> "Fit-for-purpose land administration is about building a system that meets the needs of society today with the potential to be incrementally improved over time."
> - UN-Habitat/GLTN/FIG

### Tiered Registration Model

```
TIER 3: FORMAL TITLE
- Precise cadastral survey
- Full legal rights
- Required for high-value transactions
- Cost: $20-50/parcel

        ↑ On-demand upgrade

TIER 2: GENERAL BOUNDARY REGISTRATION
- Ortho-photo/drone imagery
- GPS points for corners
- Legally recognized certificate
- Cost: $6-15/parcel

        ↑ Systematic registration

TIER 1: COMMUNITY RECOGNITION
- Participatory mapping
- Witnessed documentation
- Basic protection
- Cost: $1-3/parcel
```

### Tenure Continuum (STDM-Based)

The system must support multiple tenure types along a continuum:

| Tenure Type | Examples | Recognition Method |
|-------------|----------|-------------------|
| Perceived | Squatter, informal settler | Occupancy certificate |
| Customary | Clan land, stool land | Group registration |
| Occupancy | Long-term resident | Use right certificate |
| Leasehold | Government lease, private lease | Lease registration |
| Freehold | Full ownership | Title deed |
| Group/Collective | Community forest, commons | Collective title |

### Data Model: LADM Compliance

The Land Administration Domain Model (ISO 19152) provides the standard:

```
PARTY (Who)
├── Individual
├── Group (clan, family, community)
└── Organization

RIGHTS/RESTRICTIONS/RESPONSIBILITIES (How)
├── Ownership
├── Use rights
├── Lease
├── Mortgage
├── Easement
└── Customary rights

SPATIAL UNIT (Where)
├── Parcel
├── Building
└── Utility network
```

### System Components

#### 1. Registration Module
- Systematic registration workflow
- Sporadic registration for urgent cases
- Document management
- Quality control

#### 2. Transaction Module
- Transfers (sale, gift, inheritance)
- Subdivisions and consolidations
- Mortgages and encumbrances
- Lease management

#### 3. Spatial Module
- Parcel mapping and editing
- Base map management
- Coordinate system handling
- Integration with national SDI

#### 4. Public Services
- Certificate printing
- Online verification
- Search and inquiry
- Fee payment

#### 5. Administration
- User management
- Audit logging
- Reporting
- System configuration

---

## Country-Specific Adaptations

### Ghana

#### Context
- Population: 33 million
- Land area: 238,533 km²
- Estimated parcels: 8-10 million
- Current registration: ~20%
- Customary land: 80%

#### Key Challenges
1. **Stool and family lands** - Complex customary arrangements
2. **Multiple land agencies** - Lands Commission, Town & Country Planning, Survey Department
3. **Informal settlements** - Urban sprawl in Accra, Kumasi
4. **Mining concessions** - Conflicts with community land

#### Recommended Adaptations

**Legal Framework:**
- Strengthen Land Act 2020 implementation
- Clarify customary land registration procedures
- Enable group registration for stool lands

**Institutional:**
- Complete Lands Commission consolidation
- Establish regional land tribunals
- Train traditional authorities in adjudication

**Technical:**
- Integrate with Ghana Card for identity
- Mobile money for payments (MTN, Vodafone)
- Build on existing SOLA pilot

**Special Features:**
- Stool land revenue sharing module
- Mining concession overlay
- Urban informal settlement upgrading

### Papua New Guinea

#### Context
- Population: 10 million
- Land area: 462,840 km²
- Estimated parcels: Unknown (most unregistered)
- Current registration: <5%
- Customary land: 97%

#### Key Challenges
1. **ILG framework failure** - Misused and unsustainable
2. **Linguistic diversity** - 800+ languages
3. **Geographic isolation** - Limited infrastructure
4. **Resource extraction** - Mining/logging benefit disputes

#### Recommended Adaptations

**Legal Framework:**
- Reform Land Groups Incorporation Act
- Allow customary law to continue on registered land
- Simplified clan registration process

**Institutional:**
- Decentralize to provincial level
- Partner with churches/missions (trusted institutions)
- Community dispute resolution before registration

**Technical:**
- Offline-first mobile applications
- Solar-powered equipment
- Satellite connectivity where available

**Special Features:**
- Clan genealogy documentation
- Resource benefit distribution tracking
- Cultural site protection overlay

### Cambodia

#### Context
- Population: 17 million
- Land area: 181,035 km²
- Estimated parcels: 7 million
- Current registration: ~60% (4 million parcels)
- Systematic vs sporadic: 3.4M vs 0.6M

#### Key Challenges
1. **Disputed areas excluded** - Legacy of LMAP
2. **Forced evictions** - Economic land concessions
3. **Soft vs hard titles** - Dual system confusion
4. **Corruption** - Lands Department issues

#### Recommended Adaptations

**Legal Framework:**
- Address excluded/disputed areas
- Strengthen eviction safeguards
- Clarify soft title legal status

**Institutional:**
- Independent dispute resolution
- Civil society monitoring role
- Transparent concession mapping

**Technical:**
- Build on LASSP infrastructure
- Complete systematic registration
- Public portal for transparency

**Special Features:**
- Economic land concession tracking
- Indigenous community lands
- Post-conflict land return

---

## Implementation Roadmap

### Phase 1: Foundation (Months 1-12)

#### Legal and Policy
- [ ] Land law gap analysis
- [ ] Draft necessary amendments
- [ ] Stakeholder consultations
- [ ] Cabinet/Parliament approval

#### Institutional
- [ ] Establish project management unit
- [ ] Recruit and train core staff
- [ ] Define roles and responsibilities
- [ ] Set up coordination mechanisms

#### Technical
- [ ] Deploy SOLA software
- [ ] Establish data center
- [ ] Acquire base imagery (satellite/drone)
- [ ] Develop mobile data collection app

#### Pilot
- [ ] Select 2-3 pilot districts
- [ ] Train para-surveyors (20-30 per district)
- [ ] Community awareness campaign
- [ ] Begin systematic registration

**Milestone:** 10,000 parcels registered in pilots

### Phase 2: Scale-Up (Months 13-36)

#### Expansion
- [ ] Roll out to additional districts
- [ ] Recruit and train more para-surveyors
- [ ] Establish regional offices
- [ ] Scale data center capacity

#### Services
- [ ] Launch public verification portal
- [ ] Enable online fee payment
- [ ] Certificate printing network
- [ ] Mobile notification system

#### Special Programs
- [ ] Women's participation (SDO model)
- [ ] Customary land registration
- [ ] Informal settlement upgrading
- [ ] Dispute resolution tribunals

**Milestone:** 500,000 parcels registered

### Phase 3: Enhancement (Months 37-60)

#### Transactions
- [ ] Secondary market (transfers, mortgages)
- [ ] Lease management
- [ ] Subdivision/consolidation
- [ ] Encumbrance registration

#### Integration
- [ ] Property taxation linkage
- [ ] Land use planning
- [ ] Agricultural extension
- [ ] Financial sector (credit)

#### Sustainability
- [ ] Fee structure for cost recovery
- [ ] Local government capacity
- [ ] Private sector surveying
- [ ] Continuous updating system

**Milestone:** 2,000,000 parcels registered; system self-sustaining

### Phase 4: Optimization (Months 61+)

- Tier 3 precise surveys on demand
- 3D cadastre for urban areas
- Valuation mass appraisal
- Climate/environmental overlays
- Blockchain audit trail (optional)

---

## Use Cases and Scenarios

### Citizen Use Cases

#### UC1: Farmer Securing Land for Credit

**Scenario:** Mary, a smallholder farmer in rural Ghana, wants to access a loan to buy fertilizer and improved seeds. The microfinance institution requires proof of land rights.

**Current Problem:** Mary has farmed this land for 20 years but has no documentation. She cannot access credit.

**System Solution:**
1. Para-surveyor visits Mary's village during systematic registration
2. Community witnesses confirm Mary's occupation
3. Boundaries mapped with mobile GPS
4. Tier 2 certificate issued within 2 weeks
5. Mary presents certificate to microfinance institution
6. Loan approved using land as collateral

**Impact:** 10% increase in credit access (Ethiopia data)

#### UC2: Widow Protecting Inheritance

**Scenario:** After her husband's death, Sokha in Cambodia faces pressure from in-laws to leave the family land.

**Current Problem:** Land registered only in husband's name. Customary practice favors in-laws.

**System Solution:**
1. Social Development Officer identifies Sokha during registration
2. SDO explains Sokha's legal rights under Land Law
3. Registration team confirms Sokha's joint occupation
4. Certificate issued in Sokha's name
5. In-laws see official documentation and withdraw claims
6. Sokha can remain and farm the land

**Impact:** 44% increase in women's decision-making (Ethiopia data)

#### UC3: Community Defending Against Land Grab

**Scenario:** A mining company claims concession over clan land in PNG that has been used for generations.

**Current Problem:** Clan has no formal documentation. Company has government lease.

**System Solution:**
1. Clan registered as Incorporated Land Group (reformed)
2. Clan boundaries mapped with community participation
3. Certificate issued showing clan ownership
4. Mining concession reviewed against registered boundaries
5. Overlap identified and referred to tribunal
6. Negotiation for fair compensation or relocation

**Impact:** Communities with formal recognition 3x more likely to get fair compensation

#### UC4: Family Subdividing Land

**Scenario:** A father in Ghana wants to divide his land among three children before he dies.

**Current Problem:** Informal subdivision leads to disputes after death. No clear boundaries.

**System Solution:**
1. Father applies for subdivision at regional office
2. Licensed surveyor demarcates three parcels
3. Family members sign agreement
4. Three new certificates issued
5. Original certificate cancelled
6. Digital records updated

**Impact:** Reduced inheritance disputes, clear succession

### Government Use Cases

#### UC5: Property Tax Collection

**Scenario:** Local government in Accra needs to increase revenue but has incomplete property records.

**Current Problem:** Only 30% of properties are in tax rolls. Manual records are outdated.

**System Solution:**
1. Systematic registration of all properties in district
2. Valuation assessment linked to registration
3. Tax bills generated from digital database
4. Mobile money payment integration
5. Enforcement against non-payers
6. Revenue increases by 35-150% (Colombia data)

**Impact:** Reduced dependence on central government transfers

#### UC6: Infrastructure Planning

**Scenario:** Government plans new road that will require land acquisition.

**Current Problem:** Unclear ownership leads to disputes and project delays.

**System Solution:**
1. Planners overlay road alignment on parcel map
2. Affected parcels automatically identified
3. Registered owners notified
4. Fair compensation calculated from valuation data
5. Payments made to verified owners
6. Transfers registered and road built

**Impact:** Faster project completion, fewer disputes

#### UC7: Dispute Resolution

**Scenario:** Two neighbors in Cambodia both claim ownership of boundary strip.

**Current Problem:** Court case takes years and costs exceed land value.

**System Solution:**
1. Dispute flagged during systematic registration
2. Referred to local land tribunal
3. Both parties present evidence
4. Tribunal makes determination
5. Boundary demarcated and registered
6. Dispute resolved in weeks, not years

**Impact:** 50-70% of court cases are land disputes - major system relief

### Commercial Use Cases

#### UC8: Bank Verifying Collateral

**Scenario:** Commercial bank wants to issue mortgage but needs to verify land ownership.

**Current Problem:** Manual verification takes weeks and may miss encumbrances.

**System Solution:**
1. Bank accesses public verification portal
2. Enters parcel ID or owner name
3. System returns ownership confirmation
4. Shows existing mortgages/encumbrances
5. Bank proceeds with confidence
6. New mortgage registered immediately

**Impact:** Mortgage processing time reduced from weeks to days

#### UC9: Investor Due Diligence

**Scenario:** Agricultural company wants to lease community land for plantation.

**Current Problem:** Unclear ownership leads to disputes and reputational risk.

**System Solution:**
1. Investor searches land registry for area
2. Identifies registered community/clan ownership
3. Contacts legitimate representatives
4. Negotiates fair lease terms
5. Lease registered with conditions
6. Community monitors compliance

**Impact:** Reduced conflict, better community relations

---

## Technology Recommendations

### Software: FAO SOLA Suite

**Why SOLA:**
- Free and open source
- LADM-compliant (ISO 19152)
- Proven in 7+ countries (Ghana, Nepal, Samoa, Nigeria, Lesotho, Tonga)
- Multi-language support (10 languages)
- Active development community
- Includes both formal registration and community tenure modules

**Components:**
- **SOLA Registry:** Core registration and transactions
- **SOLA State Land:** Government land management
- **SOLA Systematic Registration:** Mass registration workflow
- **Open Tenure Mobile:** Field data collection
- **Community Server:** Claim processing

**Deployment:**
- Cloud hosting (AWS, Azure, or local data center)
- Docker containerization for easy deployment
- PostgreSQL/PostGIS database
- GeoServer for spatial data

### Mobile Technology: MAST-Style Crowdsourcing

**Approach:**
- Smartphone-based data collection
- GPS for point capture (3-5m accuracy sufficient for rural)
- Camera for photo documentation
- Offline capability with sync
- Community validation workflow

**Tools:**
- Open Data Kit (ODK) or KoBoToolbox
- QField for GIS data collection
- Custom app built on Open Tenure

**Hardware:**
- Android smartphones ($100-200)
- External GPS receivers for better accuracy ($200-500)
- Solar chargers for remote areas
- Rugged cases for durability

### Mapping: Drones and Satellite Imagery

**Drone Mapping:**
- DJI Phantom/Mavic for small areas
- Fixed-wing for large areas (WingtraOne, senseFly)
- Cost: $2-10 per km²
- Resolution: 2-5 cm
- Processing: OpenDroneMap (open source) or Pix4D

**Satellite Imagery:**
- Planet Labs for regular updates
- Maxar/Airbus for high resolution
- Sentinel-2 for free medium resolution
- Cost: $0-20 per km²

**Base Map Sources:**
- OpenStreetMap for roads, buildings
- National mapping agency data
- Historical aerial photography

### Optional: Blockchain

**When to Consider:**
- After basic registration is complete
- Where corruption is severe concern
- For high-value transactions only
- When technical capacity exists

**Approach:**
- Hash of transaction on public blockchain (Bitcoin/Ethereum)
- Full data remains in national system
- Provides immutable audit trail
- Does not replace existing systems

**Caution:**
- Not a priority for basic registration
- Does not solve governance problems
- Requires reliable internet
- Ongoing costs for transactions

---

## Risk Mitigation

### Political Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Government change | Medium | High | Multi-party support, legal framework |
| Elite capture | High | High | Transparency, community oversight |
| Corruption | High | High | Digital systems, audit trails |
| Interference in adjudication | Medium | High | Independent tribunals |

### Social Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Women exclusion | High | High | Mandatory joint registration, SDOs |
| Community resistance | Medium | Medium | Awareness campaigns, traditional authority involvement |
| Ethnic tensions | Medium | High | Neutral facilitation, local language |
| Displacement | Medium | High | Safeguards, grievance mechanism |

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| System failure | Low | High | Backups, redundancy, local storage |
| Data loss | Low | High | Multiple backup sites, version control |
| Connectivity | High | Medium | Offline-first design, sync protocols |
| Capacity gaps | High | Medium | Training, documentation, mentoring |

### Financial Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Donor withdrawal | Medium | High | Fee-based sustainability, government budget |
| Cost overruns | Medium | Medium | Phased approach, contingency budget |
| Low uptake | Medium | Medium | Awareness campaigns, visible benefits |

---

## Budget Framework

### Cost Estimates per Country

#### Ghana (8 million parcels target)

| Component | Unit Cost | Quantity | Total (USD) |
|-----------|-----------|----------|-------------|
| Software & infrastructure | - | - | $500,000 |
| Drone/satellite imagery | $5/km² | 238,533 km² | $1,200,000 |
| Field registration | $10/parcel | 8,000,000 | $80,000,000 |
| Training & capacity | - | - | $3,000,000 |
| Equipment (GPS, phones) | - | - | $2,000,000 |
| Public awareness | - | - | $1,500,000 |
| Monitoring & evaluation | - | - | $500,000 |
| Contingency (15%) | - | - | $13,000,000 |
| **Total** | | | **$101,700,000** |

**Per parcel: ~$12.70**
**Timeline: 7-10 years**

#### Papua New Guinea (Estimated 3 million parcels)

| Component | Unit Cost | Quantity | Total (USD) |
|-----------|-----------|----------|-------------|
| Software & infrastructure | - | - | $400,000 |
| Drone/satellite imagery | $8/km² | 462,840 km² | $3,700,000 |
| Field registration | $15/parcel | 3,000,000 | $45,000,000 |
| Training & capacity | - | - | $2,500,000 |
| Equipment | - | - | $1,500,000 |
| Public awareness | - | - | $1,000,000 |
| Monitoring & evaluation | - | - | $400,000 |
| Contingency (20%) | - | - | $11,000,000 |
| **Total** | | | **$65,500,000** |

**Per parcel: ~$21.80** (higher due to remoteness)
**Timeline: 10-15 years**

#### Cambodia (3 million remaining parcels)

| Component | Unit Cost | Quantity | Total (USD) |
|-----------|-----------|----------|-------------|
| Software & infrastructure | - | - | $300,000 |
| Drone/satellite imagery | $4/km² | 181,035 km² | $750,000 |
| Field registration | $8/parcel | 3,000,000 | $24,000,000 |
| Training & capacity | - | - | $1,500,000 |
| Equipment | - | - | $1,000,000 |
| Public awareness | - | - | $800,000 |
| Monitoring & evaluation | - | - | $300,000 |
| Contingency (15%) | - | - | $4,300,000 |
| **Total** | | | **$32,950,000** |

**Per parcel: ~$11.00** (building on existing infrastructure)
**Timeline: 5-7 years**

### Funding Sources

1. **Government budget** - Long-term sustainability
2. **World Bank** - Largest financier of land programs globally
3. **Bilateral donors** - UK, Germany, Finland, Australia, USA
4. **Regional banks** - AfDB, ADB
5. **Fee revenue** - Registration and transaction fees
6. **Property taxes** - Increased revenue from better records

### Sustainability Model

**Year 1-5:** Donor/government funded (registration)
**Year 3-7:** Fee revenue grows (transactions begin)
**Year 5+:** Self-sustaining (fees cover operations)

Target fee revenue:
- Registration: $5-20 per parcel
- Transfer: $20-100 per transaction
- Search: $2-5 per search
- Certificate copy: $5-10

---

## Conclusion

An optimal land administration system for Ghana, PNG, and Cambodia must be:

1. **Fit-for-purpose** - Appropriate to context, not gold-plated
2. **Inclusive** - Women, customary tenure, informal settlements
3. **Scalable** - Community-based, not professional bottleneck
4. **Affordable** - $6-15 per parcel, not $50+
5. **Sustainable** - Fee-based, local capacity
6. **Incremental** - Start simple, improve over time

The technology exists. The models have been proven. What's needed is political will, institutional commitment, and sustained investment.

---

## References

1. UN-Habitat/GLTN (2016). Fit-For-Purpose Land Administration
2. World Bank (2025). Land Overview and Programs
3. FAO (2012). Solutions for Open Land Administration (SOLA)
4. Byamugisha, F. (2013). Securing Africa's Land for Shared Prosperity
5. Enemark et al. (2014). Fit-For-Purpose Land Administration
6. USAID (2016). Land Certification in Ethiopia Impact Evaluation
7. World Resources Institute (2016). The Scramble for Land Rights
8. Transparency International (2018). Corruption in Land Administration

---

*Document prepared as part of Ghana Lands Commission ERP Demo Project*
*Version 1.0 - November 2024*
