# SaBo Financial Core

The financial core is designed around an immutable double-entry ledger.

## Principles

- Never change a settled ledger entry.
- Every transfer has equal debits and credits.
- Store monetary values as integers in minor units, never floating point.
- Use idempotency keys for externally retried requests.
- Keep an auditable transaction trail.
- This module is a development foundation, not a production payment system.

## First domain model

`Account -> Transaction -> LedgerEntry`

A transfer from account A to account B creates one transaction with two ledger entries:

- debit A
- credit B

The transaction is valid only when total debits equal total credits.
