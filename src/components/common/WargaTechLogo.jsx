import logoImg from "@/assets/logo_app.png";

export function WargaTechLogoMark({ className = "w-8 h-8" }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d="M18 3C9.716 3 3 9.716 3 18C3 26.284 9.716 33 18 33C26.284 33 33 26.284 33 18C33 11.5 28 3 18 3Z"
          fill="url(#wargatech-orange-grad)"
        />
        <path
          d="M18 7C18 7 28 14 26 24C24 20 20 17 14 17C14 17 21 17 23 21C21 14 18 7 18 7Z"
          fill="#FFFFFF"
          fillOpacity="0.95"
        />
        <defs>
          <linearGradient id="wargatech-orange-grad" x1="3" y1="3" x2="33" y2="33" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f97316" />
            <stop offset="1" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function WargaTechLogo({ size = "md", showSubtitle = false, subtitleText = "Solusi Keberlanjutan Kota Anda" }) {
  const isLarge = size === "lg";
  const isSmall = size === "sm";

  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center justify-center gap-2.5">
        <WargaTechLogoMark className={isLarge ? "w-10 h-10" : isSmall ? "w-7 h-7" : "w-8 h-8"} />
        <span className={`font-black tracking-tight text-orange-500 ${isLarge ? "text-3xl sm:text-4xl" : isSmall ? "text-xl" : "text-2xl sm:text-3xl"}`}>
          WargaTech
        </span>
      </div>
      {showSubtitle && (
        <p className="text-xs sm:text-sm font-medium text-gray-600 mt-1.5">
          {subtitleText}
        </p>
      )}
    </div>
  );
}
