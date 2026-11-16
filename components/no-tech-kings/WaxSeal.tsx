export function WaxSeal({
  className = "h-16 w-16 sm:h-20 sm:w-20",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <path
        d="M48 7c16 1 33 11 38 29 4 16-6 35-22 43C45 88 22 82 13 66 4 49 14 18 48 7Z"
        fill="#9c2a2e"
      />
      <path
        d="M48 11c14 1 29 10 33 26 3 14-6 31-20 38-16 8-34 2-41-13C13 47 21 20 48 11Z"
        fill="#b53236"
      />
      <circle
        cx="48"
        cy="50"
        r="27"
        fill="none"
        stroke="#fffdf5"
        strokeWidth="1.25"
        strokeDasharray="1.4 3.1"
        opacity="0.85"
      />
      <path d="M48 22 62 46 48 42 34 46Z" fill="#fffdf5" />
      <path d="M16 44 38 50 34 62 18 58Z" fill="#fffdf5" />
      <path d="M80 44 58 50 62 62 78 58Z" fill="#fffdf5" />
      <path d="M36 52h24l-4 16H40Z" fill="#fffdf5" />
    </svg>
  );
}
