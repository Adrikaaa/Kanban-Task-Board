import { CircleCheck, TriangleAlert, X } from "lucide-react";

const icons = {
  info: { Icon: CircleCheck, className: "text-success" },
  error: { Icon: TriangleAlert, className: "text-danger" },
};

// Jira-style flag, bottom left on desktop and bottom centre on phones. The live
// region is always rendered so screen readers announce new messages.
const Toast = ({ toast, onDismiss }) => {
  let { Icon, className } = icons[toast?.tone] ?? icons.info;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center md:inset-x-auto md:bottom-6 md:left-6"
    >
      {toast && (
        <div
          key={toast.id}
          role="status"
          className="animate-fade-up pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card bg-surface py-1.5 pr-1.5 pl-4 text-sm text-ink shadow-overlay"
        >
          <Icon size={20} aria-hidden="true" className={`mt-2.5 shrink-0 ${className}`} />
          <p className="flex-1 py-2.5 font-medium">{toast.message}</p>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss message"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-control text-ink-500 hover:bg-neutral hover:text-ink md:size-9"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Toast;
