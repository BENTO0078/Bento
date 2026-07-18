export default function BillsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Bills</h1>
        <p className="text-muted-foreground mt-1">
          Track recurring bills and let Bento negotiate lower rates for you.
        </p>
      </div>

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Provider</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">
                  Next Due
                </th>
                <th className="px-4 py-3 text-left font-medium">Auto Pay</th>
                <th className="px-4 py-3 text-left font-medium">
                  Savings Potential
                </th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.provider} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{bill.provider}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {bill.category}
                  </td>
                  <td className="px-4 py-3">{bill.amount}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {bill.nextDue}
                  </td>
                  <td className="px-4 py-3">
                    {bill.autoPay ? (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Auto
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        Manual
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {bill.savingsPotential && (
                      <span className="text-primary font-medium">
                        {bill.savingsPotential}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const bills = [
  {
    provider: "Comcast",
    category: "Internet",
    amount: "$89.99",
    nextDue: "Aug 10, 2026",
    autoPay: true,
    savingsPotential: "~$20/mo",
  },
  {
    provider: "GEICO",
    category: "Auto Insurance",
    amount: "$142.00",
    nextDue: "Aug 15, 2026",
    autoPay: true,
    savingsPotential: "~$35/mo",
  },
  {
    provider: "AT&T",
    category: "Phone",
    amount: "$75.00",
    nextDue: "Aug 5, 2026",
    autoPay: true,
    savingsPotential: "~$15/mo",
  },
  {
    provider: "PG&E",
    category: "Utilities",
    amount: "$120.00",
    nextDue: "Aug 1, 2026",
    autoPay: false,
    savingsPotential: null,
  },
  {
    provider: "Progressive",
    category: "Home Insurance",
    amount: "$95.00",
    nextDue: "Sep 1, 2026",
    autoPay: true,
    savingsPotential: "~$25/mo",
  },
];
