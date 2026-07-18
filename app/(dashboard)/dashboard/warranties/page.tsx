export default function WarrantiesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Warranties</h1>
        <p className="text-muted-foreground mt-1">
          Track product warranties and get reminders before they expire.
        </p>
      </div>

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">Brand</th>
                <th className="px-4 py-3 text-left font-medium">
                  Purchase Date
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Warranty Ends
                </th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {warranties.map((warranty) => (
                <tr key={warranty.product} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{warranty.product}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {warranty.brand}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {warranty.purchaseDate}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {warranty.endDate}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        warranty.status === "Active"
                          ? "bg-primary/10 text-primary"
                          : warranty.status === "Expiring Soon"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {warranty.status}
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

const warranties = [
  {
    product: "MacBook Pro 16\"",
    brand: "Apple",
    purchaseDate: "Jan 15, 2025",
    endDate: "Jan 15, 2028",
    status: "Active",
  },
  {
    product: "Sony WH-1000XM5",
    brand: "Sony",
    purchaseDate: "Mar 20, 2025",
    endDate: "Mar 20, 2027",
    status: "Active",
  },
  {
    product: "Dyson V15 Vacuum",
    brand: "Dyson",
    purchaseDate: "Jun 10, 2024",
    endDate: "Jun 10, 2026",
    status: "Expiring Soon",
  },
  {
    product: "Samsung TV 65\"",
    brand: "Samsung",
    purchaseDate: "Nov 5, 2023",
    endDate: "Nov 5, 2025",
    status: "Expired",
  },
  {
    product: "Instant Pot Duo",
    brand: "Instant",
    purchaseDate: "Feb 14, 2026",
    endDate: "Feb 14, 2028",
    status: "Active",
  },
];
