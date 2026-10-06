// Single source of truth for every case study.
// Any string starting with "TODO" renders as a highlighted placeholder on the site,
// so you can see at a glance what still needs filling in.
//
// Fields: slug, title, client, company (employer at the time), year, role, type ('work' | 'independent'),
// status (optional), link (optional), tags, hue (0–1, colour of the project), summary,
// meta { timeline, team, platform }, metrics [{ value, label }],
// context, problem, contribution [], process [{ step, text }], decisions [], outcomes [], learnings [],
// cover (optional image path), images [{ src, caption }] (optional, under assets/work/<slug>/),
// quote { text, by } (optional). Client names are anonymised; screens are blurred for confidentiality.

export const projects = [
  {
    slug: 'optima-ai',
    title: 'Optima AI',
    client: 'Bamboo Connect (UK)',
    company: 'WNS Global Services',
    year: '2025 — 2026',
    role: 'Product Manager',
    type: 'work',
    featured: true,
    tags: ['AI', 'Enterprise SaaS', 'Insurance', '0 → 1'],
    hue: 0.02,
    summary: 'A unified operations platform for Bamboo Connect, a UK company that sources, checks and ships replacement devices for insurers. I took it from day zero to production, starting with a completely reinvented quality-check flow that cut QC time by 60%.',
    meta: { timeline: 'Oct 2025 — Aug 2026', team: '25+ across engineering, QA, data & design', platform: 'Web platform with scanner, ERP & partner API integrations' },
    metrics: [
      { value: '60%', label: 'Less time to quality-check a device, after redesigning the QC flow' },
      { value: '3 weeks', label: 'Onsite discovery in the UK with 20+ executives and 8+ teams' },
      { value: '150+', label: 'User stories behind a phased release plan' },
      { value: '18+', label: 'AI use cases mapped for the next phase' }
    ],
    cover: 'assets/work/optima-ai/cover.jpg',
    images: [
      { src: 'assets/work/optima-ai/claim-validation.jpg', caption: 'Claim validation: device checks, lock status and scheme rules in one view' },
      { src: 'assets/work/optima-ai/fulfilment.jpg', caption: 'Product fulfilment with configurable alternative-device suggestions' },
      { src: 'assets/work/optima-ai/qc-flow.jpg', caption: 'To-be QC flow, redesigned from the existing multi-team process' },
      { src: 'assets/work/optima-ai/qc-manager-ia.jpg', caption: 'Information architecture for the QC Manager role' },
      { src: 'assets/work/optima-ai/automated-claims-flow.jpg', caption: 'Automated claims task flow, from API request to closure' }
    ],
    context: 'Bamboo Connect buys, tests, grades and ships phones and laptops for the device-protection schemes of a global insurer. Around 14 teams (procurement, warehouse, processing, software, sales, finance, compliance and more) ran the business on spreadsheets, email, WhatsApp and a handful of legacy systems.',
    problem: 'Quality checks for new and graded devices passed through four teams with manual handoffs. Results were recorded in several places, there was no device-level audit trail, and supplier reports were compiled by hand after the fact. Claims fulfilment had the same pattern: fragmented partner integrations, file-based tracking and spreadsheet-driven sourcing.',
    contribution: [
      'Owned vision, roadmap and backlog for the QC and claims modules — roughly 75% of the product scope.',
      'Joined from the July 2025 proposal workshops and led three weeks onsite in the UK with 20+ executives and 8+ operations teams.',
      'Reinvented the QC flow end to end, rather than digitising the existing one.',
      'Defined Claim TAT as the north-star metric, with KPIs for throughput, turnaround and error rates.',
      'Led a 25+ member cross-functional team in Agile sprints and mentored 8+ product and design team members.'
    ],
    process: [
      { step: 'Discover', text: 'As-is workshops for every business line, warehouse tours and stakeholder walkthroughs. I mapped who does what, in which system, and where work breaks.' },
      { step: 'Define', text: 'Current-vs-future process maps per module, six personas (Operator, Team Lead and QC Manager for QC; Claim Supervisor, Scheme Manager and Scheme Operator for claims), screen maps for each role, 150+ user stories and a phased release plan with QC first.' },
      { step: 'Design', text: 'Figma prototypes validated live with the client during the UK visit, plus configurable QC templates and scheme-level claims configuration.' },
      { step: 'Build', text: 'Agile delivery with a 25+ member team. I aligned the product data model with Bamboo’s ERP partner and ran knowledge-transfer sessions on each flow for the engineering team so every device variant maps cleanly across systems.' },
      { step: 'Evolve', text: 'Rule-based automation shipped first; 18+ AI use cases documented where AI can replace manual decisions next.' }
    ],
    decisions: [
      'Redesigned QC from scratch instead of digitising it. Collapsing four teams’ handoffs into one guided, device-level flow is where the 60% time saving came from.',
      'Launched QC first as the pilot: high volume, contained scope and measurable impact before taking on claims.',
      'Made detailed cosmetic-damage counts optional after operators flagged they would slow processing and hurt their KPIs.',
      'Designed an automated claims path: the system validates the claim, checks stock and suggests alternatives on its own, and people step in only for exceptions.',
      'Gave every QC batch a visible SLA state (on time, at risk, breached) so managers act before a deadline is missed.',
      'Capped alternative-device suggestions at five, configurable per scheme, so agents get choice without noise.',
      'Rules before AI: structured, auditable workflows create the clean data the AI roadmap depends on.'
    ],
    outcomes: [
      'QC module shipped to production; time per QC cycle fell by 60%.',
      'Claims fulfilment roughly half shipped by August 2026.',
      'Replaced 10+ disconnected tools and manual handoffs with one platform, with device-level audit trails.',
      'Live Claim TAT dashboards for each business unit cut manual reporting effort by 90%.'
    ],
    learnings: [
      'Digitising a broken process only makes the wrong thing faster. The biggest gains came from asking why each QC step existed at all.',
      'Being on the warehouse floor surfaced edge cases no workshop would have. Three weeks onsite saved months of rework.',
      'Ship one module end to end before widening scope: a working QC pilot earned the trust to take on claims.',
      'AI readiness starts with data. Rules and audit trails first, models after.'
    ]
  },
  {
    slug: 'northern-neck-insurance',
    title: 'Northern Neck Report Hub',
    client: 'Northern Neck Insurance (US)',
    company: 'WNS Global Services',
    year: '2024 — 2025',
    role: 'Product Manager',
    type: 'work',
    featured: true,
    tags: ['Insurance', 'Data & BI', 'AI', 'Power BI'],
    hue: 0.58,
    summary: 'Turned 450+ legacy reports from six platforms into 60 self-serve Power BI dashboards. Agency reports now send themselves every month, and service agents answer agency questions on the call instead of 3–4 hours later.',
    meta: { timeline: 'Nov 2024 — Oct 2025', team: '8 across data engineering, Power BI and design', platform: 'Power BI, Power Automate, central data warehouse' },
    metrics: [
      { value: '450+ → 60', label: 'Legacy reports consolidated into Power BI dashboards (87% fewer)' },
      { value: '3–4 hrs → live', label: 'Time for a service agent to pull an agency’s data, now answered during the call' },
      { value: '120+ hrs', label: 'Analyst time saved every month' },
      { value: '+6 months', label: 'Engagement extension won on the back of Phase 1' }
    ],
    cover: 'assets/work/northern-neck-insurance/cover.jpg',
    images: [
      { src: 'assets/work/northern-neck-insurance/report-hub.jpg', caption: 'Report Hub: one entry point to summary, drill-down and detailed views' },
      { src: 'assets/work/northern-neck-insurance/summary.jpg', caption: 'Agency production & loss report (APLR): KPIs first, details on demand' },
      { src: 'assets/work/northern-neck-insurance/book-management.jpg', caption: 'Book management: an agent’s whole book of business with alerts' },
      { src: 'assets/work/northern-neck-insurance/briefcase.jpg', caption: 'Executive briefcase: company KPIs tracked against budget' }
    ],
    context: 'Northern Neck Insurance, a US property and casualty insurer, ran its reporting across six platforms: Cloverleaf, BIRT, Looker, Crystal Reports, a MySQL data warehouse and its Guidewire policy system. Sales, underwriting, claims, finance and the agency team each kept their own reports.',
    problem: '450+ reports, many of them near-duplicates, were built and emailed by hand. There was no single source of truth. When an agency called customer service, agents had to request that agency’s numbers and wait 3–4 hours to answer.',
    contribution: [
      'Involved from day zero, through due diligence, discovery and delivery.',
      'Redesigned the report estate: found similar reports, merged them and cut the total by 87%.',
      'Ran client meetings and presentations, managed the delivery team and reported to senior management.',
      'Oversaw Phase 2 after moving full-time to Optima AI in October 2025.'
    ],
    process: [
      { step: 'Prioritise', text: 'In due diligence, agreed with the client to put the highest-value reports in Phase 1 to fit time and budget, and to move low-priority reports to Phase 2.' },
      { step: 'Inventory', text: 'Catalogued every report: source platform, usage, frequency, department, delivery method, KPIs, dimensions and complexity. Phase 1 alone covered 180 reports.' },
      { step: 'Rationalise', text: 'Grouped reports that answered the same question. For example, 55 per-agency monthly production and loss reports became one filterable APLR dashboard.' },
      { step: 'Design', text: 'Figma prototypes for the Report Hub, summary, group-agent, individual-agent and year-over-year drill-down views, validated with the client before build.' },
      { step: 'Automate', text: 'Built in Power BI on one central source. A Power Automate flow sends each agency its APLR on the 5th of every month.' }
    ],
    decisions: [
      'One parameterised report instead of dozens of copies: agency, line of business and period become filters, not files.',
      'Gave customer-service agents direct access to the APLR, filtered by agency ID, so questions get answered while the agency is still on the line.',
      'Automated monthly distribution from a maintained list of agencies, rather than having someone export and email reports every month.',
      'AI where it reduces reading: Power BI smart narratives write plain-English summaries on key dashboards.'
    ],
    outcomes: [
      'Consolidated 450+ reports from six platforms into 60 self-serve Power BI dashboards (87% fewer).',
      'Agency reports now arrive automatically on the 5th of every month, with no manual exports.',
      'Service agents answer agency questions during the call instead of 3–4 hours later.',
      'Saved an estimated 120+ analyst hours per month.',
      'Phase 1 delivered on time; the client extended the engagement by six months for Phase 2.'
    ],
    learnings: [
      'Most report sprawl is the same question asked by different teams. Find the question, not the report.',
      'Prioritising hard in due diligence protected the deadline, and delivering on time is what won Phase 2.',
      'The most valuable features are often invisible: a report that sends itself, or an answer given while the customer is still on the line.'
    ]
  },
  {
    slug: 'media-intelligence',
    title: 'Media Intelligence Platform',
    client: 'Mediaplus (House of Communication), Germany',
    company: 'WNS Global Services',
    year: '2025',
    role: 'Product Manager — client delivery',
    type: 'work',
    featured: true,
    tags: ['GenAI', 'Analytics', 'Client delivery'],
    hue: 0.98,
    summary: 'A GenAI media-intelligence platform for Mediaplus, one of Germany’s leading media agencies. I led client delivery after launch — redesigns, new reports and urgent requests — including a pitch prototype built over a single weekend.',
    meta: { timeline: '2024 — 2025 (weekend pitch prototype: March 2025)', team: 'Design, front-end, back-end & Power BI teams', platform: 'Web platform with Power BI reports' },
    metrics: [
      { value: '1 weekend', label: 'From brief to a pitch-ready prototype' },
      { value: '4', label: 'Modules in the prototype: Cockpit, Modelling, Execution, Simulation' },
      { value: '2:20', label: 'Screencast walkthrough delivered for the pitch' }
    ],
    cover: 'assets/work/media-intelligence/cover.jpg',
    images: [
      { src: 'assets/work/media-intelligence/modelling.jpg', caption: 'Modelling: recommended media-spend shifts with an AI summary' },
      { src: 'assets/work/media-intelligence/simulation.jpg', caption: 'Simulation: testing budget scenarios before committing spend' },
      { src: 'assets/work/media-intelligence/audience-builder.jpg', caption: 'AI-assisted audience builder over consumer survey data' },
      { src: 'assets/work/media-intelligence/self-serve-bi.jpg', caption: 'Self-serve BI: ask business questions in plain language' }
    ],
    context: 'Mediaplus, part of the House of Communication group, used a GenAI platform to build audiences from consumer survey data, track campaigns and model media spend. Another team designed and built the core product.',
    problem: 'After launch, the client needed new reports, redesigns and pitch-ready material on very tight deadlines, delivered across design, front-end, back-end and Power BI teams without breaking the product’s consistency.',
    contribution: [
      'Owned client management, meetings and presentations.',
      'Led redesigns and design support, managing the design team.',
      'Coordinated developers, back-end and Power BI teams for reports integrated into the platform.',
      'Defined the conversational “ask anything” feature: knowledge base, expected questions, what the bot does when it can’t answer, and its error and default states.',
      'Turned urgent requests into shipped work — including a weekend pitch prototype.'
    ],
    process: [
      { step: 'Brief', text: 'Saturday: a request for a media-cockpit prototype ahead of a pitch to a global fast-food brand. First screens went out the same evening.' },
      { step: 'Reframe', text: 'The client clarified it wanted the agency’s own neutral design, not the brand’s, so the prototype could be reused in other meetings. We reworked it overnight.' },
      { step: 'Deliver', text: 'Sunday: the full screen set with two sign-in options. Monday morning: screenshots and a 2:20 screencast.' },
      { step: 'Present', text: 'The client’s Global Chief Data Officer presented it the same day.' }
    ],
    decisions: [
      'Kept the prototype brand-neutral in the agency’s design system so one build could serve many pitches.',
      'Designed honest failure states: when the assistant doesn’t know, it says so (“I’m sorry, I can’t answer that yet, I’m still learning”) and, depending on context, offers to connect the user with a customer-care agent.',
      'Put an AI summary next to every model output, so non-analysts can read recommendations in plain language.',
      'Held the screencast to 2:20 — long enough to show the full flow, short enough for a pitch slot.'
    ],
    outcomes: [
      'Prototype presented to a global fast-food brand; the client reported it went really well.',
      'Recognised by WNS’s Chief Growth Officer and two Corporate Vice Presidents for delivery over the weekend while travelling.'
    ],
    quote: { text: 'Thanks so much. I just presented it to [the brand] and it went really well!', by: 'Global Chief Data Officer, Mediaplus' },
    learnings: [
      'In client delivery, speed and judgment beat polish: a clear prototype by Monday is worth more than a perfect one next week.',
      'Share drafts early. The brand-neutral pivot only cost a night because we showed first screens on day one.',
      'Conversational AI needs designed failure states. An honest ‘I don’t know’ plus a route to a human keeps users’ trust.'
    ]
  },
  {
    slug: 'cargo-intake-calculator',
    title: 'Cargo Intake Calculator',
    client: 'Cargill — Ocean Transportation',
    company: 'WNS Global Services',
    year: '2023 — 2024',
    role: 'Product Manager',
    type: 'work',
    tags: ['Logistics', 'Enterprise', 'Redesign'],
    hue: 0.55,
    summary: 'Redesigned a maritime cargo-intake and stowage-planning tool into a guided, real-time workflow, cutting processing time by 60%.',
    meta: { timeline: 'Jun 2023 — Jan 2024', team: '5', platform: 'Web application' },
    metrics: [
      { value: '60%', label: 'Less processing time per stowage plan' },
      { value: '10', label: 'Safety and loading limits checked live on one screen' },
      { value: '±0.5%', label: 'Target accuracy for total cargo intake' }
    ],
    cover: 'assets/work/cargo-intake-calculator/cover.jpg',
    context: 'Cargill’s Ocean Transportation team plans how much bulk cargo (grain, coal, ore, sugar) each ship can safely carry, and where to put it. Planners worked from ship loading manuals, spreadsheets and separate loading tools, and every vessel’s data came in a different format.',
    problem: 'Every stowage plan meant checking up to ten limits — draft, trim, hull bending and shear stress, stability, hold strength, propeller immersion and more — across disconnected tools. Plans were slow to build and hard to verify at a glance.',
    contribution: [
      'Led the product redesign of the intake calculator into a guided, real-time workflow.',
      'Defined the MVP scope: vessel setup, voyages, the stowage-plan calculator and printable reports.',
      'Broke the calculation logic into prioritised workflows engineers could build in order.',
      'Ran a UX audit of a second internal tool for charter contracts and laytime calculation.'
    ],
    process: [
      { step: 'Discover', text: 'Studied real stowage plans and loading printouts from past voyages, and the domain requirements with the client’s digital team.' },
      { step: 'Define', text: 'Scoped the MVP and ranked the work into eight tiers, from basic operation to stability and post-MVP optimisation.' },
      { step: 'Design', text: 'One calculator screen: compliance indicators on top that turn red when a limit is broken, an interactive ship outline, tabs for cargo, ballast and fuel, and strength and stability charts.' },
      { step: 'Deliver', text: 'Documented each calculation workflow, data table and vessel template so engineering could build against them.' }
    ],
    decisions: [
      'Every change recalculates instantly, so planners see the effect of each tonne on every limit.',
      'Clearly flag results based on estimated vessel data, because not every ship has a full loading manual.',
      'Keyboard-first data entry and shortcuts for expert users who live in the tool all day.',
      'In the second tool’s audit: replace stacked pop-ups with side panels and simplify crowded filters.'
    ],
    outcomes: [
      'Cut processing time by 60%.',
      'Replaced scattered spreadsheets and tools with one guided workflow.'
    ],
    learnings: [
      'For expert users, density is a feature: design for speed, keyboards and at-a-glance safety signals, not simplicity for its own sake.',
      'Breaking complex calculation logic into prioritised tiers let engineering ship value early without compromising safety checks.'
    ]
  },
  {
    slug: 'cx-analytics',
    title: 'Customer Experience Analytics',
    client: 'Centrica (UK)',
    company: 'WNS Global Services',
    year: 'TODO: Year',
    role: 'Product Manager',
    type: 'work',
    tags: ['AI', 'Analytics', 'Power BI', 'Contact centre'],
    hue: 0.66,
    summary: 'A Power BI experience for auditing contact-centre conversations: volumes, CSAT, NPS and sentiment at a glance, and an AI summary of any individual call one click away.',
    meta: { timeline: 'TODO: Dates', team: 'TODO: Team size & roles', platform: 'Power BI, ticketing-system APIs' },
    metrics: [
      { value: '1 click', label: 'From company-wide KPIs to a single call’s AI summary' },
      { value: '4', label: 'Views: executive, experience summary, interaction analysis, detail table' },
      { value: 'AI', label: 'Call summaries, intent, sentiment and tonality for every interaction' }
    ],
    cover: 'assets/work/cx-analytics/cover.jpg',
    images: [
      { src: 'assets/work/cx-analytics/cx-summary.jpg', caption: 'Experience summary: volumes, sentiment, NPS and the words customers use most' },
      { src: 'assets/work/cx-analytics/interaction.jpg', caption: 'Interaction analysis: AI summary, intent, tonality and vulnerability flags for one call' }
    ],
    context: 'The client’s customer-care teams handle a high volume of calls. Business users wanted to understand the customer experience across those calls and audit individual conversations without listening to recordings.',
    problem: 'Call data sat in the ticketing system and the recordings themselves. There was no single view of how many calls came in, how customers felt, or what an individual call was actually about.',
    contribution: [
      'Analysed the requirement and wrote the PRD.',
      'Defined the KPIs: calls received, CSAT, NPS, sentiment, call duration, turnaround time and most frequent words.',
      'Designed the audit flow from aggregate KPIs down to a single interaction.',
      'Wrote design guidelines for each view so the dashboards stay consistent as they grow.'
    ],
    process: [
      { step: 'Requirement', text: 'Worked out what business users need to judge call experience, and which questions they ask first.' },
      { step: 'PRD', text: 'Specified KPIs, data sources (ticketing-system APIs into Power BI), views and drill-downs.' },
      { step: 'Design', text: 'Executive page, experience summary, interaction analysis and a detail table, each with its own design guideline.' },
      { step: 'Build', text: 'Power BI on ticketing data, with AI-generated summaries of call recordings.' }
    ],
    decisions: [
      'Audit by sampling: pick any call to see who called, the agent and their profile, the AI summary, feedback score, turnaround time and duration.',
      'Surface vulnerability and complaint flags on each interaction, so sensitive calls are never buried in averages.',
      'Show customer and agent tonality side by side, to separate a difficult customer from a poor conversation.'
    ],
    outcomes: [
      'Business users can audit call experience without listening to recordings.',
      'TODO: Adoption or impact numbers, if any.'
    ],
    learnings: [
      'Analytics about people needs both altitudes: aggregate KPIs for trends, and a single conversation to understand why.',
      'Write the PRD around the questions users ask, not around the data that happens to be available.'
    ]
  },
  {
    slug: 'hcp-segmentation',
    title: 'HCP Segmentation Platform',
    client: 'Life sciences & medtech sales teams (incl. Zimmer)',
    company: 'WNS Global Services',
    year: 'TODO: Year',
    role: 'Product Manager',
    type: 'work',
    tags: ['Life sciences', 'Analytics', 'Prototype'],
    hue: 0.45,
    summary: 'A guided tool for sales-operations teams to segment healthcare professionals and plan field-force calls, prototyped for a WNS offering and tailored for Zimmer.',
    meta: { timeline: 'TODO: Dates', team: 'TODO: Team size & roles', platform: 'Web application (Salesforce Lightning design system)' },
    metrics: [
      { value: '7 steps', label: 'Guided flow from cycle setup to final segments' },
      { value: 'v1 → v2', label: 'Prototype iterations' },
      { value: 'Built-in', label: 'Data-quality checks before any segmentation runs' }
    ],
    cover: 'assets/work/hcp-segmentation/cover.jpg',
    images: [{ src: 'assets/work/hcp-segmentation/import.jpg', caption: 'Importing territory data with a downloadable template' }],
    context: 'Pharma and medtech companies segment healthcare professionals (HCPs) to decide where sales reps spend their time. The work usually lives in spreadsheets owned by a few analysts.',
    problem: 'Segmentation cycles were manual, error-prone and hard to repeat: duplicate records and mismatched rep names silently skewed results, and each cycle started from scratch.',
    contribution: [
      'Shaped the end-to-end workflow and the prototype through two iterations.',
      'Defined the data-quality checks that run before segmentation.',
      'TODO: Anything else you owned (client demos, requirements, team).'
    ],
    process: [
      { step: 'Set up', text: 'Create a cycle, choose a scenario and import territory, rep and HCP data from a template.' },
      { step: 'Check', text: 'Automatic checks: duplicate records, similar rep names and HCP counts per territory.' },
      { step: 'Plan', text: 'Set call capacity and products in scope.' },
      { step: 'Segment', text: 'Bucket HCPs by patient volume and product usage, then review segments at customer level and export.' }
    ],
    decisions: [
      'A step-by-step stepper instead of one big form, so non-analysts can run a cycle without training.',
      'Data checks are a mandatory step, because bad input is the biggest risk in segmentation.',
      'Built on a standard enterprise design system so the prototype could move to build quickly.'
    ],
    outcomes: ['Two prototype iterations, including a version tailored for Zimmer.', 'TODO: What happened next (pilot, build, client feedback).'],
    learnings: [
      'Make data quality visible before analysis; it saves the most painful rework later.',
      'Guided flows make complex analytical setups approachable for people who aren’t analysts.'
    ]
  },
  {
    slug: 'bi-marketplace',
    title: 'BI Marketplace & Digital AI Insights',
    client: 'WNS Analytics (internal offering)',
    company: 'WNS Global Services',
    year: 'TODO: Year',
    role: 'Product Manager',
    type: 'work',
    tags: ['AI', 'Data & BI', 'Concept'],
    hue: 0.6,
    summary: 'A concept for a self-serve BI marketplace and an AI insights layer that takes business users from question to insight to decision.',
    meta: { timeline: 'TODO: Dates', team: 'TODO: Team size & roles', platform: 'Web portal over Power BI' },
    metrics: [
      { value: '3', label: 'Entry points: my workspace, data marketplace, recommendations' },
      { value: '7', label: 'AI insight capabilities, from key influencers to drill-through analysis' }
    ],
    cover: 'assets/work/bi-marketplace/cover.jpg',
    images: [{ src: 'assets/work/bi-marketplace/ai-insights.jpg', caption: 'Digital AI Insights: time to insight, to analysis, to decision' }],
    context: 'Enterprises accumulate hundreds of reports across teams, and most business users can’t find the one they need, or don’t know it exists.',
    problem: 'Reports were hard to discover, hard to trust and disconnected from the decisions they should support.',
    contribution: ['Shaped the concept and information architecture.', 'TODO: Your specific role and who it was presented to.'],
    process: [
      { step: 'Frame', text: 'Treat reports as products in a catalogue: searchable, owned, with freshness and usage visible.' },
      { step: 'Structure', text: 'Three entry points: a personal workspace, a shared data marketplace and AI recommendations.' },
      { step: 'Augment', text: 'An AI layer with self-serve questions, key influencers, trend, drill-down and drill-through analysis.' }
    ],
    decisions: [
      'Show freshness and usage on every report card, so users know what to trust.',
      'Recommendations sit alongside search, so users discover reports they didn’t know to ask for.'
    ],
    outcomes: ['TODO: Where this concept went (pitch, pilot, client adoption).'],
    learnings: ['Discoverability is a product problem: users can’t use reports they can’t find.']
  },
  {
    slug: 'suncorp',
    title: 'Renewal & New Business Dashboard',
    client: 'Suncorp (Australia)',
    company: 'WNS Global Services',
    year: '2025',
    role: 'Product Manager',
    type: 'work',
    tags: ['Insurance', 'Data & BI', 'Pitch'],
    hue: 0.15,
    summary: 'A pitch dashboard for leadership at an Australian insurer: I gathered the requirements and designed a view that explains liability renewal and new-business performance at a glance.',
    meta: { timeline: 'Early 2025', team: 'TODO: Team size', platform: 'Dashboard prototype' },
    metrics: [{ value: '9', label: 'Headline KPIs, from renewal rate to average written premium' }],
    cover: 'assets/work/suncorp/cover.jpg',
    images: [{ src: 'assets/work/suncorp/filters.jpg', caption: 'Filter panel for slicing by policy attributes' }],
    context: 'WNS was pitching analytics services to Suncorp’s leadership.',
    problem: 'Leadership needed to see, in one view, how liability renewals and new business were performing, and what the metrics meant.',
    contribution: ['Collected the requirements.', 'Designed the dashboard and the story behind each metric for the pitch.'],
    process: [
      { step: 'Gather', text: 'Collected the metrics leadership cared about.' },
      { step: 'Design', text: 'Headline KPIs on top, then renewal volume vs premium, rate trends and breakdowns by band, state and industry.' },
      { step: 'Explain', text: 'Walked leadership through what each metric means and why it matters.' }
    ],
    decisions: ['Lead with nine headline KPIs, then trends, then breakdowns: the order an executive reads.'],
    outcomes: ['Dashboard presented to leadership as part of the pitch.'],
    learnings: ['For an executive pitch, choose the few metrics that tell the story, and explain each one plainly.']
  },
  {
    slug: 'verizon',
    title: 'B2B Tools Modernisation',
    client: 'Verizon',
    company: 'Brillio Technologies',
    year: '2022 — 2023',
    role: 'Senior Product Designer',
    type: 'work',
    tags: ['Telecom', 'Enterprise', 'B2B'],
    hue: 0.95,
    summary: 'Modernised legacy B2B tools for Verizon, validating flows with 100+ screen prototypes before build.',
    meta: { timeline: 'TODO: Duration', team: 'Product and engineering leads', platform: 'TODO: Web' },
    metrics: [{ value: '100+', label: 'Screens prototyped and validated' }],
    context: 'TODO: Which Verizon B2B tools and who uses them.',
    problem: 'TODO: What made the legacy tools hard to use or maintain.',
    contribution: ['Partnered with product and engineering leads to modernise legacy B2B tools.', 'Shipped 100+ screen prototypes across Agile sprints to validate flows before build.'],
    process: [
      { step: 'Discover', text: 'TODO: How you understood the legacy workflows.' },
      { step: 'Prototype', text: 'Built 100+ screen prototypes across Agile sprints.' },
      { step: 'Validate', text: 'Validated flows before engineering built them.' },
      { step: 'Deliver', text: 'TODO: How the work was handed off and shipped.' }
    ],
    decisions: ['Validated with prototypes before build to reduce costly rework.', 'TODO: Other key decision.'],
    outcomes: ['TODO: Measurable outcome for Verizon.'],
    learnings: [
      'Prototyping before build is the cheapest way to de-risk modernising legacy tools.'
    ]
  },
  {
    slug: 'terminix',
    title: 'Onboarding Redesign',
    client: 'Terminix (USA)',
    company: 'Brillio Technologies',
    year: '2022 — 2023',
    role: 'Senior Product Designer',
    type: 'work',
    tags: ['Consumer', 'Onboarding', 'Research'],
    hue: 0.42,
    summary: 'Redesigned onboarding using user research and product telemetry, lifting user satisfaction scores by 35%.',
    meta: { timeline: 'TODO: Duration', team: 'TODO: Team size & roles', platform: 'TODO: Web / app' },
    metrics: [{ value: '+35%', label: 'User satisfaction' }],
    context: 'TODO: What the Terminix product is and who onboards into it.',
    problem: 'TODO: What research and telemetry showed was going wrong in onboarding.',
    contribution: ['Redesigned onboarding using user research and product telemetry.'],
    process: [
      { step: 'Research', text: 'TODO: Research methods used.' },
      { step: 'Analyse', text: 'TODO: What the product telemetry revealed.' },
      { step: 'Redesign', text: 'TODO: What changed in the onboarding flow.' },
      { step: 'Measure', text: 'User satisfaction scores rose by 35%.' }
    ],
    decisions: ['TODO: Key decision.'],
    outcomes: ['Lifted user satisfaction scores by 35%.'],
    learnings: [
      'Combine what users say (research) with what they do (telemetry) before redesigning a flow.'
    ]
  },
  {
    slug: 'carevisor',
    title: 'CareVisor',
    client: 'Samsung — Virtual Care Platform (with Accenture)',
    company: 'Ameex Technologies',
    year: '2018 — 2019',
    role: 'Lead UX/UI Designer',
    type: 'work',
    tags: ['Healthcare', 'HIPAA', 'Virtual assistant', 'IoT', '0 → 1'],
    hue: 0.62,
    summary: 'A virtual care companion that helps people follow their physician’s care plan for chronic conditions and post-acute care. I led design from day zero across 2 mobile apps and 6 web portals.',
    meta: { timeline: 'Jul 2018 — 2019', team: 'Led 5 designers, alongside client, Accenture and engineering teams', platform: 'iOS & Android apps, 6 web portals, connected health devices' },
    metrics: [
      { value: '2 + 6', label: 'Mobile apps and web portals designed' },
      { value: '150+', label: 'Screens across two user roles' },
      { value: '50+ / 12', label: 'People surveyed / interviewed' },
      { value: '4', label: 'Patient journeys co-created in a 3-day workshop' }
    ],
    cover: 'assets/work/carevisor/cover.jpg',
    images: [
      { src: 'assets/work/carevisor/ui-designs.jpg', caption: 'High-fidelity screens: daily care cards, measurements, trends and the avatar assistant' },
      { src: 'assets/work/carevisor/task-flows.jpg', caption: 'Task flows: talking to the avatar, managing activities, medications and the care circle' },
      { src: 'assets/work/carevisor/sketches-wireframes.jpg', caption: 'From whiteboard sketches to wireframes' },
      { src: 'assets/work/carevisor/usability-test.jpg', caption: 'Usability test findings and the redesigned home screen' }
    ],
    context: 'Managing a chronic condition or recovering from a procedure is complicated: what to take, what to avoid, what to measure, when to call. CareVisor was built for Samsung’s virtual care programme to improve patient outcomes at the same or lower cost, by helping patients stick to their care plan.',
    problem: 'Patients drift from their care plans for two main reasons: they forget, or they don’t understand why it matters. Every care plan is different, readings come from many devices, and an abnormal value or a missed medication needs the right response at the right time, without nagging people until they tune out.',
    contribution: [
      'Involved from day zero: gathered requirements with the client and partner teams.',
      'Owned design for 2 mobile apps and 6 web portals, from analysis to handoff.',
      'Led and distributed work across a team of 5 designers.',
      'Ran the research: survey, interviews, personas, information architecture and task flows.',
      'Set up the design-handoff process (layouts, flows, interactions, validations) and ran UI audits before release.'
    ],
    process: [
      { step: 'Co-create', text: 'A 3-day collaboration workshop with the client and Accenture to map four patient journeys: onboarding, personalisation, condition management and support.' },
      { step: 'Research', text: 'Surveyed 50+ potential users aged 20–60, interviewed 12 of them, and built four personas from the findings.' },
      { step: 'Define', text: 'Information architecture and task flows built around the care plan: parameters to measure, actions to complete and symptoms to watch out for.' },
      { step: 'Design', text: 'Sketches, then wireframes, then 150+ high-fidelity screens, with a virtual avatar assistant and voice input for measurements.' },
      { step: 'Test', text: 'Usability tests with people new to the product, then a redesign of the home screen based on what we saw.' }
    ],
    decisions: [
      'Nudges that match urgency: a reminder can escalate from a notification to a text, a call, the patient’s care circle and finally the care team. The sequence is configurable for each care-plan item, and reminders are consolidated so patients don’t tune out.',
      'Grouped the home screen’s care cards by type and time, showing at most three, after testing showed people struggled to find upcoming vs missed tasks in a long list.',
      'Rolling onboarding: get patients in quickly, then add medications, devices, care circle and avatar over time, because testing showed long setups made people hesitate.',
      'Life-threatening symptoms are confirmed with the patient and routed to a clinical call centre rather than handled by the bot.',
      'One shared vocabulary across all portals (client, practice, care circle), which also kept the documentation ready for a HIPAA audit.'
    ],
    outcomes: [
      'Designed and handed off 2 mobile apps and 6 web portals (150+ screens).',
      'Home screen redesigned from usability-test evidence before development started.',
      'TODO: Pilot or launch outcomes, if known.'
    ],
    learnings: [
      'In healthcare, the hardest design problem is restraint: nudge enough to help, never so much that people stop listening.',
      'One usability session before build is cheaper than any redesign after it.',
      'When several organisations share a product, a shared vocabulary matters as much as the interface.'
    ]
  },
  {
    slug: 'identifor',
    title: 'Identifor',
    client: 'Identifor',
    company: 'Ameex Technologies',
    year: '2016 — 2017',
    role: 'Product Lead',
    type: 'work',
    tags: ['Healthcare', 'Accessibility', 'Gamification', 'Autism'],
    hue: 0.32,
    summary: 'A games-based platform that helps young people with autism discover their strengths. I rebuilt its assessment funnel into a gamified onboarding journey, cutting drop-offs and bounce rate by 40%.',
    meta: { timeline: '2016 — mid 2017', team: 'Cross-functional: iOS, Android, web, back-end and QA', platform: 'Web, mobile apps, games and dashboards' },
    metrics: [
      { value: '40%', label: 'Fewer drop-offs and lower bounce rate' },
      { value: 'HIPAA', label: 'Compliant end-to-end delivery' },
      { value: 'WCAG', label: 'Accessibility requirements met' }
    ],
    context: 'Identifor helps individuals with autism, usually in their high-school years, identify their abilities, skills and interests by playing games. Game performance maps to cognitive strengths and interests that users and families can explore.',
    problem: 'New users didn’t understand what the platform was for or why they should share personal details. Once in, they faced a long, unordered list of games, with no sense of progress towards a complete profile, so many dropped off before seeing any value.',
    contribution: [
      'Led the product and the cross-functional team (iOS, Android, web, back-end and QA), working closely with the CEO.',
      'Owned end-to-end delivery, meeting HIPAA and WCAG accessibility requirements.',
      'Rebuilt the assessment funnel into a gamified onboarding journey.',
      'Worked across the wider ecosystem: games, web, apps, analytics and dashboards.'
    ],
    process: [
      { step: 'Understand', text: 'Mapped the first-time journey and where it lost people: unclear value, early data requests and too many choices.' },
      { step: 'Simplify', text: 'Plainer language for concepts like executive functions, and a clear link between playing games and learning about yourself.' },
      { step: 'Gamify', text: 'Turned the assessment into a guided onboarding with visible progress towards a complete profile.' },
      { step: 'Measure', text: 'Drop-offs and bounce rate fell by 40%.' }
    ],
    decisions: [
      'Show progress towards profile completion, so every game feels like a step towards a goal.',
      'Guide users to the next game instead of showing every game at once.',
      'Accessibility and compliance as design constraints from day one, not a final check.'
    ],
    outcomes: ['Cut drop-offs and bounce rate by 40%.', 'Met HIPAA and WCAG accessibility requirements.'],
    learnings: ['In healthcare, accessibility and compliance are design constraints from day one, and they can coexist with engagement.', 'For neurodiverse users, clarity beats cleverness: plain words, one next step, visible progress.']
  },
  {
    slug: 'companion',
    title: 'Companion',
    client: 'Identifor',
    company: 'Ameex Technologies',
    year: '2017 — 2018',
    role: 'Product Lead',
    type: 'work',
    tags: ['Healthcare', 'Virtual assistant', 'Mobile'],
    hue: 0.65,
    summary: 'A mobile companion for individuals with autism, driven by a virtual personal assistant, that helps them keep track of events, daily routines and medication.',
    meta: { timeline: 'Mid 2017 — 2018', team: 'Cross-functional: iOS, Android, web, back-end and QA', platform: 'iOS & Android' },
    metrics: [{ value: 'Assistant-led', label: 'App driven by a virtual personal assistant' }],
    context: 'Alongside its assessment platform, Identifor wanted to support people with autism in everyday life, not only in discovering their strengths.',
    problem: 'Keeping track of events, routines and medication is hard for many people with autism, and generic reminder apps are too busy and too abstract to help.',
    contribution: ['Led the product and the cross-functional team (iOS, Android, web, back-end and QA), working closely with the client’s CEO.', 'Defined the assistant-led experience for events, routines and medication.'],
    process: [
      { step: 'Define', text: 'Core jobs: track events, follow routines, stay on top of medication.' },
      { step: 'Design', text: 'Put a friendly virtual assistant at the centre, so the app talks the user through each task.' },
      { step: 'Build', text: 'TODO: How it was built and tested.' }
    ],
    decisions: ['Lead with an assistant rather than menus, to make the app feel supportive instead of administrative.'],
    outcomes: ['TODO: Launch or usage outcomes.'],
    learnings: ['A consistent, friendly guide lowers the effort of every task for users who find interfaces overwhelming.']
  },
  {
    slug: 'valet4you',
    title: 'Valet4You',
    client: 'Kunstler Technologies (US)',
    company: 'Ameex Technologies',
    year: 'TODO: Year',
    role: 'TODO: Your role',
    type: 'work',
    tags: ['Mobility', 'Operations', 'Mobile', '0 → 1'],
    hue: 0.72,
    summary: 'An end-to-end platform for city valet parking: location-aware apps for customers and attendants, plus back-office, monitoring and alerting tools for the people who run the operation.',
    meta: { timeline: 'TODO: Dates', team: 'TODO: Team size & roles', platform: 'iOS & Android apps, admin web app' },
    metrics: [
      { value: '4', label: 'User groups in one system: customers, attendants, admins, key managers' },
      { value: 'Geo-driven', label: 'Customer and attendant apps built around location' }
    ],
    context: 'Parking in large cities is slow and frustrating. The client set out to rethink the whole valet-parking ecosystem with technology at its core.',
    problem: 'Customers, valet attendants, admins and key managers each had different jobs, and no single system connected them, so handoffs, staffing and key tracking ran on manual workarounds.',
    contribution: ['Worked on the product end to end.', 'TODO: Your specific responsibilities.'],
    process: [
      { step: 'Map', text: 'Mapped the jobs of each user group: customers requesting and retrieving cars, attendants on the ground, admins and key managers.' },
      { step: 'Design', text: 'Location-driven mobile apps for customers and attendants; a back-office app for attendance, assignments and payroll.' },
      { step: 'Control', text: 'Monitoring and alerting apps so admins and key managers can keep the operation efficient.' },
      { step: 'Build', text: 'Custom workflows for the client’s requirements, kept flexible enough to adapt as the business grew.' }
    ],
    decisions: [
      'One platform for all four user groups, so every handoff — request, assignment, key, return — is tracked in one place.',
      'Location at the centre of the customer and attendant experience.'
    ],
    outcomes: ['TODO: Launch or usage outcomes.'],
    learnings: ['In operations products, the hidden users (attendants and key managers) decide whether the customer experience works.']
  },
  {
    slug: 'roh',
    title: 'Ring of Honor',
    client: 'Ring of Honor Wrestling (Sinclair Broadcast Group)',
    company: 'Ameex Technologies',
    year: '2017 — 2019',
    role: 'Product Designer',
    type: 'work',
    tags: ['Media', 'E-commerce', 'Streaming', 'Gamification'],
    hue: 0.03,
    summary: 'Rebuilt a professional wrestling company’s website, store and membership club, then took it to iOS, Android and three TV platforms, to turn fans into paying members.',
    meta: { timeline: 'TODO: Confirm dates (registered-user data: Jul 2017 — Mar 2019)', team: 'TODO: Team size & roles', platform: 'Web (Drupal 7 + Commerce), iOS, Android, Roku, Apple TV, Android TV' },
    metrics: [
      { value: '18', label: 'New features the old site didn’t have' },
      { value: '5', label: 'App platforms: iOS, Android, Roku, Apple TV, Android TV' },
      { value: '8s+', label: 'Old page-load time the rebuild set out to fix' },
      { value: '~200k', label: 'Monthly site visits at the start' }
    ],
    cover: 'assets/work/roh/cover.jpg',
    images: [
      { src: 'assets/work/roh/home-before-after.jpg', caption: 'Home page, before and after' },
      { src: 'assets/work/roh/ppv-before-after.jpg', caption: 'Pay-per-view page, before and after' },
      { src: 'assets/work/roh/feature-matrix.jpg', caption: 'Feature matrix: old site vs new site' },
      { src: 'assets/work/roh/tv-mobile-apps.jpg', caption: 'TV and mobile apps' }
    ],
    context: 'Ring of Honor is a US professional wrestling company owned by Sinclair Broadcast Group. Its online revenue came from merchandise, tickets, memberships and pay-per-view.',
    problem: 'The old site ran on an unsupported platform. Discounts didn’t work, videos were hard to find, search returned obsolete products, pages took more than 8 seconds to load, and fans had nothing to do on the site but read and share.',
    contribution: [
      'Shaped the new experience around converting general fans into paying Honor Club members.',
      'Worked across commerce, video, events, rosters and fan engagement features.'
    ],
    process: [
      { step: 'Audit', text: 'Documented the before state: broken commerce workflows, poor search, slow pages and no engagement.' },
      { step: 'Evaluate', text: 'Compared five platform combinations and chose the one that supported product variants, flexible discounts and SKU-level reporting.' },
      { step: 'Rebuild', text: 'New store, Honor Club membership with exclusive content, pay-per-view and live streaming, rosters, events and fan games.' },
      { step: 'Extend', text: 'Apps for iOS, Android, Roku, Apple TV and Android TV, with in-app purchase and casting.' },
      { step: 'Recommend', text: 'Next steps for analytics goals, personalisation, push notifications and cart-abandonment recovery.' }
    ],
    decisions: [
      'Gamification to keep fans on the site: Pick’em predictions, trivia, polls and points with automated rewards.',
      'Lightweight custom game modules instead of a heavy off-the-shelf quiz module.',
      'Mobile-first build, so the same experience could extend to mobile and TV apps.',
      'Events shown by the visitor’s location, and member-only content to drive Honor Club sign-ups.'
    ],
    outcomes: [
      'Significant increase in site visits and session duration, with a lower bounce rate.',
      'Better performance and more VIP subscriptions.',
      'One experience across web, mobile and TV.'
    ],
    learnings: ['Engagement features earn their place when they lead somewhere: here, every game and perk pointed fans towards membership.']
  },
  {
    slug: 'chrysalis',
    title: 'Buzzle AR',
    client: 'Chrysalis (K-12 education)',
    company: 'Ameex Technologies',
    year: 'TODO: Year',
    role: 'Design Consultant (AR feature)',
    type: 'work',
    tags: ['Augmented reality', 'EdTech', 'Mobile'],
    hue: 0.86,
    summary: 'An augmented-reality learning app for iOS and Android: students scan a code in their textbook and the page comes alive, with rewards that build good learning habits.',
    meta: { timeline: 'TODO: Dates', team: 'TODO: Team size & roles', platform: 'iOS & Android (AR)' },
    metrics: [{ value: 'AR', label: 'Real-world text augmented by scanning a code' }],
    context: 'Chrysalis is a K-12 education company that combines learning content with technology, and wanted technology to extend in-person teaching rather than replace it.',
    problem: 'Classroom content is static, and holding students’ attention and building consistent study habits is hard.',
    contribution: ['Design consultant for the augmented-reality feature: how students scan, what they see, and how it connects to rewards and progress.'],
    process: [
      { step: 'Scan', text: 'Students scan a code printed in their textbook.' },
      { step: 'Augment', text: 'The page comes alive with augmented-reality content that supports what the teacher is teaching.' },
      { step: 'Reinforce', text: 'Rewards, a progress dashboard and contextual messages encourage good learning habits.' }
    ],
    decisions: ['Built around behaviour science: rewards, a dashboard and timely messages to turn one-off wow moments into habits.'],
    outcomes: ['Launched on iOS and Android.', 'TODO: Adoption or recognition details.'],
    learnings: ['Novelty gets attention; habits keep it. AR opened the door, and rewards and feedback kept students coming back.']
  },
  {
    slug: 'epilepsy-diary',
    title: 'Epilepsy Diary Reports',
    client: 'Healthcare client',
    company: 'Ameex Technologies',
    year: '2019',
    role: 'UX Designer',
    type: 'work',
    tags: ['Healthcare', 'Mobile', 'Data visualisation'],
    hue: 0.76,
    summary: 'Redesigned the diary report in an epilepsy app, so patients and carers can read seizures, medicines, moods and side effects on a phone without fighting a table.',
    meta: { timeline: '2019', team: 'TODO: Team size', platform: 'Mobile app' },
    metrics: [{ value: '6', label: 'Report sections redesigned: events, seizure types, mood, side effects, medicines, rescue medication' }],
    cover: 'assets/work/epilepsy-diary/summary.jpg',
    images: [
      { src: 'assets/work/epilepsy-diary/mood-side-effects.jpg', caption: 'Mood and side effects: one tap to log, the most important word read first' },
      { src: 'assets/work/epilepsy-diary/rescue-rx.jpg', caption: 'Medicines and rescue medication as scannable cards' }
    ],
    context: 'People living with epilepsy keep a diary of seizures, medicines, moods and side effects, which they and their doctors use to manage the condition.',
    problem: 'The diary report was a table: on a phone it needed constant horizontal and vertical scrolling, and the information that matters most was the hardest to find.',
    contribution: ['Designed the low-fidelity wireframes and the reasoning behind every section, ready for client approval before high-fidelity design.'],
    process: [
      { step: 'Diagnose', text: 'Identified why the table failed on mobile: scrolling in two directions and no visual priority.' },
      { step: 'Restructure', text: 'Turned every record into a card, with a summary of events on top and a date switcher.' },
      { step: 'Prioritise', text: 'Made the key fact in each card — seizure count, side effect, medicine — the largest text.' },
      { step: 'Prototype', text: 'Clickable prototype for client review.' }
    ],
    decisions: [
      'Cards instead of tables for every record.',
      'Show a few records first, with “see all” for the full list, to keep the report short.',
      'Show times of day as icons and text, so taken and missed doses are clear at a glance.'
    ],
    outcomes: ['Wireframes and prototype delivered for client approval.'],
    learnings: ['Health data on a phone has to be read in seconds: decide what matters most and make it the biggest thing on screen.']
  },
  {
    slug: 'sham-stage',
    title: 'Sham Stage',
    client: 'Independent',
    company: 'Independent',
    year: '2026',
    role: 'Founder & Product Manager',
    type: 'independent',
    status: 'In progress',
    featured: true,
    tags: ['AI', 'LLM', 'AI Agents', '0 → 1'],
    hue: 0.78,
    summary: 'An AI-powered rehearsal platform where professionals practise high-stakes conversations with AI personas.',
    meta: { timeline: 'TODO: Start date — ongoing', team: 'Solo', platform: 'TODO: Web / desktop' },
    metrics: [{ value: '4-step', label: 'Prepare → Rehearse → Review → Improve' }, { value: 'Local LLM', label: 'Private practice sessions' }],
    context: 'Founder pitches, client presentations and tough conversations are high-stakes, but people rarely get a safe place to rehearse them.',
    problem: 'TODO: Who you talked to and what they told you about how they prepare today.',
    contribution: ['Building the MVP end to end.', 'Running a local LLM to power the personas and keep practice sessions private.'],
    process: [
      { step: 'Prepare', text: 'The user sets the scenario, the audience and their goals.' },
      { step: 'Rehearse', text: 'They practise the conversation live with an AI persona.' },
      { step: 'Review', text: 'TODO: What feedback the user gets after a session.' },
      { step: 'Improve', text: 'TODO: How the loop helps them get better over time.' }
    ],
    decisions: ['Chose a local LLM over a hosted API so practice sessions stay private.', 'TODO: Other key decision.'],
    outcomes: ['TODO: Current status, early users or test results.'],
    learnings: [
      'Privacy can be a product feature: running the model locally builds trust for sensitive rehearsals.'
    ]
  },
  {
    slug: 'belvere-designs',
    title: 'Belvère Designs',
    client: 'Belvère Designs',
    company: 'Independent',
    year: 'TODO: Year',
    role: 'Product & Build',
    type: 'independent',
    link: 'https://belveredesigns.com',
    tags: ['AI Agents', 'Automation', '3D Web'],
    hue: 0.12,
    summary: 'An immersive 3D website for an interior design company, built in one week with Claude Code, plus AI chat agents that answer leads in under a minute.',
    meta: { timeline: '1 week to live site', team: 'Solo, with Claude Code', platform: 'Web + WhatsApp' },
    metrics: [{ value: '1 week', label: 'From brief to live site' }, { value: '10 min → <1', label: 'Lead response time' }],
    context: 'Belvère Designs is an interior design company that needed a website that felt as crafted as its interiors.',
    problem: 'Leads waited around 10 minutes for a reply, and every minute lost lowers the chance of a booking.',
    contribution: ['Built an immersive 3D website in one week using Claude Code, from brief to live site.', 'Set up web-to-WhatsApp automation and AI chat agents for lead capture.'],
    process: [
      { step: 'Brief', text: 'TODO: What the business needed and who its customers are.' },
      { step: 'Build', text: 'Went from brief to live 3D site in one week using Claude Code.' },
      { step: 'Automate', text: 'Connected the website to WhatsApp and added AI chat agents for lead capture.' },
      { step: 'Measure', text: 'Lead response time fell from 10 minutes to under a minute.' }
    ],
    decisions: ['Used AI-assisted development to compress a multi-week build into one week.', 'TODO: Why WhatsApp was the right channel for these customers.'],
    outcomes: ['Live site at belveredesigns.com.', 'Cut lead response time from 10 minutes to under a minute.'],
    learnings: [
      'AI-assisted development compresses delivery from weeks to days, freeing time for the decisions that need judgment.',
      'Speed to lead matters: the fastest reply often wins the customer.'
    ]
  },
  {
    slug: 'modernmoy',
    title: 'ModernMoy',
    client: 'Independent (freelance product)',
    company: 'Independent',
    year: 'TODO: Year launched',
    role: 'Founder & Product Manager',
    type: 'independent',
    status: 'Live',
    tags: ['0 → 1', 'Fintech', 'Bilingual', 'Offline-first'],
    hue: 0.1,
    summary: 'A product that digitises moy, the Tamil tradition of recording gifts at family functions. It is still running, and has recorded around ₹4 crore in moy.',
    meta: { timeline: 'TODO: Start date — ongoing', team: 'TODO: Team (freelance)', platform: 'Web portal for moy counters, with an Android app planned in the BRD' },
    metrics: [
      { value: '₹4 Cr', label: 'Moy recorded through the product' },
      { value: 'Live', label: 'Still running successfully' },
      { value: '2', label: 'Languages: Tamil and English' }
    ],
    context: 'In southern Tamil Nadu, moy virundhu is a matter of honour: guests give money at family functions, and both families keep a record so the gift can be returned, with more, at a future function. A single function can involve hundreds or thousands of guests.',
    problem: 'Moy has always been written by hand in notebooks. Records get lost over the years, totals are hard to reconcile at the end of a function, and finding what you received from a family years ago is painful.',
    contribution: [
      'Wrote the BRD from the tradition up, then cut it into a focused MVP PRD.',
      'Defined the product end to end and took it live.',
      'TODO: Anything else you ran (sales, operations, team).'
    ],
    process: [
      { step: 'Understand', text: 'Documented how moy works, who records it, and where the notebooks fail.' },
      { step: 'Scope', text: 'Moved from a full vision (app, portal, website, subscriptions) to an MVP for the moy counter at the function.' },
      { step: 'Build', text: 'Hosts and functions, then fast guest entry: type part of a mobile number and the guest’s details fill in automatically.' },
      { step: 'Run', text: 'Printed receipts and messages to guests, end-of-day reports, and live use at functions.' }
    ],
    decisions: [
      'The mobile number is the guest’s identity: entering a few digits suggests existing guests, so repeat guests take seconds.',
      'Offline-first entry that syncs in the background, because function venues often have poor connectivity.',
      'Tamil and English from day one, with the moy amount visually distinct from every other field.',
      'Receipts and confirmation messages, so guests trust that their gift was recorded correctly.'
    ],
    outcomes: ['Still running successfully.', 'Around ₹4 crore in moy recorded.'],
    learnings: ['The best products often digitise a ritual people already trust; respect the tradition and remove only the friction.', 'An MVP shaped around one moment (the moy counter) beat the full vision in getting to real usage.']
  },
  {
    slug: 'squaremart',
    title: 'SquareMart',
    client: 'Product design proposal',
    company: 'Independent',
    year: '2022',
    role: 'Product Designer',
    type: 'independent',
    tags: ['Retail', 'Concept', 'Mobile'],
    hue: 0.5,
    summary: 'A proposal to redefine in-store shopping: your list mapped onto the store, the shortest path between aisles, scan-as-you-shop and no billing queue.',
    meta: { timeline: '2022', team: 'Solo', platform: 'Mobile app concept' },
    metrics: [
      { value: '80%', label: 'Shoppers who use their phone while shopping (desk research)' },
      { value: '0', label: 'Billing queues in the proposed flow' }
    ],
    cover: 'assets/work/squaremart/cover.jpg',
    images: [{ src: 'assets/work/squaremart/sketches.jpg', caption: 'Paper sketches: store layout, list and scan flows' }],
    context: 'After the pandemic, almost every retailer offered online shopping, but many people still enjoy going to the store with family. The in-store experience itself had barely changed.',
    problem: 'In the store, products are hard to find, staff are scarce or don’t speak your language, offers go unnoticed, and the billing queue at busy times can take longer than the shopping.',
    contribution: ['Did the desk research, defined the use cases and flows, sketched, designed the screens and built a small design system.'],
    process: [
      { step: 'Research', text: 'Desk research and personal observation: most people shop from a list, want fresh stock, and lose time in queues.' },
      { step: 'Define', text: 'Goals: find products fast, see stock and offers, check out without a queue, depend less on staff.' },
      { step: 'Sketch', text: 'Rough paper sketches of the store layout and flows.' },
      { step: 'Design', text: 'High-fidelity screens and a design system with list, rack and bill components.' }
    ],
    decisions: [
      '“Smart shop” maps every item on your list to its rack and draws the shortest path through the store.',
      'Scan each product’s barcode as you pick it, to see details and add it to the cart.',
      'Picked items turn green and remaining ones stay red, so progress is obvious.',
      'Pay in the app; staff verify the bill from your history at the exit.'
    ],
    outcomes: ['Proposal with end-to-end flows, screens and a design system.'],
    learnings: ['Start from the moment that hurts most — here, the queue — and design the rest of the journey back from it.']
  },
  {
    slug: 'petalpost',
    title: 'PetalPost',
    client: 'Independent',
    company: 'Independent',
    year: 'TODO: Year',
    role: 'Founder & Product Manager',
    type: 'independent',
    status: 'Paused on evidence',
    tags: ['Marketplace', 'Discovery', 'Validation'],
    hue: 0.92,
    summary: 'A hyperlocal flower marketplace I tested and then paused — choosing to stop on evidence rather than build on hope.',
    meta: { timeline: 'TODO: Duration', team: 'Solo', platform: 'Prototype' },
    metrics: [{ value: '2-sided', label: 'Marketplace tested' }, { value: 'Stopped', label: 'On evidence, before heavy build' }],
    context: 'A two-sided hyperlocal marketplace connecting flower buyers with local merchants.',
    problem: 'Would customers and merchants both show up, and would the core loop work without friction?',
    contribution: ['Tested the marketplace through customer interviews, merchant validation and prototype testing.'],
    process: [
      { step: 'Interview', text: 'Customer interviews to understand demand. TODO: how many and key insight.' },
      { step: 'Validate', text: 'Merchant validation to understand supply. TODO: key insight.' },
      { step: 'Prototype', text: 'Prototype testing of the core customer loop.' },
      { step: 'Decide', text: 'Paused further engineering investment after testing exposed friction in the core customer loop.' }
    ],
    decisions: ['Stopped before investing in engineering, because the evidence did not support the core loop.'],
    outcomes: ['Avoided building a product the market had not validated.', 'TODO: Specific friction found.'],
    learnings: ['Knowing when to stop is a product skill. Interviews and prototypes gave the evidence before engineering money was spent.']
  }
];

export const bySlug = slug => projects.find(p => p.slug === slug);
