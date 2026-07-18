export default function RefundsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Refunds</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage refund requests — both automatic and manual.
        </p>
      </div>

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Merchant</th>
                <th className="px-4 py-3 text-left font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Reason</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Expected</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((refund) => (
                <tr key={refund.merchant} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{refund.merchant}</td>
                  <td className="px-4 py-3">{refund.amount}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {refund.reason}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        refund.status === "Received"
                          ? "bg-primary/10 text-primary"
                          : refund.status === "Denied"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {refund.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {refund.expected}
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

const refunds = [
  {
    merchant: "Amazon",
    amount: "$34.99",
    reason: "Price drop adjustment",
    status: "Received",
    expected: "Jul 20, 2026",
  },
  {
    merchant: "Best Buy",
    amount: "$129.99",
    reason: "Defective product",
    status: "Pending",
    expected: "Aug 5, 2026",
  },
  {
    merchant: "Delta Airlines",
    amount: "$89.00",
    reason: "Flight delay compensation",
    status: "Submitted",
    expected: "Aug 12, 2026",
  },
  {
    merchant: "Uber",
    amount: "$12.50",
    reason: "Service issue",
    status: "Denied",
    expected: "—",
  },
];
