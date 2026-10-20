# The finished pieces

Every diagram, illustration and field on the seven pages this skill learned from, with what each one teaches. When a request names one of these pages, or brings one of these pieces as a reference, read its section first. Three are rebuilt in `examples/`.

## fragment.dev/

| Piece | Kind | What it is | What it teaches |
| --- | --- | --- | --- |
| Hero line | type | `Make money work.` typed onto the empty grey canvas, a word at a time | the canvas alone is a stage; type is the first motion |
| Agent hero | window + diagram | An app window (sidebar: Agent, Search, Scenarios; Home, Payments, Recon, Accounts, Entries) with a scenario list (`0 [Start]`, `1 patient_copay`, `2 insurer_reimbursement`, `3 clinic_payout`, greyed `4 pharmacy_payout`, `5 opening_balance`) beside a `Schema` map: Patient and Insurer merge into Acme Health [Receivables, Cash, Payables, Customer funds]. A dark agent window types `add a customer-funds liability` / `post the opening balance`, its output indented in grey, `* entry posted` | the diagram lives inside the product; future steps are greyed rows; the agent's words are lower case and plain. Rebuilt as `examples/copay.js` |
| Model any funds flow | window + diagram | `Schema/Billing`: Customers → Acme [Receivables, Cash, Deferred revenue, Revenue] → `$` → Bank, beside the agent typing `add billing for our customers` / `ledger billing` / `invoice → receivable + deferred` / `* schema generated` | three nodes in a column is enough |
| Move and track money | window | `pay_7Q4Xm2`, `38,000.00 USD`; a key–value table (User, Type `card_payin`, Status `processing.` → `settled`) and lines (settlement, receivable, fee, fee-payable) each with an account mark, path and signed amount | ruled rows, signed amounts right-aligned, a status that changes |
| Turn conversations into objects | window | `Recon`: stat cards (Unreconciled `6 payments`, Outstanding `$590,900`), a file list (`bank-oct.csv`, `stripe-payouts.csv`, `remittance-4821.pdf`…) with status, an account tree with balances; the agent lists the files underlined | files as objects, balances as a tree |
| Conditions | card | one row `assets/cash  $700` with a green mark, framed | one row can be the whole picture |
| Typesafe SDKs | card | `fragment.PostVendorPayout(payout_amount: …` typed and truncated, method in green | code is set as code, coloured by role |
| Use cases | window | tabs (Insurer, Bank, Patient portal, Clinic) over a JSON record; a value (`950.00`) highlighted in a filled chip | one highlight says where to look |

## fragment.dev/v2

Five fields, one engine (`fields.md`). Their accessible names say what they do, and are the model for a `means`:

| Piece | Accessible name |
| --- | --- |
| hero | Money_v2: grey numbers give way to a coloured cluster carrying the Fragment, Money and v2 marks |
| v1 | Grey numbers flickering in place across a grid |
| stutter | Coloured numbers hopping through a grey grid and stalling in orange |
| blend | A coloured cluster of numbers growing in the middle of a grey grid |
| full | Coloured numbers sweep in and take over a grey grid almost entirely |

`examples/carry.js` is a cluster in the manner of hero and blend.

## fragment.dev/blog

| Piece | Kind | What it is |
| --- | --- | --- |
| Payment Accounts (featured) | window | an `Accounts` tree (assets › operating_cash, receivables › user › order; liabilities › payables › restaurant, driver; income › platform_fee) that an agent, a small red disc, types a new account into, a character at a time (`ope|`) |
| Pay $100 (featured) | chip | a rounded black button, `Pay $100`, and the pointer arriving to press it |
| Building Balances II (featured) | type | a grid of amounts with currencies (`12$ 64€ 14£ / 36¥ 61฿ 22$ / …`) collapsing to one (`10$`, `49$`): many writes, one balance |
| Posts | illustration | the flipbooks below: `low-latency-reads-*`, `high-throughput-*`, `historical-balance-*`, `low-throughput-*`, `*-under-the-hood`, `ClearingAccountBlog`, `wallet-hero`, `scoreboard`, `old-new` |
| Customer stories | illustration | `whop-hero`, `ramp-hero`, `pleo-*`, `atob-*`, `AtoB_*`, `nomos-*`, `basic-capital-hero`, `BasicCapital_SystemDiagram`, `BCBlogPost_Hero_SVG` |
| Changelog | illustration | `changelog-jun-24`, `nov2025`, `Oct25Changelog`, `Dec25Changelog`, `Jan26Changelog` |

