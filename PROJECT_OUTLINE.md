# Anijjung Network — Project Outline

Document status: Draft_141069
This document separates existing capabilities from proposed development. Proposed items are not approved implementation requirements.

## 1. Project Identity and Overview

- **Anijjung Network**: The project name and household network concept.
- **Anijjung Village Explorer**: The prototype website for exploring a conceptual village and household information.
- Context: A proposed project for households in Thailand, not an established or verified membership network.

The project helps households understand their food, water, and energy resources, access learning opportunities, and choose whether to offer resources for voluntary sharing.

**Project description:**

> Anijjung Network connects households that want to plan their resources and learn together. It supports preparation for greater household independence throughout the year: producing energy for household needs, developing a reliable supply of safe drinking water, and maintaining recurring food production across seasons. Voluntary sharing and learning help households work toward these goals at their own pace.

Year-round independence is a project objective, not a capability certified by the prototype or a guarantee that every household can achieve full self-sufficiency.

## 2. Objectives and Intended Users

Project objectives:

1. Make household resource information accessible through an interactive 3D village.
2. Support household self-assessment and planning for food, water, and energy, while making uncertainty visible.
3. Help other households prepare for greater independence throughout the year, including:
   - Energy production that can meet household needs across seasons, with storage or backup arrangements considered where necessary.
   - Water collection or supply, treatment, and storage that can support safe drinking water throughout the year.
   - Recurring food production through crop rotation, staggered planting, harvest cycles, and preservation, rather than relying only on a one-time food reserve.
4. Connect interested households through voluntary participation and resource sharing.
5. Provide access to learning resources and external organizations that may support household preparation.

The current prototype records a limited resource snapshot. It does not model seasonal production, verify drinking-water safety, assess nutrition, or establish year-round resource independence.

Suggested user groups, subject to owner review:

- Households interested in resource planning and joining a network.
- People who want to offer resources and people seeking a share of those resources.
- Community coordinators and people interested in household self-reliance.

**Owner input:** Initial area __________ / Primary users __________ / First problem to address __________

## 3. Implemented Scope

| Component | Current behavior |
|---|---|
| Home dashboard | Opens the existing 3D village with five fictional sample houses and houses added in the browser. |
| Scene and navigation | Low-poly houses, solar panels, water tanks, porches, woodland, vegetable beds, a pond, and a pavilion; rotate, zoom, pan, and reset the view. |
| Household details | Select a house in the scene or by its numbered button to view resource information and sharing interest. |
| Sharing connections | Toggle illustrative connections between interested households; connections do not represent deliveries. |
| WHO WE ARE | Explains the project, concept, and prototype limitations. |
| JOIN A NETWORK | Adds a household through a form, records sharing interest, and reloads the scene after saving. |
| SHARING | Creates resource listings with quantity, unit, price or free status, area, conditions, and local trial requests. |
| Help and learning directory | Thirty external resources: ten each for food, water, and energy; category selection, search, and reference links. |
| Mobile interface | Collapsible navigation and scrollable bottom detail panels. |

Current limitations:

- Four additional houses are supported: houses 06–09, for nine houses in total. This is an application limit, not a Three.js limit.
- New houses use predefined conceptual positions, not real coordinates.
- Entered data is stored only in localStorage for that browser and origin. It is not shared across devices or users.
- There are no user accounts, backend, central database, or verified household ownership.
- There is no interface to edit or delete houses or listings, or change an existing house's sharing status from the dashboard.
- Requests are not sent to listing owners, do not reduce listed quantities, are not automatically approved, and involve no payment processing.

## 4. Pages and User Flows

### Home — Village Explorer

Rotate or zoom the scene → select a house → read its details → optionally display sharing-interest connections or open the learning directory.

Main controls, described here in English: Reset view / Close details / Show sharing network / Help and learning resources. The application interface currently remains in Thai.

### WHO WE ARE

