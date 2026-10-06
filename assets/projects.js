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
      'TODO: What you would do differently next time.',
      'TODO: What this project taught you about leading AI adoption in operations teams.'
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
    meta: { timeline: 'Nov 2024 — Oct 2025', team: 'TODO: Team size & roles', platform: 'Power BI, Power Automate, central data warehouse' },
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
      'Wrote the PRD for a customer-experience dashboard built on ticketing-system data.',
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
      'AI where it reduces reading: Power BI smart narratives write plain-English summaries on key dashboards.',
      'Customer-experience dashboard: calls received, CSAT, NPS and frequent words up top. Picking any call opens its details: who called, the agent, an AI summary of the recording, feedback score, turnaround time and duration.'
    ],
    outcomes: [
      'Consolidated 450+ reports from six platforms into 60 self-serve Power BI dashboards (87% fewer).',
      'Agency reports now arrive automatically on the 5th of every month, with no manual exports.',
      'Service agents answer agency questions during the call instead of 3–4 hours later.',
      'Saved an estimated 120+ analyst hours per month.',
      'Phase 1 delivered on time; the client extended the engagement by six months for Phase 2.'
    ],
    learnings: ['TODO: What you learned.']
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
    meta: { timeline: 'TODO: Confirm dates (pitch prototype: March 2025)', team: 'Design, front-end, back-end & Power BI teams', platform: 'Web platform with Power BI reports' },
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
      'TODO: The fallback behaviour you defined for when the assistant can’t answer from its knowledge base.',
      'Put an AI summary next to every model output, so non-analysts can read recommendations in plain language.',
      'Held the screencast to 2:20 — long enough to show the full flow, short enough for a pitch slot.'
    ],
    outcomes: [
      'Prototype presented to a global fast-food brand; the client reported it went really well.',
      'Recognised by WNS’s Chief Growth Officer and two Corporate Vice Presidents for delivery over the weekend while travelling.',
      'TODO: Any other outcomes from your ongoing delivery on this account.'
    ],
    quote: { text: 'Thanks so much. I just presented it to [the brand] and it went really well!', by: 'Global Chief Data Officer, Mediaplus' },
    learnings: ['TODO: What you learned.']
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
    meta: { timeline: 'Jun 2023 — Jan 2024', team: 'TODO: Team size & roles', platform: 'Web application' },
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
      'Replaced scattered spreadsheets and tools with one guided workflow.',
      'TODO: Adoption or rollout details.'
    ],
    learnings: ['TODO: What you learned.']
  },
  {
    slug: 'identifor',
    title: 'Identifor',
    client: 'Identifor',
    company: 'Ameex Technologies',
    year: 'TODO: Year',
    role: 'Product Engineer & UX Designer',
    type: 'work',
    tags: ['Healthcare', 'HIPAA', 'Accessibility', 'Gamification'],
    hue: 0.32,
    summary: 'Rebuilt an enterprise healthcare assessment funnel into a gamified onboarding journey, cutting drop-offs and bounce rate by 40%.',
    meta: { timeline: 'TODO: Duration', team: 'TODO: Team size & roles', platform: 'TODO: Web / iOS' },
    metrics: [
      { value: '40%', label: 'Fewer drop-offs and lower bounce rate' },
      { value: 'HIPAA', label: 'Compliant end-to-end delivery' },
      { value: 'WCAG', label: 'Accessibility requirements met' }
    ],
    context: 'TODO: What Identifor is and who it serves.',
    problem: 'Users were dropping off during the assessment funnel before reaching value. TODO: add detail.',
    contribution: ['Owned end-to-end delivery, meeting HIPAA and WCAG accessibility requirements.', 'Rebuilt the user assessment funnel into a gamified onboarding journey.'],
    process: [
      { step: 'Discover', text: 'TODO: Where in the funnel users dropped off and why.' },
      { step: 'Define', text: 'TODO: Why gamification was the right answer.' },
      { step: 'Build', text: 'Shipped a gamified onboarding journey within HIPAA and WCAG constraints.' },
      { step: 'Measure', text: 'Drop-offs and bounce rate fell by 40%.' }
    ],
    decisions: ['TODO: How you balanced engagement with accessibility and compliance.'],
    outcomes: ['Cut drop-offs and bounce rate by 40%.', 'Met HIPAA and WCAG accessibility requirements.'],
    learnings: ['TODO: What you learned.']
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
    learnings: ['TODO: What you have learned so far.']
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
    learnings: ['TODO: What you learned.']
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
    learnings: ['TODO: What you learned.']
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
    learnings: ['TODO: What you learned.']
  },
  {
    slug: 'companion',
    title: 'Companion',
    client: 'TODO: Client',
    company: 'TODO: Company',
    year: 'TODO: Year',
    role: 'TODO: Role',
    type: 'work',
    tags: ['TODO: Tags'],
    hue: 0.65,
    summary: 'TODO: One-line summary of Companion.',
    meta: { timeline: 'TODO', team: 'TODO', platform: 'TODO' },
    metrics: [{ value: 'TODO', label: 'TODO: Key metric' }],
    context: 'TODO', problem: 'TODO', contribution: ['TODO'],
    process: [{ step: 'Discover', text: 'TODO' }, { step: 'Define', text: 'TODO' }, { step: 'Build', text: 'TODO' }, { step: 'Measure', text: 'TODO' }],
    decisions: ['TODO'], outcomes: ['TODO'], learnings: ['TODO']
  },
  {
    slug: 'roh',
    title: 'ROH',
    client: 'ROH',
    company: 'Ameex Technologies',
    year: 'TODO: Year',
    role: 'Product Engineer & UX Designer',
    type: 'work',
    tags: ['TODO: Tags'],
    hue: 0.22,
    summary: 'TODO: One-line summary of the ROH product.',
    meta: { timeline: 'TODO', team: 'TODO', platform: 'TODO' },
    metrics: [{ value: 'TODO', label: 'TODO: Key metric' }],
    context: 'TODO', problem: 'TODO', contribution: ['TODO'],
    process: [{ step: 'Discover', text: 'TODO' }, { step: 'Define', text: 'TODO' }, { step: 'Build', text: 'TODO' }, { step: 'Measure', text: 'TODO' }],
    decisions: ['TODO'], outcomes: ['TODO'], learnings: ['TODO']
  },
  {
    slug: 'chrysalis',
    title: 'Chrysalis AR',
    client: 'Chrysalis',
    company: 'Ameex Technologies',
    year: 'TODO: Year',
    role: 'Product Engineer & UX Designer',
    type: 'work',
    tags: ['Augmented Reality', 'Consumer'],
    hue: 0.86,
    summary: 'TODO: One-line summary of the Chrysalis augmented reality product.',
    meta: { timeline: 'TODO', team: 'TODO', platform: 'TODO: iOS (ARKit?)' },
    metrics: [{ value: 'TODO', label: 'TODO: Key metric' }],
    context: 'TODO', problem: 'TODO', contribution: ['TODO'],
    process: [{ step: 'Discover', text: 'TODO' }, { step: 'Define', text: 'TODO' }, { step: 'Build', text: 'TODO' }, { step: 'Measure', text: 'TODO' }],
    decisions: ['TODO'], outcomes: ['TODO'], learnings: ['TODO']
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
    learnings: ['Knowing when to stop is a product skill. TODO: expand.']
  }
];

export const bySlug = slug => projects.find(p => p.slug === slug);
