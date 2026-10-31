import { useEffect, useRef } from "react";

const sizes = {
  sm: "md:max-w-md",
  lg: "md:max-w-2xl",
};

// Wraps the native <dialog>, which provides focus trapping, Escape to close
// and an inert background. Centred on desktop, a bottom sheet on phones.
// `initialFocusRef` is focused once the dialog opens; focus returns to the
// element that opened it when it closes.
const Modal = ({ open, onClose, labelledBy, size = "sm", initialFocusRef, children }) => {
  let ref = useRef(null);
  let returnFocusRef = useRef(null);

  useEffect(() => {
    let dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement;
      dialog.showModal();
      initialFocusRef?.current?.focus();
    }
    if (!open && dialog.open) {
      dialog.close();
      let previous = returnFocusRef.current;
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    }

    if (!open) return;
    let root = document.documentElement;
    let overflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = overflow;
    };
  }, [open, initialFocusRef]);

  let handleClose = () => {
    if (open) onClose();
  };

  // Escape is handled here so React state, not the browser, decides when to close.
  let handleCancel = (e) => {
    e.preventDefault();
    onClose();
  };

  // A pointer-down whose target is the <dialog> itself landed on the backdrop.
  let handlePointerDown = (e) => {
    if (e.target === ref.current) onClose();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={handleClose}
      onCancel={handleCancel}
      onPointerDown={handlePointerDown}
      className={`mx-0 mt-auto mb-0 max-h-[92dvh] w-full max-w-none rounded-t-dialog bg-surface p-0 text-ink shadow-overlay md:m-auto md:max-h-[calc(100dvh-4rem)] md:w-[calc(100%-2rem)] md:rounded-dialog ${sizes[size]}`}
    >
      {open && <div className="animate-pop-in">{children}</div>}
    </dialog>
  );
};

export default Modal;
