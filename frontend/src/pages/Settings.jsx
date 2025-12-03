import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

function Settings() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">
            Choose a theme for Chatty!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {THEMES.map((t) => (
            <div key={t} data-theme={t} className="contents">
              <button
                className={`
                  group flex flex-col items-center gap-2 p-4 rounded-xl transition-all
                  border-2 ${
                    theme === t
                      ? "border-primary"
                      : "border-base-300 hover:border-base-content/20"
                  }
                  ${
                    theme === t
                      ? "bg-base-100 shadow-lg"
                      : "bg-base-100/50 hover:bg-base-100"
                  }
                  hover:scale-105 active:scale-95
                `}
                onClick={() => setTheme(t)}
              >
                <div className="relative w-full h-16 rounded-lg overflow-hidden shadow-inner">
                  {/* Color palette squares */}
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>

                {/* dots and lines */}
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

        {/* preview section */}

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Preview</h2>
          <p className="text-sm text-base-content/70">
            See how your theme looks like
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
