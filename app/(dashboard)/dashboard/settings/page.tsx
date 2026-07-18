export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account, subscription, and preferences.
        </p>
      </div>

      <div className="space-y-8 max-w-2xl">
        {/* Profile */}
        <div className="rounded-lg border p-6">
          <h2 className="font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Jane Smith"
                className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <input
                type="email"
                defaultValue="jane@example.com"
                className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        {/* Plan */}
        <div className="rounded-lg border p-6">
          <h2 className="font-semibold mb-4">Subscription Plan</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Consumer Plan</p>
              <p className="text-sm text-muted-foreground">$19/month</p>
            </div>
            <button className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              Manage Plan
            </button>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="rounded-lg border p-6">
          <h2 className="font-semibold mb-4">Connected Accounts</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your financial accounts to let Bento analyze and save.
          </p>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
            Connect Account
          </button>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border p-6">
          <h2 className="font-semibold mb-4">Notifications</h2>
          <div className="space-y-3">
            {notifications.map((setting) => (
              <div
                key={setting.label}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{setting.label}</span>
                <button
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    setting.enabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                      setting.enabled ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const notifications = [
  { label: "Weekly savings report", enabled: true },
  { label: "Bill negotiation updates", enabled: true },
  { label: "Refund status changes", enabled: true },
  { label: "Warranty expiration reminders", enabled: true },
  { label: "Product updates and tips", enabled: false },
];
