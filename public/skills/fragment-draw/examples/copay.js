// The home page's healthcare scenario, rebuilt: two payers merge into Acme Health, which pays out to two providers.
// A schema map is the money's route, not the org chart: every box holds money or sends it, every line carries it.

fragment({
  kind: "diagram",
  name: "copay",
  means: "A patient's copay and an insurer's reimbursement meet in Acme Health's ledger, then pay the clinic and the pharmacy.",
  size: [504, 600],
  nodes: [
    { id: "patient", label: "Patient", x: 150, y: 70 },
    { id: "insurer", label: "Insurer", x: 354, y: 70 },
    {
      id: "acme",
      label: "Acme Health",
      x: 252,
      y: 290,
      accounts: [
        { name: "Receivables", type: "asset" },
        { name: "Cash", type: "asset" },
        { name: "Payables", type: "liability" },
        { name: "Customer funds", type: "liability" },
      ],
    },
    { id: "clinic", label: "Clinic", x: 150, y: 520 },
    { id: "pharmacy", label: "Pharmacy", x: 354, y: 520 },
  ],
  // two lines into one box share a trunk: the router bends both at the midpoint, so they merge on their own
  edges: [
    { from: "patient", to: "acme" },
    { from: "insurer", to: "acme" },
    { from: "acme", to: "clinic" },
    { from: "acme", to: "pharmacy" },
  ],
  // money arrives together, then leaves together: two steps, not four
  steps: [
    ["patient~acme", "insurer~acme"],
    ["acme~clinic", "acme~pharmacy"],
  ],
});
