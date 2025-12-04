import { THEMES } from "../constants";
import { useThemeStore } from "../hooks/useThemeStore";
import { useState, useRef, useEffect } from "react";
import Preview from "../components/Preview";

function Settings() {
  const { theme, setTheme } = useThemeStore();
  const [isShowing, setIsShowing] = useState(false);
  const previewRef = useRef(null);
  const gridRef = useRef(null);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);

  // Efecto para scroll automático cuando se muestra el preview
  useEffect(() => {
    if (isShowing && previewRef.current) {
      // Esperar a que la animación de altura se complete
      setTimeout(() => {
        previewRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 400);
    } else if (!isShowing && gridRef.current) {
      setTimeout(() => {
        gridRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [isShowing]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isShowing) {
        setIsShowing(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isShowing]);

  const togglePreview = () => {
    setIsShowing(!isShowing);
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen container mx-auto px-4 pt-20 max-w-5xl pb-20 relative ${
        isShowing ? "overflow-hidden" : ""
      }`}
    >
      {/* Overlay que deshabilita la interacción con el grid */}
      {isShowing && (
        <div
          className="fixed inset-0 bg-base-100/80 backdrop-blur-sm z-20 transition-opacity duration-500"
          onClick={() => setIsShowing(false)}
        />
      )}

      <div
        className={`relative z-10 transition-all duration-500 ${
          isShowing ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">Theme Settings</h2>
            <p className="text-sm text-base-content/70">
              Choose a theme for Chatty! Click "Show Preview" to see it in
              action.
            </p>
          </div>

          {/* Theme Grid with Animation */}
          <div
            ref={gridRef}
            className={`
              transition-all duration-500 ease-in-out
              ${isShowing ? "max-h-[400px]" : ""}
            `}
          >
            <div
              className={`
                grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 
                gap-4 transition-all duration-500 ease-in-out
                ${isShowing ? "scale-95 opacity-50" : "scale-100 opacity-100"}
              `}
            >
              {THEMES.map((t) => (
                <div key={t} data-theme={t} className="contents">
                  <button
                    className={`
                      group flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300
                      border-2 ${
                        theme === t
                          ? "border-primary shadow-lg"
                          : "border-base-300 hover:border-base-content/20"
                      }
                      ${
                        theme === t
                          ? "bg-base-100 shadow-lg"
                          : "bg-base-100/50 hover:bg-base-100"
                      }
                      hover:scale-105 active:scale-95
                      ${isShowing ? "transform-gpu" : ""}
                      ${isShowing ? "cursor-not-allowed" : ""}
                    `}
                    onClick={() => !isShowing && setTheme(t)}
                    disabled={isShowing}
                  >
                    <div className="relative w-full h-16 rounded-lg overflow-hidden shadow-inner">
                      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 p-1">
                        <div className="rounded bg-primary"></div>
                        <div className="rounded bg-secondary"></div>
                        <div className="rounded bg-accent"></div>
                        <div className="rounded bg-neutral"></div>
                      </div>
                    </div>

                    <div className="w-full space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-primary"></div>
                        <div className="h-1 flex-1 rounded-full bg-secondary"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 rounded-full bg-accent"></div>
                        <div className="size-2 rounded-full bg-neutral"></div>
                      </div>
                    </div>

                    <span className="text-xs font-medium truncate w-full text-center mt-1">
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section - Ahora en posición fixed para superponerse */}
      <div
        ref={previewRef}
        className={`
          fixed left-1/2 transform -translate-x-1/2 z-30
          w-full max-w-5xl px-4
          transition-all duration-500 ease-in-out
          ${
            isShowing
              ? "opacity-100 translate-y-0 top-20"
              : "opacity-0 -translate-y-10 top-full pointer-events-none"
          }
        `}
      >
        <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden">
          <div className="p-6">
            <Preview />
          </div>
          <div className="p-4 bg-base-200 border-t border-base-300 text-center">
            <button
              onClick={togglePreview}
              className="btn btn-ghost btn-sm text-base-content/70"
            >
              Click anywhere outside or press ESC to close
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Button Container */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <div className="relative">
          <div className="rounded-full shadow-2xl overflow-hidden">
            <button
              ref={buttonRef}
              className="btn btn-primary btn-lg rounded-full px-8 gap-2 transition-all duration-300 hover:scale-105 active:scale-95 border-0"
              onClick={togglePreview}
            >
              <span className="font-semibold">
                {isShowing ? "Hide Preview" : "Show Preview"}
              </span>
              <span
                className={`
                  inline-flex items-center justify-center transition-transform duration-500 ease-in-out
                  ${isShowing ? "rotate-180" : "rotate-0"}
                  size-5
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
