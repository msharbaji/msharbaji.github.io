import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-4 font-display text-3xl font-700 tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-accent px-6 py-3 font-mono text-xs font-medium uppercase tracking-widest text-background transition-colors hover:bg-accent-hover"
      >
        Go home
      </Link>
    </div>
  );
}
