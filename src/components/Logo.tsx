export default function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rounded square container */}
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="8"
        className="fill-accent/10 stroke-accent/40"
        strokeWidth="1.5"
      />
      {/* M letter */}
      <path
        d="M9 29V13l6 10 6-10v16"
        className="stroke-accent"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* A letter - integrated */}
      <path
        d="M23 29l5-16 5 16M25 24h6"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