Explain the project's purpose, intended users, participation process, and limitations.

**Owner content to refine:** Origin story, founders, operating principles, and project contact information. Use the project description in Section 1 for the year-round independence objective.

### JOIN A NETWORK

Enter household information → select sharing interest → consent to local storage → save → return to the dashboard and see the new house.

Sharing interest expresses intent, not confirmed resource availability. Joining does not automatically create SHARING listings.

### SHARING

Select an interested household → enter a resource and its conditions → create a listing → enter a request → save the trial request locally.

A price of zero means free. Other prices are in Thai baht per unit. Estimated total = requested quantity × unit price, excluding travel or delivery costs.

### Help and Learning Resources

Open the directory using its button or the pavilion roof → choose food, water, or energy → search → read cards and open website or reference links.

External organizations are not placed inside the fictional village. Their information has not been verified with the organizations.

## 5. Data and Self-Assessment Metrics

| Dataset | Main fields |
|---|---|
| Household | ID, name, resident count, province/district, contact information, sharing interest, and conceptual scene position. |
| Water | Stored water in litres and total household daily consumption in litres/day. |
| Food | Self-reported food reserve duration in days. |
| Energy | Illustrative daily solar generation and total household electricity consumption in kWh/day. |
| Sharing listing | ID, offering household, category, resource name, quantity, unit, price, area, conditions, and update date. |
| Request | Listing ID, requester name and contact information, quantity, message, and creation date. |
| Learning resource | Name, category, area, description, website, reference, and verification date. |

### Self-assessment and uncertainty

Food, water, and energy metrics are **household self-assessments** when entered by users. The initial five houses instead contain fictional examples. Neither source constitutes an independently verified resource assessment.

Reported quantities, consumption, and reserve durations may be approximate. Actual resource duration can deviate from estimates because of changing household use, visitors, weather, seasonal availability, storage losses, spoilage, equipment performance, and interruptions to replenishment.

An estimated number of days is a planning aid, not a guaranteed duration or a prediction of future conditions. No statistical error margin or confidence interval is established by the current prototype.

### Current calculations and handling

Water reserve days = **stored water / total household daily water consumption**.

- This estimate assumes the stated consumption remains constant and excludes future replenishment and losses. It does not establish how much stored water is safe to drink.
- Zero or missing consumption displays the application's equivalent of “Cannot calculate yet.”
- Resource fields may be left blank. Unknown values must not be treated as zero.
- Food reserve days are entered by the household, not calculated from an inventory, diet, or nutritional requirements.
- Energy values are daily generation and consumption figures. The prototype does not calculate energy reserve days; doing so would require additional information such as usable battery capacity and essential loads.
- Sample houses are identified as fictional data; added houses are identified as user-entered data.
- Contact information is not displayed in household details or public listings, but remains stored in the browser. This is not an authenticated confidential storage system.

### Proposed future support for year-round planning

Subject to owner review, future assessments could include seasonal production and consumption records, water treatment and quality-test information, storage capacity, maintenance needs, recurring food harvests, and backup options. These fields and calculations are not implemented.

## 6. Information Presentation Principles

- Identify the layout as conceptual, not an existing village or an engineering-approved site plan.
- Present household resource metrics as self-assessments and estimated durations as uncertain planning indicators.
- Explain that actual resource duration may differ from estimates; do not invent precision or verification.
- Do not imply stored water is safe to drink. Year-round drinking-water independence requires suitable treatment and verification of water quality.
- Do not treat daily solar generation as evidence of electricity availability during an outage or throughout the year.
- Do not create an overall readiness score or claim verified 100% self-sufficiency.
- Distinguish the goal of year-round independence from short-term reserves and from evidence that the goal has been achieved.
- Do not equate sharing interest with available stock or confirmed delivery.
- Do not invent phone numbers, verification dates, or services offered by external organizations.
- Clearly distinguish local saving from actually sending a request before the user confirms an action.

