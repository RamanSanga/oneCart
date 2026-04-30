import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export const toastContext = createContext(null);

const DEFAULT_DURATION = 3200;
const MAX_TOASTS = 3;

const toastToneStyles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  error: "border-rose-200 bg-rose-50 text-rose-950",
  info: "border-slate-200 bg-white text-slate-950",
};

function normalizeToast(input, fallbackType = "info") {
  if (typeof input === "string") {
    return {
      title: input,
      message: "",
      type: fallbackType,
    };
  }

  return {
    title: input?.title || "",
    message: input?.message || "",
    type: input?.type || fallbackType,
    duration: input?.duration ?? DEFAULT_DURATION,
    dedupeKey: input?.dedupeKey || "",
    actions: Array.isArray(input?.actions) ? input.actions : [],
  };
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());
  const recentKeysRef = useRef(new Map());
  const sequenceRef = useRef(1);

  const dismissToast = useCallback((toastId) => {
    const timeoutId = timersRef.current.get(toastId);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timersRef.current.delete(toastId);
    }

    setToasts((current) => current.filter((toast) => toast.id !== toastId));
  }, []);

  const pushToast = useCallback(
    (input, fallbackType = "info") => {
      const toast = normalizeToast(input, fallbackType);
      const now = Date.now();

      if (toast.dedupeKey) {
        const lastShownAt = recentKeysRef.current.get(toast.dedupeKey);
        if (lastShownAt && now - lastShownAt < 1200) {
          return null;
        }
        recentKeysRef.current.set(toast.dedupeKey, now);
      }

      const id = sequenceRef.current++;
      const duration = toast.duration ?? DEFAULT_DURATION;

      setToasts((current) => {
        const next = [...current, { ...toast, id }];
        return next.slice(-MAX_TOASTS);
      });

      if (duration > 0) {
        const timeoutId = window.setTimeout(() => {
          dismissToast(id);
        }, duration);

        timersRef.current.set(id, timeoutId);
      }

      return id;
    },
    [dismissToast]
  );

  const api = useMemo(
    () => ({
      pushToast,
      success: (input) => pushToast(input, "success"),
      error: (input) => pushToast(input, "error"),
      info: (input) => pushToast(input, "info"),
      dismissToast,
      clearToasts: () => {
        for (const timeoutId of timersRef.current.values()) {
          window.clearTimeout(timeoutId);
        }
        timersRef.current.clear();
        setToasts([]);
      },
    }),
    [dismissToast, pushToast]
  );

  return (
    <toastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </toastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(toastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed right-4 top-4 z-120 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6 sm:w-full"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onDismiss }) {
  const toneClass = toastToneStyles[toast.type] || toastToneStyles.info;

  return (
    <div
      className={`pointer-events-auto rounded-2xl border shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl ${toneClass}`}
    >
      <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
        <div className="min-w-0 flex-1">
          {toast.title && (
            <p className="text-sm font-medium tracking-wide">{toast.title}</p>
          )}

          {toast.message && (
            <p className="mt-1 text-sm leading-6 text-slate-600">{toast.message}</p>
          )}

          {toast.actions?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {toast.actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => {
                    action.onClick?.();
                    onDismiss(toast.id);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium tracking-wide transition ${
                    action.variant === "primary"
                      ? "border-black bg-black text-white hover:opacity-90"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Dismiss toast"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
