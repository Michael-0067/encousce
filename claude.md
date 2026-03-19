# Encousce v1 — Claude Build Instructions

## Purpose
Build **Encousce** as a real, authenticated web application for short, interactive romantic moments.

This is **not** a dating app, not a generic AI chat tool, not an explicit-content platform, and not a traditional long-form reading site.

Encousce is a place where users:
- browse and select **Scenes**
- choose a compatible **Lead**
- enter an **Encounter** (chat interaction)
- spend **Hearts** on user messages
- create their own Scenes and Characters through guided creator flows

The site is already live with a landing page and updates through git. Claude is being used in VS Code. This file is intended to guide the v1 build.

---

## Core Product Model
This platform is built on three layers:

- **Encousce** = the platform / destination / world
- **Scene** = the structured situation or setup
- **Encounter** = the live interaction inside the Scene

One additional important term:
- **Lead** = the character the user encounters inside the Scene

### Core principle
**Encousce is not about telling stories. It is about letting users live moments.**

That principle should guide every UX and architecture decision.

---

## Product Positioning
Encousce should feel:
- immersive
- romantic but not cheesy
- emotionally engaging
- modern and clean
- slightly mysterious
- easy to enter

Avoid:
- “AI tool” vibes
- explicit / sexual presentation
- gamified clutter
- childish tone
- overly corporate design
- complicated first-use flows

---

## Primary v1 User Flow
The primary experience should be dead simple from the user’s perspective:

1. Land on the site
2. Select a **Scene**
3. Select a **Lead**
4. Enter the **Encounter** chat
5. Spend **Hearts** on user messages

Important: the user flow should feel simple, even if the supporting system is not.

---

## Content Tier Model
Encousce has three display/content tiers:

1. **System**
2. **Featured**
3. **Community**

### Important implementation note
These are **not three separate creation systems**.
They are one content model with different origins / promotion states.

- **System** content is created by admin/system accounts
- **Community** content is created by ordinary users
- **Featured** content is promoted by admin from existing content

Users should **not** choose “system / featured / community” in creation forms.
This should be controlled by permissions and admin actions.

---

## Architecture Scope for v1
Build Encousce as a **real authenticated platform**, not a static prototype.

v1 requires:
- full user accounts
- secure authentication
- persistent user data
- persistent encounter history
- wallet / balance logic for Hearts
- secure payment-backed Heart purchases
- transaction records
- refund support in architecture
- creator flows for Scenes and Characters
- admin-compatible creation using the same front end

Do not build this as a fake UI with mocked balances or placeholder commerce.

---

## Authentication / User Backbone
v1 needs real user account infrastructure.

### Required account capabilities
- sign up
- sign in
- sign out
- forgot password / password reset
- account settings
- secure password hashing
- session management

### Minimum user model concepts
- id
- email
- display name or username
- password hash
- role
- created_at
- updated_at
- account_status
- wallet balance (preferably derived from ledger)

### Suggested roles
- user
- admin

Possibly later:
- moderator / featured curator

### Suggested account statuses
- active
- suspended
- disabled

---

## Privacy / Ownership Model
Users will own or have associated records for:
- encounters
- messages
- wallet transactions
- purchases
- refunds
- created scenes
- created characters

All of these must be user-linked and access-controlled.
Do not rely on loose session data.

v1 should also include public-facing:
- Privacy Policy
- Terms of Service
- Refund Policy

---

## Hearts Economy
Hearts are the only purchasable unit in v1.

### Pricing
- **1 Heart = $0.01 USD**
- **100 Hearts = $1.00 USD**

### v1 commerce rules
- no bundles
- no packs
- no promo codes
- no discounts
- no subscriptions
- no variable pricing

### Product framing
This should be implemented as a **wallet top-up / heart purchase flow**, not a normal multi-product shopping catalog.

### User-facing language
- Buy Hearts
- Heart balance
- Spend Hearts to send messages

Avoid tacky casino energy.
Keep it calm and premium.

---

## Wallet / Ledger Model
Do **not** implement Hearts as a single editable number only.
Use a **ledger-based transaction model**.

### The ledger should record entries such as:
- purchase credit
- message spend
- refund credit
- admin adjustment
- reversal / correction if needed

### Current balance
Balance should be derived from ledger entries or updated atomically from them.

This is important for:
- auditability
- reversibility
- refunds
- integrity

---

## Refund Support
Refund capability must exist in the architecture from day one.

