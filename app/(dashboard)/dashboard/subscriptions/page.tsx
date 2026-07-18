export default function SubscriptionsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage all your recurring subscriptions in one place.
        </p>
      </div>

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Service</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Frequency</th>
                <th className="px-4 py-3 text-left font-medium">
                  Next Billing
                </th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.name} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{sub.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {sub.category}
                  </td>
                  <td className="px-4 py-3">{sub.amount}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {sub.frequency}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {sub.nextBilling}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        sub.status === "Active"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {sub.status}
                    </span>
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

const subscriptions = [
  {
    name: "Netflix",
    category: "Entertainment",
    amount: "$15.49",
    frequency: "Monthly",
    nextBilling: "Aug 1, 2026",
    status: "Active",
  },
  {
    name: "Spotify",
    category: "Music",
    amount: "$11.99",
    frequency: "Monthly",
    nextBilling: "Jul 28, 2026",
    status: "Active",
  },
  {
    name: "Amazon Prime",
    category: "Shopping",
    amount: "$139.00",
    frequency: "Annually",
    nextBilling: "Dec 15, 2026",
    status: "Active",
  },
  {
    name: "Adobe Creative Cloud",
    category: "Software",
    amount: "$59.99",
    frequency: "Monthly",
    nextBilling: "Aug 5, 2026",
    status: "Active",
  },
  {
    name: "Gym Membership",
    category: "Health",
    amount: "$45.00",
    frequency: "Monthly",
    nextBilling: "Jul 25, 2026",
    status: "Canceled",
  },
];