## 7. Proposed Development — Not Yet Implemented

This sequence is a proposal for the owner to revise, not an approved roadmap.

| Priority | Proposed work | Decisions needed first |
|---|---|---|
| 1 | Refine project content and user flows. | Primary users, pilot area, participation meaning, and year-round independence goals. |
| 2 | Edit/delete households, change sharing interest, and manage listings. | Editable fields and effects on existing listings and requests. |
| 3 | Export/import trial data. | Backup format and handling of personal information. |
| 4 | Backend and member accounts. | Household ownership, access permissions, and data policy. |
| 5 | Send real requests and manage their status. | Acceptance, rejection, cancellation, remaining quantities, and communication. |
| 6 | Develop self-assessment support for year-round resource planning. | Seasonal inputs, assumptions, uncertainty wording, and evidence needed before making any capability claims. |
| 7 | Support more households. | Exploration design and performance testing on actual target devices. |

Real membership requires decisions about permissions, privacy, backups, and listing management before shared use begins.

## 8. Paused Ideas and Items Outside the Current Scope

**Paused following the rollback:** A network overview using group points, 1,000 fictional households, and separate 3D scenes per group. This functionality was reverted and is absent from the current version. It should remain paused until the owner decides otherwise.

**Not implemented:** Payment processing, real transactions, disaster simulation, real-world forecasts, blockchain, and AI APIs.

Payment processing or expansion into a trading marketplace requires a separate scope decision beyond the voluntary-sharing prototype.

## 9. Technology and Main Files

The application uses Vite, vanilla JavaScript, CSS, Three.js, and OrbitControls. The scene requires no external models or image assets.

| File | Purpose |
|---|---|
| `src/main.js` | Dashboard and household details. |
| `src/scene.js` | 3D houses, camera, selection, and sharing connections. |
| `src/landscape.js` | Trees, kitchen gardens, and landscape. |
| `src/households.js` | Sample households and the water reserve calculation. |
| `src/network-pages.js` | WHO WE ARE, JOIN A NETWORK, and SHARING. |
| `src/network-store.js` | Browser data schema and persistence. |
| `src/resources.json` | Help and learning directory data. |
| `src/resources-ui.js` | Directory categories and search interface. |
| `src/style.css` | Desktop and mobile presentation. |
| `README.md` | Setup, running, and verification instructions. |

## 10. Verification Guidelines

When functionality changes, verify the relevant behavior:

- Build and tests pass; a successful build alone does not establish browser behavior.
- Rotate, zoom, pan, reset, and select houses; dragging must not accidentally select a house.
- Houses 04 and 05 demonstrate unavailable water-duration calculations.
- Added houses match their submitted data and remain after refreshing the same browser.
- Sharing listings use interested households and do not automatically consume or publish household reserves.
- Free/paid amounts, requested quantities, and estimated totals are correct, without implying requests were sent.
- Learning resources, categories, search, and links match the source data.
- Mobile navigation and panels allow users to complete the intended actions.
- Storage failures produce an error rather than a success message.
- Future self-assessment features distinguish estimates from verified facts and do not imply certified year-round independence.

Testing a mobile viewport does not prove performance on physical devices. Test target devices before real-world release.

## 11. Owner Review Checklist

- [ ] Confirm the project names in Section 1.
- [ ] Identify primary users and the pilot area.
- [ ] Refine the meaning of year-round household independence and the first practical steps toward it.
- [ ] Confirm how self-assessment assumptions and possible deviations should be communicated.
- [ ] Confirm which information may be visible to others and which must remain private.
- [ ] Decide whether joining requires approval.
- [ ] Define permitted resource types and free/paid sharing conditions.
- [ ] Define real request handling and coordination.
- [ ] Prioritize the proposed work in Section 7.
- [ ] Confirm whether grouped village exploration should remain paused or be reconsidered.

**Owner revision notes:**

> Add comments, revised objectives, or scope changes here.
