export function MoneyOrb() {
  return (
    <svg viewBox="0 0 240 240" className="h-44 w-44 drop-shadow-[0_0_30px_rgba(126,249,169,0.6)] md:h-56 md:w-56">
      <defs>
        <radialGradient id="g" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#d3ffdf" />
          <stop offset="45%" stopColor="#71ec9e" />
          <stop offset="100%" stopColor="#1f9d55" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="100" fill="url(#g)" stroke="#b8ffd0" strokeWidth="5" />
      <path d="M80 125c8 20 24 30 45 30 22 0 36-10 36-24 0-15-10-20-34-25l-14-3c-24-5-36-17-36-37 0-23 19-40 47-43V10h14v13c20 2 35 12 44 28l-20 12c-7-12-18-18-32-18-16 0-28 9-28 21 0 12 9 19 29 23l14 3c27 6 41 18 41 40 0 25-19 43-48 47v14h-14v-14c-25-3-42-16-51-38l21-12Z" fill="#065f46" />
      <circle cx="78" cy="72" r="12" fill="#ffffff88" />
    </svg>
  );
}
