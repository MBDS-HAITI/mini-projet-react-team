// src/components/common/Loading.jsx

export default function Loading({
  title = "Chargement...",
  subtitle = "Merci de patienter quelques secondes.",
  fullScreen = false,
}) {
  const Wrapper = ({ children }) =>
    fullScreen ? (
      <div className="min-h-[620px] w-full flex items-center justify-center px-4">
        {children}
      </div>
    ) : (
      <div className="w-full flex items-center justify-center py-10 px-4">
        {children}
      </div>
    );

  return (
    <Wrapper>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#140524]/70 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <div className="p-6">
          <div className="flex items-center gap-4">
            {/* Spinner neon */}
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderLeftColor: "#ea00ff", borderBottomColor: "#03d5ff", borderRightColor: "rgba(255,255,255,0.18)" }}
              />
              <div className="absolute inset-2 rounded-full bg-white/5" />
            </div>

            <div className="flex-1">
              <p
                className="text-lg font-bold tracking-wide"
                style={{
                  backgroundImage:
                    "linear-gradient(40deg, #ea00ff, #ea00ff, #03d5ff, #03d5ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.45))",
                }}
              >
                {title}
              </p>
              <p className="text-sm text-[#8964b0]">{subtitle}</p>
            </div>
          </div>

          {/* barre de progression "glow" */}
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full w-1/3 animate-[loading_1.1s_ease-in-out_infinite]"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(234,0,255,0.95), rgba(3,213,255,0.95))",
                boxShadow:
                  "0 0 18px rgba(234,0,255,0.35), 0 0 18px rgba(3,213,255,0.25)",
              }}
            />
          </div>
        </div>
      </div>

      {/* animation keyframes (Tailwind custom via arbitraire) */}
      <style>{`
        @keyframes loading {
          0%   { transform: translateX(-40%); opacity: .65; }
          50%  { transform: translateX(120%); opacity: 1; }
          100% { transform: translateX(260%); opacity: .65; }
        }
      `}</style>
    </Wrapper>
  );
}
