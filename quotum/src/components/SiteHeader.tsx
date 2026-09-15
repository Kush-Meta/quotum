import Link from "next/link";

const links = [
  { href: "/studio", label: "Studio" },
  { href: "/pilot", label: "Results" },
  { href: "/publish", label: "Publish Surface" },
  { href: "/spec", label: "Spec" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-signal text-ink font-display text-lg font-bold">
            Q
          </span>
          <div>
            <div className="font-display text-xl leading-none tracking-tight text-paper">
              Quotum
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted">
              Answer Contracts
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-fog/80 transition hover:text-signal"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/pilot"
          className="rounded-full bg-signal px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110"
        >
          View results
        </Link>
      </div>
    </header>
  );
}
