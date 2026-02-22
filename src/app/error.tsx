"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-display text-3xl font-700 tracking-tight">Something went wrong</h1>
      <p className="mt-4 text-muted">An unexpected error occurred.</p>
      <button
        onClick={reset}
        className="mt-8 rounded-lg bg-accent px-6 py-3 font-mono text-xs font-medium uppercase tracking-widest text-background transition-colors hover:bg-accent-hover"
      >
        Try again
      </button>
    </div>
  );
}