## fragment.dev/product/ledgers

| Piece | Kind | What it is |
| --- | --- | --- |
| Hero | window + diagram | `Invoice and collection` scenarios (`invoice_raised`, `payment_received`, `revenue_recognized`, greyed `credit_note`, `opening_balance`) and `Schema/Billing`: Customers → Acme [Receivables, Cash, Deferred revenue, Revenue] → Bank, with a `$` riding each line in turn (3.1 s: two steps of 1.2 s and 0.7 s still) |
| Schemas | card | the schema as JSON with line numbers: `"key": "wallets"`, `"type": "funding"`, `"path": "liabilities/users:u_123/available"`, `"amount": "{{amount}}"` |
| Built for run-time | data | a row of 100 green bars filling as a request counter climbs to `19,622,609`, over a table of reads and writes (throughput /sec, latency @p95) |

## fragment.dev/product/payments

| Piece | Kind | What it is |
| --- | --- | --- |
| Hero | window | `pay_7Q4Xm2` settling, `38,000.00 USD`, its four lines, beside the agent: `collect invoice inv_4821` / `card_payin $38,000` / `settlement → payments, fee → payable` / `+ settled` |
| Payment Accounts | window | `Northwind Trading`, `$50,000`, an assets tree (cash, payments, user-balances, loan-details, investment-portfolio) with balances cut off by the window's edge |
| Rails | list | `Method`: Card, ACH, Wire, RTP, Cheque, each with a small glyph, and the pointer moving down them |

## fragment.dev/product/reconciliation

| Piece | Kind | What it is |
| --- | --- | --- |
| Hero | window | `Recon`: Unreconciled `2 payments`, Outstanding `$71,200`, Active agents `1`; files `processed` / `pending` in grey; balances by account type; the agent: `reconcile these for October` / `bank-oct.csv → cash` / … / `· difference 0` |
| FRAGMENT Agent | window | `remittance-4821.pdf` / `parse this document` / `+ thinking…` |
| Links | list | `Add+`: Stripe, Increase, Custom, each with its small mark, and the pointer |
| Clearing | card | the clearing account netting to zero |

## fragment.dev/docs

