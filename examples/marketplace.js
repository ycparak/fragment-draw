// /fragment-draw diagram a marketplace payout
// A buyer's card payment arrives through the card network into Acme Market's ledger, which pays the seller
// their share and holds the sales tax for the authority. The fee never leaves: it is the ledger's income.

fragment({
  kind: "diagram",
  name: "marketplace",
  means: "A buyer's card payment lands in Acme Market's ledger, which pays the seller their share and sends the sales tax on.",
  size: [504, 700],
  nodes: [
    { id: "buyer", label: "Buyer", x: 252, y: 50 },
    { id: "network", label: "Card network", x: 252, y: 190 },
    {
      id: "acme",
      label: "Acme Market",
      x: 252,
      y: 400,
      accounts: [
        { name: "Receivables", type: "asset" },
        { name: "Cash", type: "asset" },
        { name: "Seller payables", type: "liability" },
        { name: "Tax payable", type: "liability" },
        { name: "Fee revenue", type: "income" },
      ],
    },
    { id: "seller", label: "Seller", x: 150, y: 640 },
    { id: "tax", label: "Tax authority", x: 354, y: 640 },
  ],
  edges: [
    { from: "buyer", to: "network" },
    { from: "network", to: "acme" },
    { from: "acme", to: "seller" },
    { from: "acme", to: "tax" },
  ],
  steps: [["buyer~network"], ["network~acme"], ["acme~seller", "acme~tax"]],
});