Potential concepts:
- payment refund reference
- refund request record
- admin approval / review flow later
- wallet reversal / debit associated with refund if needed

Even if refund policy logic remains simple in v1, the data model must anticipate reversibility and clean accounting.

---

## Secure Commerce Requirements
At minimum:
- HTTPS only
- secure auth
- payment validation server-side
- do not trust client-side wallet state
- do not trust client-side payment success state
- atomic transaction handling for purchases and wallet updates

When a payment succeeds, the system should reliably:
1. validate payment event
2. create ledger entry
3. update balance if applicable
4. store purchase record
5. surface new balance to user

---

## Discovery / Browse Experience
The browse experience should feel familiar and extremely low-friction.

### Core concept
Use a **3x3 card grid** approach for both Scene selection and Lead selection.

### Structure
There are three stacked rows representing the three content tiers:
- top row = System / recommended
- middle row = Featured
- bottom row = Community / explore more

Each row:
- displays 3 cards visible at a time
- supports left/right arrow navigation
- supports horizontal scrolling
- may have an expand control to focus on that row while shrinking the others
- should have a reset/back-to-all state after expansion

### General browse behavior
Users should be able to bounce:
- across rows
- within rows
- between content tiers
- without heavy reloads

### Sorting
Default sort:
- **Popular**

Override:
- **Recent**

### Important note on popularity
Do **not** implement a visible like/rating system in v1.
Instead, track implicit engagement data and use that for popularity ordering.

Suggested backend popularity signals:
- scene clicks
- lead selections
- encounter starts
- messages sent
- return/resume frequency
- drop-off vs sustained interaction

### Filtering
Provide a simple filter across the top that applies globally, such as:
- All
- Modern
- Fantasy
- Historical

Keep filtering simple. No complex multi-filter query builder in v1.

Do **not** add full search in v1.

---

## Scene Cards
Scenes are the primary entry point and should be **scene-first**, not character-first.

### Visual direction
Scene cards should have a **book cover vibe**:
- cinematic
- romantic
- evocative
- clean
- click-worthy

Traditional romance cover energy is acceptable, but keep it tasteful and aligned to Encousce tone.
No explicit imagery.

### Scene card content
Each Scene card should communicate quickly:
- title
- image / cover art
- emotional hook or tension
- optional subtle tags (setting / tone / type)

### Important visual principle
The Scene cover is a doorway into a moment.
It can be somewhat traditional if that gets the click.
Do not overcomplicate v1 trying to perfect POV or silhouette logic.

---

## Lead Selection
Leads are selected **after** the Scene.

This is a deliberate design choice.
Encousce is moment-first.

### Why
- Scenes create desire
- Characters sustain it
- Character-first would drift toward generic AI-character-app energy

### Lead discovery page / step
Use the same 3x3 browse language as Scenes.

Three rows:
- System
- Featured
- Community

Same behavior:
- arrows
- horizontal scroll
- optional expand/focus
- Popular / Recent ordering
- filter support where applicable

### Lead cards should feel different from Scene cards
Scene cards = moment covers
Lead cards = person/role cards

Lead cards should communicate:
- name or role label
- visual / portrait
- brief descriptor
- slot/type fit

---

## Selection Confirmation Modal
When a user clicks a Scene or Lead card, open a gallery-style modal / popup.

### Modal behavior
- enlarged view
- left/right navigation inside modal
- confirm button
- click outside to close
- arrows to move between nearby items

### Purpose
This gives a richer preview before commitment, while keeping flow fast.

### Rules
- clicking outside closes without selecting
- clicking Confirm commits selection
- no long scrolling inside modal if possible

---

## Encounter Screen
The Encounter screen is the core product screen.
It should be a **3-column desktop-first layout**.

### Column 1 — Left: Encounter Menu
A smaller/narrower left column showing the user’s active encounters.

#### Requirements
- list of active encounters
- current encounter highlighted
- ordered by last access descending
- most recent at top
- scrollable if needed

#### Each item may show
- Scene title
- Lead name or role
- last updated indicator

This is continuity/navigation, not the main show.

### Column 2 — Center: Chat Window
This is the primary experience.

#### Requirements
- large main chat area
- message stream top-down / chronological
- input field fixed at bottom
- send action obvious and responsive
- subtle heart cost indicator near input if needed
- auto-scroll to latest message

Keep this visually clean.
Do not clutter the center column with extra controls.

### Column 3 — Right: Context Panel
This should anchor the user in the moment.

