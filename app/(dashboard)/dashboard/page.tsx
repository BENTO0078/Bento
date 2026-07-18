export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s your financial overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-lg border bg-card p-6"
          >
            <div className="text-sm font-medium text-muted-foreground">
              {stat.name}
            </div>
            <div className="mt-2 text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Placeholder: Charts & Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold mb-4">Monthly Savings</h2>
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm border rounded-md">
            Savings chart coming soon
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const stats = [
  { name: "Total Saved", value: "$1,247" },
  { name: "Active Subs", value: "12" },
  { name: "Bills Tracked", value: "8" },
  { name: "Pending Refunds", value: "$143" },
];

const activities = [
  { title: "Negotiated internet bill — saved $20/month", time: "2 hours ago" },
  { title: "Canceled unused streaming subscription", time: "Yesterday" },
  { title: "Filed price adjustment refund — $34.99", time: "2 days ago" },
  { title: "Warranty expiring soon: MacBook Pro", time: "3 days ago" },
  { title: "Tax document organized: W-2 received", time: "1 week ago" },
];
