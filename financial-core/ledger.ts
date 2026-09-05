export type Direction = "debit" | "credit";

export type LedgerEntry = {
  accountId: string;
  direction: Direction;
  amountMinor: bigint;
  currency: string;
};

export function validateBalancedEntries(entries: LedgerEntry[]): void {
  if (entries.length < 2) {
    throw new Error("A transaction requires at least two ledger entries");
  }

  const currencies = new Set(entries.map((entry) => entry.currency));
  if (currencies.size !== 1) {
    throw new Error("All entries in a transaction must use one currency");
  }

  let debits = 0n;
  let credits = 0n;

  for (const entry of entries) {
    if (entry.amountMinor <= 0n) {
      throw new Error("Ledger amounts must be positive");
    }

    if (entry.direction === "debit") debits += entry.amountMinor;
    else credits += entry.amountMinor;
  }

  if (debits !== credits) {
    throw new Error("Unbalanced transaction: debits must equal credits");
  }
}

export function createTransferEntries(
  fromAccountId: string,
  toAccountId: string,
  amountMinor: bigint,
  currency: string,
): LedgerEntry[] {
  if (fromAccountId === toAccountId) {
    throw new Error("Source and destination accounts must differ");
  }

  if (amountMinor <= 0n) {
    throw new Error("Transfer amount must be positive");
  }

  const entries: LedgerEntry[] = [
    { accountId: fromAccountId, direction: "debit", amountMinor, currency },
    { accountId: toAccountId, direction: "credit", amountMinor, currency },
  ];

  validateBalancedEntries(entries);
  return entries;
}