#### Top-right
Scene cover (“book cover” image)
- title
- optional small hook

#### Middle-right
Lead card / portrait
- name
- type or role
- brief descriptor

#### Bottom-right
User/admin utility actions, such as:
- Reset Encounter
- Exit / back to browse
- related admin/testing controls if role permits

### Encounter reset
Reset should:
- clear message history for that encounter instance
- restart from opening moment
- keep the same Scene + Lead pairing
- require confirmation

### Persistence rules
Encounters should persist in v1.
Users can leave and return later.
No auto-expiry needed in v1.

---

## Encounter UX Tone
This screen should not feel like a productivity dashboard.
It should feel like:
- a conversation unfolding inside a moment
- with just enough surrounding context to stay grounded

The center column is sacred.
Side columns support it but should not compete with it.

---

## Mobile Consideration
Desktop-first is fine for initial build, but design with collapse in mind.
Likely mobile approach later:
- chat primary
- encounters list as drawer / panel
- scene/lead context as collapsible panel

Do not let mobile complexity derail v1 desktop implementation.

---

## Onboarding
Do not overbuild onboarding.
But include something lightweight.

### Recommended minimal onboarding
A soft inline explanation or one-time overlay:
- Choose a Scene
- Choose who you encounter
- Start the moment

One dismiss button is enough.

---

## Empty States
Design explicit empty states for:
- no encounters yet
- no hearts
- no created scenes
- no created characters

These should not feel dead.
They should redirect users toward action.

Examples:
- “You haven’t stepped into a moment yet.”
- “You don’t have any active encounters.”
- “You need Hearts to continue this Encounter.”

---

## Hearts UX Inside Encounter
Low or zero balance must be handled gracefully.

### Low balance
- subtle visual cue
- gentle prompt

### Zero balance when sending
- intercept send
- show modal/prompt to buy Hearts
- do not let this feel cheap or manipulative

Tone should remain calm and premium.

---

## Creator System Overview
Encousce v1 needs **two separate creation pages**.
Do **not** combine Scene and Character creation into one giant form.

### Required pages
- Create Scene
- Create Character

This mirrors the platform logic:
- Scene = the moment container
- Character/Lead = the reusable person asset

### Important principle
**Freeform inside structure**

The system should give creators defined sections with freeform fields inside them.
Some creators will be stronger than others. That is okay.
The product goal is to make “great” achievable in a predictable way.

---

## Scene Creation Page
The Scene creator is for building the **moment setup**.

### It defines
- setting
- situation
- emotional hook
- opening moment
- compatible lead type(s)
- tone / atmosphere

### Suggested v1 fields / sections
1. **Scene title**
2. **Cover image / image prompt**
3. **Setting** (Modern / Fantasy / Historical, etc.)
4. **Core situation**
5. **Emotional hook**
6. **Opening moment** (critical)
7. **Tone tags**
8. **Allowed lead type 1**
9. **Allowed lead type 2** (optional)
10. **Visibility / draft status**

### Notes
- opening moment is especially important
- this should feel like building a moment, not completing bureaucracy
- examples/help text are encouraged

---

## Character Creation Page
The Character creator is for building the **Lead asset**.

### It defines
- name
- type / slot
- compatible settings
- personality
- dialogue style
- behavior constraints

### Suggested v1 fields / sections
1. **Character name**
2. **Portrait image / image prompt**
3. **Primary type / role**
4. **Secondary type** (optional)
5. **Compatible settings**
6. **Core personality**
7. **Interaction style**
8. **Dialogue tone / speech style**
9. **Behavior rules / boundaries**
10. **Visibility / draft status**

### Notes
This page should feel like casting a reusable lead into future moments.

---

## Shared Creation Experience
Admin and users should use the **same creation front end**.

### Important principle
**One creation experience. Different permissions.**

Do not build a totally separate admin-only content editor for v1.

Why:
- faster build
- better testing
- real creator-flow validation
- less duplication

---

## Admin / System Content Rules
Admin should use the same creation flow, but with different permissions and output behavior.

### For admin/system accounts
- created content is stored as **system** content
- admin may bypass heart spending / throttles in testing and use
- admin may have effectively unlimited hearts
- same front-end flow should be used where practical

### For normal users
- created content is stored as **community** content

### Featured content
Featured should **not** be authored as a separate content type in the form.
It should be promoted later via admin workflow.

---

