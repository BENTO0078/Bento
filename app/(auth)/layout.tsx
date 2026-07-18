import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel: auth form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Bento logo */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-xl mb-8"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
              B
            </div>
            <span>Bento</span>
          </Link>
          {children}
        </div>
      </div>

      {/* Right panel: brand artwork */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-md text-white">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                <span className="flex h-2 w-2 rounded-full bg-emerald-300" />
                AI-powered savings
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">
                Save money while you sleep
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                The average Bento customer saves $1,200/year with zero ongoing
                effort. Your AI life admin is ready.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                  <div className="text-2xl font-bold">$1,200</div>
                  <div className="text-sm text-white/70">
                    Avg. yearly savings
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                  <div className="text-2xl font-bold">10 min</div>
                  <div className="text-sm text-white/70">
                    Setup — then autopilot
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