The index uses 12–13px marks beside each guide (the ledger's four squares for Accounting 101, a disc for Payments). The guides' plates are flipbooks:

| Flipbook | Frames | Plate | What it is |
| --- | --- | --- | --- |
| `intro` | 3 | 621 × 450 | `Design, Implement and Operate your Ledger`: a Ledger Designer window listing Assets, Liabilities, Income, Expenses with their marks |
| `api-overview` | 5 | 621 × 523 | Schema over Ledger, Ledger holding Accounts and Entries in two columns |
| `reconciliation` | 7 | 621 × 450 | a FRAGMENT group holding Ledger and Link, beside Bank; each frame titles a step and brings its part from grey to ink |
| `idempotency` | 7 | 622 × 451 | `addLedgerEntry(){ ik:1234 }` → `Entry_1234`; the response `ikReplay: false`, then `true` on the retry |
| `authentication` | 6 | 621 × 451 | a client's credentials → a token → the API |
| `deploy-your-ledger` | 5 | 622 × 450 | the schema in a code box → a ledger in the Fragment window |
| `handle-currencies` | 8 | 621 × 359 | one ledger, accounts in AUD, USD, CAD, GBP, each with its mark |
| `multi-currency-example` | 6 | 622 × 468 | entries and accounts side by side in several currencies |
| `reversals` | 3 | — | an entry and its reversal |
| `migrations` | 6 | 621 × 450 | a schema version changing |
| `export-data`, `ExportData_Diagram` | 2 | 621 × 441 / 450 | a FRAGMENT window → an S3 bucket (a drum) |
| `import-data_diagram` | 2 | 621 × 450 | `Your DB` → `FRAGMENT` |
| `entryBalancingStateLayer` | 2 | 378 × 549 | `Unbalanced Entry`: an entry's lines over the accounting equation (Assets, Liabilities, Income, Expense; State, Change in an orange-ruled row) |

## The blog's, stories' and security's flipbooks

| Flipbook | Frames | Plate | What it is |
| --- | --- | --- | --- |
| `low-latency-reads-post-hero` | 2 | 621 × 500 | a balance table in a narrow box, read |
| `low-latency-reads-latest-balance` | 5 | 720 × 500 | account and balance rows filling |
| `low-latency-reads-historical-balance-read` / `-write` | 6 / 6 | 621 × 500 | `user-wallet` and its balance by date; `addLedgerEntry(posted: …)` |
| `historical-balance-structure` | 5 | 622 × 501 | columns of Hour, Day, Month, Year buckets |
| `historical-balance-coalescing` | 5 | 622 × 501 | the buckets merging |
| `high-throughput-writes-hero` | 4 | 622 × 501 | numbered items queueing into one box |
| `low-throughput-updates` / `high-throughput-updates` | 6 / 2 | 622 × 501 | a fan of thin lines from a column of items into one account |
| `high-throughput-event-bus` | 7 | 622 × 501 | a drum (DynamoDB) → Event Bus → Balance Queue |
| `low-throughput-balance-updates` | 5 | 622 × 501 | `Designing A System of Record`: five sources fanning into `bank 0` |
| `elastic-` / `dynamo-` / `reads-under-the-hood` | 4 / 2 / 2 | 621 × 448 | the API, the store's partitions as stacked drums |
| `ClearingAccountBlog` | 20 | 621 × 500 | `Invoice_02 100.00!` blinking orange, cleared to `0.00✓`, retyped. Rebuilt as `examples/clearing.js` |
| `wallet-hero` | 4 | 622 × 469 | a phone beside the ledger, a wallet funded |
| `scoreboard` | 6 | 622 × 469 | a results table with bar rows |
| `old-new` | 2 | 622 × 469 | an old flow in grey beside the new one in ink |
| `whop-hero` | 43 | 720 × 500 | a terminal: `Create a Partnerships card at 30 limit` typed, the agent's grey working lines, `Done! $5000 per-day limit card is live` |
| `ramp-hero` | 3 | 720 × 500 | a spend request card: `Acme Corp.`, a progress bar, Requested / Approved |
| `pleo-hero`, `pleo-fragment-arch` | 5, 2 | 622 × 500 | `Cashflow Balances` in many currencies with marks; the architecture |
| `atob-hero`, `AtoB_Blog-post_Arch`, `AtoB_Blog-post_BlogLanding` | 6, 7, 4 | 622 × 501, 722 × 501 | a fuel-card account; Drivers → Card Network → Merchants with AtoB and FRAGMENT under it, arrows lit in turn; `FRAGMENT & AtoB` |
| `nomos-hero`, `nomos-arch`, `nomos-blog-landing` | 12, 8, 4 | 621 × 500, 721 × 500 | a consumption chart redrawn each frame, `Savings: 20%` in green; Customer → Nomos → Exchange, Grid, Partner; `FRAGMENT & NOMOS` |
| `basic-capital-hero`, `BCBlogPost_Hero_SVG`, `BasicCapital_SystemDiagram` | 4, 4, 3 | 621 × 500 | a phone with a portfolio chart and holdings; Portfolios, Transactions, Statements → Basic Capital → FRAGMENT |
| `changelog-jun-24`, `nov2025`, `Oct25Changelog`, `Dec25Changelog`, `Jan26Changelog` | 2–15 | 621 × 469 | product moments: a Projects panel, a scenario list with `[Start]`, a table, a clearing pane, a billing window with `Coming` typed over it |
| `security-sla` | 12 | 491 × 361 | `Time` / `Guarantees 0:10` counting |
| `security-supply-chain` | 3 | 451 × 300 | a grid of `*` with one `!` found |
| `security-encrypt` | 24 | 491 × 361 | `Encryption`: a key masked a character a frame |
| `security-disaster-recovery` | 10 | 491 × 361 | amounts restored a digit at a time (`€159`, `$1,393`, `¥538`) |
| `security-controls` | 5 | 491 × 361 | a list (Personal Devices, Sensitive Information, Code of Conduct, …) ticked in turn |
| `careers-hero` | 8 | 1200 × 795 | `<$/>` set a character a frame, then measured with orange guides |
