interface LogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  className?: string;
}

export function Logo({ size = "md", showSubtitle = true, className = "" }: LogoProps) {
  const iconDimensions = {
    sm: "h-8 w-8",
    md: "h-9 w-9 sm:h-10 sm:w-10",
    lg: "h-11 w-11 sm:h-12 sm:w-12",
  }[size];

  const titleSize = {
    sm: "text-base",
    md: "text-base sm:text-lg",
    lg: "text-xl sm:text-2xl",
  }[size];

  const subtitleSize = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  }[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Handcrafted Emblem Logo */}
      <div className={`relative flex ${iconDimensions} shrink-0 items-center justify-center`}>
        {/* Ambient Glow */}
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 opacity-30 blur-[6px] transition-all duration-300 group-hover:opacity-50" />

        {/* Outer Hex-Shield Badge Container */}
        <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-b from-slate-900 via-blue-950 to-indigo-950 p-[1px] shadow-md shadow-blue-900/20 ring-1 ring-white/20">
          <div className="relative flex h-full w-full items-center justify-center rounded-[11px] bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-900">
            {/* Glossy top overlay */}
            <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-[11px] bg-gradient-to-b from-white/25 to-transparent" />
            
            {/* Custom Precision SVG Mark: Handcrafted Shield + GPS Radar Crosshair */}
            <svg
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
            >
              <defs>
                <linearGradient id="shieldGrad" x1="18" y1="3" x2="18" y2="33" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF" stopOpacity="0.95" />
                  <stop offset="1" stopColor="#E2E8F0" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="coreGrad" x1="18" y1="11" x2="18" y2="25" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38BDF8" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>

              {/* Handcrafted Outer Shield Outline */}
              <path
                d="M18 3.5L7.5 7.5V15.5C7.5 22.25 12 28.5 18 32.5C24 28.5 28.5 22.25 28.5 15.5V7.5L18 3.5Z"
                fill="none"
                stroke="url(#shieldGrad)"
                strokeWidth="2.25"
                strokeLinejoin="round"
              />

              {/* Inner Satellite Radar Ring */}
              <circle
                cx="18"
                cy="17"
                r="6.5"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="1.5"
                strokeDasharray="3 2"
                className="opacity-90"
              />

              {/* Crosshair Axes */}
              <path
                d="M18 8.5V11.5M18 22.5V25.5M9.5 17H12.5M23.5 17H26.5"
                stroke="#93C5FD"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Glowing GPS Pulse Core */}
              <circle cx="18" cy="17" r="3.25" fill="url(#coreGrad)" />
              <circle cx="18" cy="17" r="1.25" fill="#FFFFFF" />

              {/* Active Signal Wave Accent Dot */}
              <circle cx="26" cy="7.5" r="2" fill="#22C55E" />
              <circle cx="26" cy="7.5" r="3.5" fill="none" stroke="#4ADE80" strokeWidth="1" className="animate-ping opacity-75" />
            </svg>
          </div>
        </div>
      </div>

      {/* Handcrafted Typography & Branding */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1">
          <span className={`${titleSize} font-extrabold tracking-tight text-slate-900`}>
            Safe
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Track
            </span>
          </span>

          <span className="inline-flex items-center rounded-md bg-blue-50 px-1 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider text-blue-700 uppercase border border-blue-200/70 shadow-[0_1px_2px_rgba(37,99,235,0.08)]">
            PRO
          </span>
        </div>

        {showSubtitle && (
          <span className={`hidden sm:block ${subtitleSize} mt-1 font-medium text-slate-500 tracking-wide`}>
            GPS xavfsizlik monitoring tizimi
          </span>
        )}
      </div>
    </div>
  );
}
