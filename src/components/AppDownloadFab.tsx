import { useEffect, useRef, useState } from "react";
import { Smartphone, X } from "lucide-react";

const ANDROID_URL =
  import.meta.env.VITE_ANDROID_APP_URL?.trim() ||
  "https://play.google.com/store/search?q=AgriSense&c=apps";
const IOS_URL =
  import.meta.env.VITE_IOS_APP_URL?.trim() ||
  "https://apps.apple.com/search?term=AgriSense";

/** Small download shortcut for the mobile app (Soil Detects lives there). */
const AppDownloadFab = () => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-56 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Mobile app</p>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mb-3 text-xs text-gray-500">
            Soil Detects and field capture are on the phone app.
          </p>
          <div className="flex flex-col gap-1.5">
            <a
              href={ANDROID_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-[#2C6E49] px-3 py-2 text-center text-sm font-medium text-white hover:bg-[#245a3c]"
            >
              Android
            </a>
            <a
              href={IOS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-center text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              iPhone
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close app download" : "Open app download"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2C6E49] text-white shadow-md hover:bg-[#245a3c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C6E49] focus-visible:ring-offset-2"
      >
        {open ? <X className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default AppDownloadFab;