## Testing Strategy Assumption
The owner plans to:
- create admin/system content
- create one or more normal user accounts
- fund those user accounts
- create community content through normal user flows
- test the real purchase and encounter loops

Therefore:
- normal user registration must work in v1
- community creation must work in v1
- wallet / Hearts purchase flow must work for ordinary users
- admin privilege should be additive, not a substitute for the user path

Build the real user path.
It will be used immediately.

---

## Scene / Lead Matching Model
Internally, Scenes and Leads should match through structured type logic.

### Important conceptual model
Scenes do **not** hand-assign individual characters.
Instead:
- Scenes define compatible lead type(s)
- Characters/Leads define which type(s) they belong to
- the system surfaces eligible leads accordingly

### Practical v1 direction
Keep type selection narrow and understandable.
Do not allow sprawling taxonomy.

Example mental pattern:
- Modern + Dominating
- Modern + Shy
- Fantasy + Authority

Internally, it is smarter to separate:
- Setting
- Role/Type

But the UI may present them in combination if helpful.

### Creator discipline
Creators should usually slot a Lead into one clear primary type, with at most one secondary type.
This supports self-policing and content clarity.

---

## Recommended v1 Scope of Roles / Types
Keep this narrow.
Do not explode taxonomy in v1.

Use a small set of strongly readable archetypal types.
Refine later based on actual usage.

This can be informed by proven romance dynamics, but do not blindly copy book-market categories.
The goal is not “genre romance sorting.”
The goal is emotionally legible interactive casting.

---

## Visual Direction
General visual direction should be:
- cinematic
- editorial
- premium
- moody but clear
- romantic without explicitness
- modern app polish with atmosphere

### Color direction
Dark, soft, immersive palette.
Think:
- charcoal
- plum
- muted rose
- warm cream / soft ivory accents

Avoid bright startup/SaaS color energy.

### Typography direction
- elegant editorial serif for larger headings / major moments
- clean sans-serif for UI and body copy

### Spacing
Airy, not sparse.
Give the interface room to breathe.

---

## Performance Expectations
This needs to feel fast.

Priorities:
- fast page load
- smooth card interaction
- responsive chat updates
- minimal jank
- lightweight transitions

Slow equals dead.
Do not bury the product under heavy front-end ornamentation.

---

## Error Handling
v1 needs calm, clear handling for:
- failed sign in
- failed purchase
- failed message send
- missing content
- interrupted sessions

Messages should be human and reassuring, not technical dumps.

---

## Analytics / Tracking Hooks
Even if there is no visible analytics dashboard yet, track enough to learn from behavior.

Suggested events / data points:
- scene card click
- scene confirm
- lead card click
- lead confirm
- encounter start
- message sent
- encounter resumed
- encounter reset
- heart purchase started
- heart purchase completed
- low-balance prompt shown

This data will help decide later what to promote, feature, refine, or remove.

---

## Moderation / Safety Control (Light v1)
Do not overbuild moderation.
But there must be basic control.

Suggested content states:
- draft
- published
- hidden
- archived
- removed

Suggested user states:
- active
- suspended
- disabled

At minimum, admin must be able to hide content and disable abusive accounts.

---

## Things NOT to Add in v1
Do not add these yet unless required later:
- visible likes / rating system
- comments
- follower system
- social feed
- public creator profiles with complexity
- complicated recommendation engine
- full search
- subscriptions
- coupons / promo logic
- multiple product catalog
- separate bespoke admin CMS for content creation

Keep v1 focused.

---

## v1 Completion Standard
v1 is successful if a real user can:
- sign up
- sign in
- buy Hearts
- browse Scenes
- confirm a Scene
- browse compatible Leads
- confirm a Lead
- enter an Encounter
- spend Hearts sending messages
- leave and return later
- reset the Encounter if desired
- create a Scene
- create a Character
- publish community content
- see distinctions between system / featured / community content

And if admin can:
- create system content using the same creation flow
- bypass heart limits where appropriate
- promote/hide content as needed

---

## Final Direction for Claude
Build Encousce v1 as a **real, secure, consumer-facing web application** with:
- strong emotional browse/entry UX
- simple scene-first interaction flow
- persistent authenticated accounts
- a ledger-backed Hearts wallet
- secure checkout-backed heart purchases
- separate Scene and Character creation pages
- one shared creation experience with role-based behavior
- system / featured / community content structure
- a clean 3-column Encounter screen

Keep the front end simple for the user.
Hide complexity behind it.
Favor cohesion, clarity, and smoothness over feature sprawl.

