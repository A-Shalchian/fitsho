import Link from "next/link";

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="grid-background grid-background-animated" />

      <header className="relative z-10 border-b border-[var(--border)]">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">fitsho</span>
          <div className="flex items-center gap-6">
            <Link
              href="/sign-in"
              className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm px-4 py-2 bg-[var(--foreground)] text-[var(--background)] font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center -mt-20">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight animate-fade-in">
            Track your lifts
          </h1>
          <p className="mt-6 text-lg text-[var(--foreground-muted)] max-w-md mx-auto animate-fade-in-delay">
            Simple workout tracking. No fluff, no subscriptions, no nonsense.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-2">
            <Link
              href="/sign-up"
              className="px-8 py-3 bg-[var(--foreground)] text-[var(--background)] text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              Start tracking free
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-3 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              I have an account
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="text-sm text-[var(--foreground-muted)]">fitsho</span>
          <span className="text-sm text-[var(--foreground-muted)]">Track. Lift. Repeat.</span>
        </div>
      </footer>
    </div>
  );
}
