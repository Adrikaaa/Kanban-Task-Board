const tones = {
  subtle: "text-ink-700 hover:bg-neutral-hover hover:text-ink",
  default: "bg-neutral text-ink-700 hover:bg-neutral-hover hover:text-ink",
  // Sits on a white card.
  card: "bg-surface text-ink-700 shadow-card hover:bg-neutral",
};

// 32px on desktop, 44px on touch-sized screens. `label` is required for screen readers.
const IconButton = ({ label, icon, tone = "subtle", className = "", ...props }) => {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-control transition-colors md:size-8 ${tones[tone]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
