// ============================================
// SOVEREIGN COUNSEL v5 — Complete Mock Data
// Elite Legal Operations Platform
// ============================================

const MOCK = {
  user: {
    name: 'Adavya Mehta',
    role: 'Managing Partner',
    initials: 'AM',
    firm: 'Sovereign Counsel LLP',
    email: 'adavya@sovereigncounsel.com',
  },

  clientUser: {
    name: 'Mr. Ratan Tata',
    company: 'Tata Realty & Infrastructure',
    caseId: 'MC-2026-089',
  },

  // ==== DASHBOARD ====
  dashStats: {
    activeCases: 142,
    casesChange: '+3',
    urgentMatters: 7,
    urgentNew: 2,
    hearingsToday: 4,
    hearingNext: '10:30 AM',
    overdueTasks: 12,
    overdueEsc: 3,
    billedMTD: '₹24.8L',
    billedChange: '+14.2%',
  },

  commandItems: [
    { id: 1, matter: 'Tata Realty v Sunrise', task: 'File Reply Affidavit', deadline: '4:00 PM Today', owner: 'AM', ownerName: 'Mehta', priority: 'p0', sla: '3h 20m', court: 'Bombay HC', stage: 'Pleadings' },
    { id: 2, matter: 'HDFC Recovery #TR-902', task: 'Review Settlement Terms', deadline: '6:00 PM Today', owner: 'SS', ownerName: 'Sharma', priority: 'p1', sla: '5h 10m', court: 'City Civil', stage: 'Negotiation' },
    { id: 3, matter: 'Zenith GST Notice', task: 'Prepare Compliance Response', deadline: 'Tomorrow 10 AM', owner: 'AG', ownerName: 'Gupta', priority: 'p1', sla: '18h', court: 'N/A', stage: 'Response' },
    { id: 4, matter: 'Alpha Capital Equity', task: 'Draft Investment Brief', deadline: 'Wed 12 PM', owner: 'RD', ownerName: 'Desai', priority: 'p2', sla: '2d 4h', court: 'N/A', stage: 'Advisory' },
    { id: 5, matter: 'Reliance Retail v State', task: 'Prepare Oral Arguments', deadline: 'Thu 9 AM', owner: 'AM', ownerName: 'Mehta', priority: 'p2', sla: '3d 1h', court: 'Bombay HC', stage: 'Arguments' },
    { id: 6, matter: 'Bright Steel NCLT', task: 'File Rejoinder', deadline: 'Fri 5 PM', owner: 'AI', ownerName: 'Iyer', priority: 'p3', sla: '4d 8h', court: 'NCLT Mumbai', stage: 'Rejoinder' },
  ],

  todayHearings: [
    { time: '10:30 AM', court: 'Bombay High Court', room: 'Courtroom 42', matter: 'Tata Realty v Sunrise', advocate: 'Mehta', type: 'Interim Application', color: '#3b82f6' },
    { time: '11:45 AM', court: 'City Civil Court', room: 'Court 7', matter: 'HDFC Recovery', advocate: 'Sharma', type: 'Settlement Conference', color: '#8b5cf6' },
    { time: '02:15 PM', court: 'NCLT Mumbai', room: 'Bench III (Virtual)', matter: 'Bright Steel NCLT', advocate: 'Iyer', type: 'Admission Hearing', color: '#6366f1' },
    { time: '03:30 PM', court: 'Consumer Forum', room: 'Bench II', matter: 'Sun Pharma v MedCorp', advocate: 'Kulkarni', type: 'Final Arguments', color: '#059669' },
  ],

  criticalDeadlines: [
    { date: 'Today', title: 'Reply Affidavit Due', matter: 'Tata Realty v Sunrise', sev: 'critical', owner: 'AM', sla: '3h' },
    { date: 'Today', title: 'Settlement Terms Review', matter: 'HDFC Recovery', sev: 'critical', owner: 'SS', sla: '5h' },
    { date: 'Tomorrow', title: 'GST Compliance Response', matter: 'Zenith GST', sev: 'high', owner: 'AG', sla: '18h' },
    { date: '15 May', title: 'Bundle Filing', matter: 'Kotak Arbitration', sev: 'high', owner: 'RD', sla: '2d' },
    { date: '16 May', title: 'Written Submissions', matter: 'Reliance Retail', sev: 'medium', owner: 'AM', sla: '3d' },
    { date: '18 May', title: 'Annual GST Return', matter: 'Zenith Traders', sev: 'medium', owner: 'AG', sla: '5d' },
    { date: '20 May', title: 'Appeal Brief', matter: 'Mumbai HC Writ', sev: 'low', owner: 'AK', sla: '7d' },
  ],

  activityFeed: [
    { icon: 'fa-calendar-check', title: 'Hearing rescheduled', detail: 'Ambani Estate → Moved to May 24', time: '8m ago', color: '#3b82f6', type: 'hearing' },
    { icon: 'fa-file-arrow-up', title: 'Document uploaded', detail: 'Jindal Steel – Vol IV Annexures.pdf', time: '24m ago', color: '#8b5cf6', type: 'document' },
    { icon: 'fa-circle-check', title: 'Client approved affidavit', detail: 'Sun Pharma Litigation – Final Draft', time: '1h ago', color: '#10b981', type: 'approval' },
    { icon: 'fa-comment-dots', title: 'New comment by Sharma', detail: '"Check para 14 of the rejoinder draft"', time: '1h ago', color: '#f59e0b', type: 'comment' },
    { icon: 'fa-clock-rotate-left', title: 'SLA breach warning', detail: 'Kotak Arbitration – Bundle filing overdue', time: '2h ago', color: '#ef4444', type: 'alert' },
    { icon: 'fa-indian-rupee-sign', title: 'Payment received', detail: 'Reliance Retail – ₹4,50,000 via NEFT', time: '3h ago', color: '#10b981', type: 'billing' },
    { icon: 'fa-user-plus', title: 'Team member assigned', detail: 'R. Misra added to Lodha Group matter', time: '4h ago', color: '#6366f1', type: 'team' },
  ],

  mattersAtRisk: [
    { name: 'Kotak Arbitration', risk: 'High', reason: 'Filing deadline breached by 2 days', score: 28, owner: 'RD' },
    { name: 'Ambani Estate', risk: 'High', reason: 'No activity for 45 days', score: 35, owner: 'AM' },
    { name: 'Jupiter Infra', risk: 'Medium', reason: 'Retainer depleted, unbilled work ₹2.2L', score: 52, owner: 'SS' },
    { name: 'Sun Pharma v MedCorp', risk: 'Medium', reason: 'Key witness unavailable', score: 48, owner: 'AK' },
  ],

  teamLoad: [
    { name: 'Adv. Mehta', initials: 'AM', load: 92, activeCases: 18, color: '#dc2626' },
    { name: 'Adv. Sharma', initials: 'SS', load: 78, activeCases: 14, color: '#f59e0b' },
    { name: 'Adv. Desai', initials: 'RD', load: 85, activeCases: 16, color: '#ea580c' },
    { name: 'Adv. Kulkarni', initials: 'AK', load: 61, activeCases: 9, color: '#10b981' },
    { name: 'Adv. Iyer', initials: 'AI', load: 45, activeCases: 6, color: '#10b981' },
    { name: 'Adv. Gupta', initials: 'AG', load: 72, activeCases: 12, color: '#f59e0b' },
  ],

  revenueSnapshot: {
    collected: '₹24,82,400',
    outstanding: '₹8,40,000',
    unbilled: '₹6,15,000',
    collectedPct: '+14.2%',
    leakage: '₹2,30,000',
  },

  approvalsPending: [
    { title: 'Draft Affidavit – Tata Realty', type: 'Document', from: 'S. Sharma', time: '2h ago', priority: 'p0' },
    { title: 'Fee Quote – HDFC Recovery', type: 'Billing', from: 'Accounts', time: '4h ago', priority: 'p1' },
    { title: 'Settlement Terms – Zenith GST', type: 'Legal', from: 'A. Gupta', time: 'Yesterday', priority: 'p2' },
  ],

  aiRecommendations: [
    { icon: 'fa-bolt', text: 'File interim relief for Tata Realty before Thursday hearing – 78% success probability', type: 'action' },
    { icon: 'fa-triangle-exclamation', text: 'Kotak Arbitration: Bundle filing 2 days overdue. Opposing counsel may seek costs.', type: 'risk' },
    { icon: 'fa-chart-line', text: '₹2.3L in billable time not captured this week. Review timesheets.', type: 'billing' },
  ],

  dormantCases: [
    { name: 'Ambani Estate Dispute', days: 45, lastAction: 'Hearing attended', owner: 'AM' },
    { name: 'Birla Group Advisory', days: 38, lastAction: 'Email sent to client', owner: 'RD' },
    { name: 'Mahindra IP Claim', days: 62, lastAction: 'Document filed', owner: 'SS' },
  ],

  // ==== MATTERS ====
  matters: [
    { id: 'MAT-2026-001', name: 'Tata Realty v. Sunrise Developers', client: 'Tata Realty', court: 'Bombay HC', status: 'active', stage: 'Pleadings', subStage: 'Reply Affidavit', nextAction: 'File Reply', owner: 'AM', ownerName: 'Adv. Mehta', priority: 'p0', practiceArea: 'Real Estate', nextDeadline: '13 May 2026', nextHearing: '15 May 2026', riskScore: 42, healthScore: 68, slaTimer: '3h 20m', billingStatus: 'Active', amountAtStake: '₹48Cr', inactivityDays: 0, lastMovement: '1h ago', probability: 72, clientSentiment: 'positive' },
    { id: 'MAT-2026-002', name: 'HDFC Bank Recovery Matter', client: 'HDFC Bank', court: 'City Civil Court', status: 'active', stage: 'Negotiation', subStage: 'Settlement Review', nextAction: 'Review Terms', owner: 'SS', ownerName: 'Adv. Sharma', priority: 'p1', practiceArea: 'Banking', nextDeadline: '13 May 2026', nextHearing: '22 May 2026', riskScore: 38, healthScore: 74, slaTimer: '5h 10m', billingStatus: 'Active', amountAtStake: '₹12Cr', inactivityDays: 0, lastMovement: '3h ago', probability: 65, clientSentiment: 'neutral' },
    { id: 'MAT-2026-003', name: 'Zenith GST Compliance Notice', client: 'Zenith Traders', court: 'N/A', status: 'active', stage: 'Response', subStage: 'Drafting', nextAction: 'File Response', owner: 'AG', ownerName: 'Adv. Gupta', priority: 'p1', practiceArea: 'Tax', nextDeadline: '14 May 2026', nextHearing: 'N/A', riskScore: 55, healthScore: 58, slaTimer: '18h', billingStatus: 'Retainer Low', amountAtStake: '₹3.2Cr', inactivityDays: 0, lastMovement: '6h ago', probability: 80, clientSentiment: 'concerned' },
    { id: 'MAT-2026-004', name: 'Mumbai HC Writ Petition', client: 'Individual', court: 'Bombay HC', status: 'active', stage: 'Arguments', subStage: 'Written Submissions', nextAction: 'Prepare Arguments', owner: 'AK', ownerName: 'Adv. Kulkarni', priority: 'p2', practiceArea: 'Constitutional', nextDeadline: '18 May 2026', nextHearing: '25 May 2026', riskScore: 30, healthScore: 82, slaTimer: '5d', billingStatus: 'Active', amountAtStake: '₹8Cr', inactivityDays: 2, lastMovement: '2d ago', probability: 58, clientSentiment: 'positive' },
    { id: 'MAT-2026-005', name: 'Bright Steel NCLT Insolvency', client: 'Bright Steel', court: 'NCLT Mumbai', status: 'active', stage: 'Admission', subStage: 'Documentation', nextAction: 'File Rejoinder', owner: 'AI', ownerName: 'Adv. Iyer', priority: 'p1', practiceArea: 'Insolvency', nextDeadline: '30 May 2026', nextHearing: '02 Jun 2026', riskScore: 48, healthScore: 65, slaTimer: '17d', billingStatus: 'Active', amountAtStake: '₹120Cr', inactivityDays: 1, lastMovement: '1d ago', probability: 55, clientSentiment: 'concerned' },
    { id: 'MAT-2026-006', name: 'Reliance Retail v State of Maharashtra', client: 'Reliance Retail', court: 'Bombay HC', status: 'active', stage: 'Arguments', subStage: 'Oral Arguments', nextAction: 'Prepare Submissions', owner: 'AM', ownerName: 'Adv. Mehta', priority: 'p2', practiceArea: 'Commercial', nextDeadline: '16 May 2026', nextHearing: '20 May 2026', riskScore: 25, healthScore: 85, slaTimer: '3d', billingStatus: 'Active', amountAtStake: '₹22Cr', inactivityDays: 0, lastMovement: '5h ago', probability: 78, clientSentiment: 'positive' },
    { id: 'MAT-2026-007', name: 'Alpha Capital Equity Investment', client: 'Alpha Capital', court: 'N/A', status: 'active', stage: 'Advisory', subStage: 'Due Diligence', nextAction: 'Draft Brief', owner: 'RD', ownerName: 'Adv. Desai', priority: 'p3', practiceArea: 'Corporate', nextDeadline: '25 May 2026', nextHearing: 'N/A', riskScore: 15, healthScore: 92, slaTimer: '12d', billingStatus: 'Active', amountAtStake: '₹200Cr', inactivityDays: 0, lastMovement: '8h ago', probability: 90, clientSentiment: 'positive' },
    { id: 'MAT-2026-008', name: 'Kotak Arbitration – Breach of Contract', client: 'Kotak Group', court: 'SIAC', status: 'at-risk', stage: 'Evidence', subStage: 'Bundle Filing', nextAction: 'File Bundle', owner: 'RD', ownerName: 'Adv. Desai', priority: 'p0', practiceArea: 'Arbitration', nextDeadline: '11 May 2026', nextHearing: '28 May 2026', riskScore: 72, healthScore: 28, slaTimer: 'OVERDUE', billingStatus: 'Overdue', amountAtStake: '₹85Cr', inactivityDays: 4, lastMovement: '4d ago', probability: 45, clientSentiment: 'negative' },
    { id: 'MAT-2026-009', name: 'Ambani Estate Dispute', client: 'Ambani Family Office', court: 'Supreme Court', status: 'dormant', stage: 'Pre-Trial', subStage: 'Discovery', nextAction: 'Follow up with client', owner: 'AM', ownerName: 'Adv. Mehta', priority: 'p2', practiceArea: 'Litigation', nextDeadline: '30 May 2026', nextHearing: '15 Jun 2026', riskScore: 65, healthScore: 35, slaTimer: '17d', billingStatus: 'Stalled', amountAtStake: '₹500Cr', inactivityDays: 45, lastMovement: '45d ago', probability: 40, clientSentiment: 'neutral' },
    { id: 'MAT-2026-010', name: 'Sun Pharma v MedCorp', client: 'Sun Pharma', court: 'Consumer Forum', status: 'active', stage: 'Final Arguments', subStage: 'Preparation', nextAction: 'File Written Args', owner: 'AK', ownerName: 'Adv. Kulkarni', priority: 'p2', practiceArea: 'IP/Pharma', nextDeadline: '20 May 2026', nextHearing: '13 May 2026', riskScore: 48, healthScore: 62, slaTimer: '7d', billingStatus: 'Active', amountAtStake: '₹15Cr', inactivityDays: 0, lastMovement: '12h ago', probability: 60, clientSentiment: 'neutral' },
  ],

  // ==== MATTER DETAIL ====
  matterDetail: {
    id: 'MAT-2026-001',
    name: 'Tata Realty v. Sunrise Developers',
    client: 'Tata Realty & Infrastructure Ltd.',
    clientContact: 'Vikram Nair, General Counsel',
    court: 'Bombay High Court',
    judge: 'Hon. Justice R.K. Patel',
    jurisdiction: 'Mumbai',
    courtRoom: 'Courtroom 42',
    filingNumber: 'WP/2024/8821',
    practiceArea: 'Real Estate Litigation',
    status: 'Active',
    stage: 'Pleadings',
    subStage: 'Reply Affidavit',
    stageProgress: 45,
    priority: 'P0 – Critical',
    amountAtStake: '₹48,00,00,000',
    opposingCounsel: 'K&S Partners (Adv. Rajesh Kumar)',
    riskScore: 42,
    healthScore: 68,
    probability: 72,
    clientSentiment: 'Positive',
    inactivityDays: 0,
    billingStatus: 'Active',
    slaTimer: '3h 20m',
    tags: ['Real Estate', 'High Value', 'Interim Relief', 'Bombay HC'],

    summary: 'Dispute arising from breach of a redevelopment agreement for the Sunrise Towers project in South Mumbai. Tata Realty alleges failure to meet milestone deadlines and unauthorized subcontracting. Sunrise counters citing Force Majeure. Interim relief application pending for injunction against further construction.',

    team: [
      { name: 'Adv. A. Mehta', role: 'Lead Partner', initials: 'AM', color: '#0c1525', online: true },
      { name: 'R. Desai', role: 'Senior Counsel', initials: 'RD', color: '#1e2f4d', online: true },
      { name: 'S. Sharma', role: 'Senior Associate', initials: 'SS', color: '#2a4068', online: false },
      { name: 'A. Kulkarni', role: 'Junior Associate', initials: 'AK', color: '#3a5a8f', online: false },
    ],

    tasks: [
      { id: 't1', title: 'Draft reply affidavit to interim application', assignee: 'S. Sharma', assigneeInit: 'SS', due: 'Today 4:00 PM', status: 'in-progress', priority: 'p0' },
      { id: 't2', title: 'Client approval on amended petition', assignee: 'Client Team', assigneeInit: 'TR', due: 'Started 2 days ago', status: 'waiting', priority: 'p1' },
      { id: 't3', title: 'Prepare hearing bundle for Bombay HC', assignee: 'A. Kulkarni', assigneeInit: 'AK', due: 'Tomorrow 10 AM', status: 'in-progress', priority: 'p1' },
      { id: 't4', title: 'Review evidence index for Volume I', assignee: 'R. Desai', assigneeInit: 'RD', due: 'Wed', status: 'pending', priority: 'p2' },
      { id: 't5', title: 'Schedule client conference call', assignee: 'A. Mehta', assigneeInit: 'AM', due: 'Thu', status: 'pending', priority: 'p3' },
    ],

    documents: [
      { id: 'd1', name: 'Reply_Draft_v3.pdf', type: 'pdf', date: '13 May 2026', status: 'Draft', size: '2.4 MB', owner: 'SS', version: 'v3', needsAction: true },
      { id: 'd2', name: 'Lease_Agreement_2022.pdf', type: 'pdf', date: '05 May 2026', status: 'Executed', size: '4.1 MB', owner: 'RD', version: 'Final', needsAction: false },
      { id: 'd3', name: 'Evidence_Index_Vol1.xlsx', type: 'excel', date: '10 May 2026', status: 'In Review', size: '312 KB', owner: 'AK', version: 'v2', needsAction: true },
      { id: 'd4', name: 'Court_Order_May8.pdf', type: 'pdf', date: '08 May 2026', status: 'Filed', size: '890 KB', owner: 'AM', version: 'Final', needsAction: false },
      { id: 'd5', name: 'Witness_Statement_Draft.docx', type: 'word', date: '11 May 2026', status: 'Pending Signature', size: '1.2 MB', owner: 'SS', version: 'v1', needsAction: true },
    ],

    timeline: [
      { id: 'tl1', type: 'filing', title: 'Reply Draft v3 Uploaded', detail: 'S. Sharma uploaded revised reply affidavit to Discovery folder', time: '1h ago', user: 'SS', dotColor: 'purple' },
      { id: 'tl2', type: 'hearing', title: 'Hearing Rescheduled', detail: 'Registry moved hearing to Friday, 15 May 2026. Court Room 42 confirmed.', time: '4h ago', user: 'System', dotColor: 'blue' },
      { id: 'tl3', type: 'client', title: 'Client Instructions Received', detail: 'New instructions from Tata Realty regarding subcontracting evidence chain.', time: 'Yesterday', user: 'Client', dotColor: 'green' },
      { id: 'tl4', type: 'task', title: 'Document Indexing Completed', detail: 'A. Kulkarni finished indexing Volume 1 of the paperbook (148 pages).', time: '2 days ago', user: 'AK', dotColor: 'amber' },
      { id: 'tl5', type: 'status', title: 'Stage Updated: Pleadings Phase', detail: 'Matter moved from Pre-Trial to Pleadings Phase. SLA timers reset.', time: '3 days ago', user: 'AM', dotColor: 'blue' },
      { id: 'tl6', type: 'billing', title: 'Time Entry Recorded', detail: 'R. Desai logged 3.5 hours for review of supplemental lease agreement.', time: '4 days ago', user: 'RD', dotColor: 'purple' },
      { id: 'tl7', type: 'approval', title: 'Partner Approved Draft Petition', detail: 'A. Mehta approved the amended writ petition for filing.', time: '5 days ago', user: 'AM', dotColor: 'green' },
      { id: 'tl8', type: 'evidence', title: 'Evidence Bundle Submitted', detail: 'Vol I-III of documentary evidence submitted to court registry.', time: '1 week ago', user: 'AK', dotColor: 'amber' },
    ],

    notes: [
      { id: 'n1', tag: 'Strategy', title: 'Section 17 Interim Relief', content: 'Push for expedited hearing on Section 17 petition to prevent further construction by Sunrise. Focus on the unauthorized subcontracting angle.', author: 'A. Mehta', time: '2h ago', tagColor: '#3b82f6' },
      { id: 'n2', tag: 'Evidence', title: 'New Lease Discovery', content: 'Supplemental lease agreement from 2022 may be the missing link for the subcontracting argument. Cross-reference with Clause 14.2.', author: 'S. Sharma', time: 'Yesterday', tagColor: '#f59e0b' },
      { id: 'n3', tag: 'Client', title: 'Client Meeting Notes', content: 'Client wants aggressive timeline. Ready to escalate to Supreme Court if needed. Budget approved for Phase 2.', author: 'R. Desai', time: '3 days ago', tagColor: '#10b981' },
    ],

    billing: {
      unbilled: '₹45,000',
      retainer: '₹2,00,000',
      retainerUsed: 62,
      monthlyFees: '₹1,25,000',
      totalBilled: '₹8,40,000',
      writeOffs: '₹15,000',
    },

    nextHearing: {
      court: 'Bombay High Court',
      room: 'Courtroom 42',
      judge: 'Hon. Justice R.K. Patel',
      date: '15 May 2026',
      time: '10:30 AM',
      type: 'Interim Application',
    },

    deadlines: [
      { date: '13 May', title: 'File Reply Affidavit', urgent: true, sla: '3h 20m' },
      { date: '14 May', title: 'Bundle Submission to Registry', urgent: true, sla: '1d 4h' },
      { date: '15 May', title: 'Hearing – Section 17 Application', urgent: false, sla: '2d' },
      { date: '20 May', title: 'Client Conference Call', urgent: false, sla: '7d' },
    ],

    riskFlags: [
      { text: 'Critical witness testimony pending notarization', severity: 'high' },
      { text: 'Budget at 62% utilization for Phase 2', severity: 'medium' },
      { text: 'Opposing counsel known for adjournment tactics', severity: 'low' },
    ],
  },

  // ==== DOCUMENTS ====
  docStats: { total: 328, drafts: 12, signatures: 4, overdue: 3 },
  docActions: [
    { name: 'Writ Petition Draft v3', badge: 'Due Today', severity: 'critical', detail: 'Partner review needed • Tata Realty', icon: 'fa-file-circle-xmark' },
    { name: 'Client Affidavit', badge: 'Pending Sig', severity: 'high', detail: 'Awaiting execution • HDFC Recovery', icon: 'fa-file-signature' },
    { name: 'Evidence Bundle Vol II', badge: 'Incomplete', severity: 'medium', detail: 'Missing Annexure 4B • Bright Steel', icon: 'fa-folder-open' },
  ],
  docLibrary: [
    { id: 'dl1', name: 'Reply_Affidavit_v3.pdf', matter: 'Tata Realty', owner: 'AM', updated: 'Today', stage: 'Draft', type: 'pdf', size: '2.4 MB', version: 'v3' },
    { id: 'dl2', name: 'Lease_Agreement_Final.pdf', matter: 'Alpha Capital', owner: 'RD', updated: 'Yesterday', stage: 'Executed', type: 'pdf', size: '4.1 MB', version: 'Final' },
    { id: 'dl3', name: 'Board_Resolution.docx', matter: 'HDFC Recovery', owner: 'SS', updated: '12 May', stage: 'Client Review', type: 'word', size: '1.8 MB', version: 'v2' },
    { id: 'dl4', name: 'Evidence_Index.xlsx', matter: 'Zenith GST', owner: 'AK', updated: '10 May', stage: 'Filed', type: 'excel', size: '312 KB', version: 'v1' },
    { id: 'dl5', name: 'Settlement_Terms_v2.pdf', matter: 'Reliance Retail', owner: 'AM', updated: '8 May', stage: 'In Review', type: 'pdf', size: '1.5 MB', version: 'v2' },
    { id: 'dl6', name: 'Power_of_Attorney.pdf', matter: 'Bright Steel', owner: 'AI', updated: '6 May', stage: 'Pending Sig', type: 'pdf', size: '890 KB', version: 'v1' },
  ],
  versionHistory: [
    { version: 'v3', time: 'Today, 10:45 AM', detail: 'Revised by Adv. Mehta • Para 14 updated', active: true },
    { version: 'v2', time: '10 May, 04:20 PM', detail: 'Partner review comments addressed', active: false },
    { version: 'v1', time: '08 May, 11:00 AM', detail: 'Initial draft by S. Sharma', active: false },
  ],

  // ==== BILLING ====
  billingStats: {
    collected: '₹24,82,400',
    collectedPct: '+14.2%',
    outstanding: '₹8,40,000',
    unbilled: '₹6,15,000',
    writeOff: '₹1,20,000',
  },
  revenueByPractice: [
    { name: 'Litigation', amount: '₹11,20,450', pct: 45, color: '#0c1525' },
    { name: 'Corporate', amount: '₹4,82,000', pct: 19, color: '#3b82f6' },
    { name: 'Arbitration', amount: '₹3,60,000', pct: 15, color: '#6366f1' },
    { name: 'Regulatory', amount: '₹2,44,180', pct: 10, color: '#8b5cf6' },
    { name: 'Advisory', amount: '₹2,75,770', pct: 11, color: '#10b981' },
  ],
  invoices: [
    { id: 'INV-2026-101', client: 'Tata Realty & Infrastructure', matter: 'Acquisition of Worli Parcel', amount: '₹85,000', hours: 12, aging: 14, status: 'pending' },
    { id: 'INV-2026-098', client: 'Alpha Capital Partners', matter: 'Series C Financing Compliance', amount: '₹1,10,000', hours: 28, aging: 42, status: 'overdue' },
    { id: 'INV-2026-095', client: 'HDFC Bank Ltd', matter: 'NPA Resolution Advisory', amount: '₹55,000', hours: 8, aging: 7, status: 'sent' },
    { id: 'INV-2026-092', client: 'Reliance Retail', matter: 'State Litigation Defense', amount: '₹2,40,000', hours: 35, aging: 21, status: 'overdue' },
  ],
  timeEntries: [
    { user: 'AM', name: 'Adv. Mehta', client: 'Tata Realty', work: 'Due Diligence Review – Title Deeds', amount: '₹25,000', hours: '2.50', rate: '₹10,000/hr' },
    { user: 'SS', name: 'S. Sharma', client: 'HDFC', work: 'Drafting Compliance Certificate', amount: '₹5,000', hours: '0.50', rate: '₹10,000/hr' },
    { user: 'AK', name: 'A. Kulkarni', client: 'Zenith GST', work: 'Tribunal Preparation', amount: '₹40,000', hours: '4.00', rate: '₹10,000/hr' },
    { user: 'RM', name: 'R. Misra', client: 'Lodha Group', work: 'Agreement to Sell – Final Review', amount: '₹18,000', hours: '1.50', rate: '₹12,000/hr' },
  ],
  receivables: [
    { client: 'Reliance Retail', amount: '₹2,40,000', status: 'Overdue 15D', severity: 'critical' },
    { client: 'Lodha Group', amount: '₹1,80,000', status: 'Due Today', severity: 'high' },
    { client: 'Sun Pharma', amount: '₹95,000', status: 'Due 3D', severity: 'medium' },
    { client: 'Alpha Capital', amount: '₹1,10,000', status: 'Overdue 42D', severity: 'critical' },
  ],

  // ==== CALENDAR ====
  calendarEvents: {
    10: [{ title: 'Tata Realty – Reply Due', type: 'deadline' }],
    11: [{ title: 'Kotak Bundle Filing', type: 'deadline' }],
    12: [{ title: '10:30 AM Bombay HC', type: 'hearing' }],
    13: [{ title: 'Reply Affidavit Due', type: 'deadline' }, { title: '3:30 PM Consumer Forum', type: 'hearing' }],
    14: [{ title: 'Bundle Submission', type: 'filing' }, { title: 'HDFC Meeting', type: 'meeting' }],
    15: [{ title: '10:30 AM Bombay HC', type: 'hearing' }, { title: '02:15 PM NCLT', type: 'hearing' }],
    16: [{ title: 'Written Submissions', type: 'deadline' }],
    18: [{ title: 'GST Filing – Zenith', type: 'filing' }],
    20: [{ title: 'Strategy Review', type: 'meeting' }, { title: 'Reliance HC', type: 'hearing' }],
    22: [{ title: 'HDFC Settlement Conf', type: 'hearing' }],
    25: [{ title: 'Mumbai HC Writ', type: 'hearing' }],
    28: [{ title: 'Kotak SIAC Hearing', type: 'hearing' }],
  },

  // ==== NOTIFICATIONS ====
  notifStats: { unread: 14, approvals: 3, deadlines: 5, billing: 2, mentions: 4 },
  notifications: [
    { id: 'n1', type: 'urgent', icon: 'fa-gavel', title: 'Critical Filing Deadline', detail: 'Reply affidavit for Tata Realty due at 4:00 PM today.', time: '12m ago', read: false, matter: 'Tata Realty', priority: 'p0' },
    { id: 'n2', type: 'approval', icon: 'fa-file-signature', title: 'Document Signed', detail: 'Client signed settlement agreement for HDFC Recovery.', time: '25m ago', read: false, matter: 'HDFC Recovery', priority: 'p1' },
    { id: 'n3', type: 'payment', icon: 'fa-credit-card', title: 'Invoice Paid', detail: 'Retainer payment of ₹4,50,000 from Reliance Retail.', time: '1h ago', read: false, matter: 'Reliance Retail', priority: 'p2' },
    { id: 'n4', type: 'mention', icon: 'fa-at', title: 'You were mentioned', detail: 'Adv. Sharma: "Review annexure 4 by EOD – @Mehta"', time: '2h ago', read: false, matter: 'Tata Realty', priority: 'p1' },
    { id: 'n5', type: 'alert', icon: 'fa-triangle-exclamation', title: 'SLA Breach', detail: 'Kotak Arbitration bundle filing is 2 days overdue.', time: '3h ago', read: true, matter: 'Kotak Arbitration', priority: 'p0' },
    { id: 'n6', type: 'system', icon: 'fa-circle-plus', title: 'New Matter Created', detail: 'Matter #MC-2026-011 initialized by Adv. Desai.', time: 'Today 09:10', read: true, matter: 'New Matter', priority: 'p3' },
    { id: 'n7', type: 'deadline', icon: 'fa-clock', title: 'Deadline Approaching', detail: 'Bundle submission for Bombay HC due tomorrow.', time: 'Today 08:00', read: true, matter: 'Tata Realty', priority: 'p1' },
  ],

  // ==== CONTROL CENTER ====
  controlStats: { users: 18, growth: '+12%', invites: 2, roles: 4 },
  teamMembers: [
    { name: 'Adv. R. Mehta', role: 'Managing Partner', department: 'Litigation', access: 'Full Admin', status: 'Online', initials: 'RM', color: '#0c1525' },
    { name: 'Adv. S. Sharma', role: 'Senior Associate', department: 'Real Estate', access: 'Standard', status: 'Active 2h ago', initials: 'SS', color: '#1e2f4d' },
    { name: 'Adv. A. Kulkarni', role: 'Associate', department: 'Compliance', access: 'Standard', status: 'Active 4h ago', initials: 'AK', color: '#2a4068' },
    { name: 'R. Desai', role: 'Senior Partner', department: 'Insolvency', access: 'Full Admin', status: 'Online', initials: 'RD', color: '#3a5a8f' },
    { name: 'Adv. Iyer', role: 'Associate', department: 'Corporate', access: 'Standard', status: 'Active 1h ago', initials: 'AI', color: '#5a7ab0' },
    { name: 'Adv. Gupta', role: 'Senior Associate', department: 'Tax', access: 'Standard', status: 'Online', initials: 'AG', color: '#8aa2ca' },
  ],
  auditLog: [
    { title: 'Role Modified', detail: 'P. Joshi → Limited Access', time: '2h ago', type: 'change', user: 'AM' },
    { title: 'Security Scan Completed', detail: 'No vulnerabilities detected', time: '5h ago', type: 'system', user: 'System' },
    { title: 'New User Added', detail: 'A. Gupta joined as Associate', time: '1d ago', type: 'add', user: 'AM' },
    { title: 'API Key Regenerated', detail: 'Production API key rotated', time: '2d ago', type: 'security', user: 'RD' },
    { title: 'Policy Updated', detail: 'External sharing set to Restricted', time: '3d ago', type: 'policy', user: 'AM' },
  ],
  policies: [
    { name: 'Matter Visibility', value: 'Strict', icon: 'fa-eye', desc: 'Users see only assigned matters' },
    { name: 'External Sharing', value: 'Restricted', icon: 'fa-share-nodes', desc: 'Requires partner approval' },
    { name: 'Client Portal', value: 'Active', icon: 'fa-globe', desc: 'Self-service portal enabled' },
    { name: 'Data Retention', value: '7 Years', icon: 'fa-database', desc: 'Auto-archive after retention period' },
    { name: 'MFA Policy', value: 'Enforced', icon: 'fa-shield-halved', desc: 'Required for all user accounts' },
  ],

  // ==== CLIENT PORTAL ====
  portalStages: [
    { stage: 'Briefing', date: '01 May', status: 'completed', icon: 'fa-clipboard-check' },
    { stage: 'Petition Filed', date: '05 May', status: 'completed', icon: 'fa-file-lines' },
    { stage: 'Reply Phase', date: 'In Progress', status: 'active', icon: 'fa-pen-to-square' },
    { stage: 'Hearing', date: '15 May', status: 'upcoming', icon: 'fa-gavel' },
    { stage: 'Judgment', date: 'TBD', status: 'pending', icon: 'fa-scale-balanced' },
  ],
  portalDocs: [
    { name: 'Draft Reply Affidavit.pdf', date: 'Today, 10:45 AM', status: 'For Review', icon: 'fa-file-pdf' },
    { name: 'Court Order – May 8.pdf', date: '08 May 2026', status: 'Filed', icon: 'fa-file-circle-check' },
    { name: 'Evidence Index.xlsx', date: '10 May 2026', status: 'Completed', icon: 'fa-file-excel' },
  ],
  portalFinancial: { retainer: '₹2,00,000', utilized: '₹1,24,000', pending: '₹1,25,000' },

  // ==== ANALYTICS ====
  monthlyRevenue: [
    { month: 'Jul', value: 1420000 }, { month: 'Aug', value: 1580000 }, { month: 'Sep', value: 1320000 },
    { month: 'Oct', value: 1750000 }, { month: 'Nov', value: 1640000 }, { month: 'Dec', value: 1880000 },
    { month: 'Jan', value: 1520000 }, { month: 'Feb', value: 1960000 }, { month: 'Mar', value: 1780000 },
    { month: 'Apr', value: 2100000 }, { month: 'May', value: 2482000 },
  ],
  casesByPractice: [
    { name: 'Litigation', value: 45, color: '#0c1525' }, { name: 'Corporate', value: 23, color: '#3b82f6' },
    { name: 'Regulatory', value: 18, color: '#6366f1' }, { name: 'Arbitration', value: 12, color: '#8b5cf6' },
    { name: 'Advisory', value: 8, color: '#10b981' },
  ],
  matterFlow: [
    { month: 'Jan', opened: 12, closed: 8 }, { month: 'Feb', opened: 15, closed: 11 },
    { month: 'Mar', opened: 10, closed: 14 }, { month: 'Apr', opened: 18, closed: 12 },
    { month: 'May', opened: 14, closed: 16 },
  ],

  // ==== SEARCH ====
  searchItems: [
    { type: 'matter', icon: 'fa-gavel', title: 'Tata Realty v. Sunrise Developers', sub: 'MAT-2026-001 • Bombay HC' },
    { type: 'matter', icon: 'fa-gavel', title: 'HDFC Bank Recovery', sub: 'MAT-2026-002 • City Civil Court' },
    { type: 'matter', icon: 'fa-gavel', title: 'Zenith GST Notice', sub: 'MAT-2026-003 • Tax Compliance' },
    { type: 'matter', icon: 'fa-gavel', title: 'Kotak Arbitration', sub: 'MAT-2026-008 • SIAC' },
    { type: 'client', icon: 'fa-building', title: 'Tata Realty & Infrastructure', sub: 'Client • 3 active matters' },
    { type: 'client', icon: 'fa-building', title: 'HDFC Bank Ltd', sub: 'Client • 1 active matter' },
    { type: 'client', icon: 'fa-building', title: 'Reliance Retail', sub: 'Client • 1 active matter' },
    { type: 'document', icon: 'fa-file-pdf', title: 'Reply_Affidavit_v3.pdf', sub: 'Tata Realty • Draft • Today' },
    { type: 'document', icon: 'fa-file-pdf', title: 'Settlement_Terms_v2.pdf', sub: 'Reliance Retail • In Review' },
    { type: 'person', icon: 'fa-user', title: 'Adv. Mehta', sub: 'Managing Partner • 18 cases' },
    { type: 'person', icon: 'fa-user', title: 'S. Sharma', sub: 'Senior Associate • 14 cases' },
    { type: 'action', icon: 'fa-plus', title: 'Create New Matter', sub: 'Start a new case file' },
    { type: 'action', icon: 'fa-clock', title: 'Log Time Entry', sub: 'Record billable hours' },
    { type: 'action', icon: 'fa-file-arrow-up', title: 'Upload Document', sub: 'Add file to matter' },
  ],
};
