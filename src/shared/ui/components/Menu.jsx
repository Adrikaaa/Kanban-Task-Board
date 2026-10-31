import { Check } from "lucide-react";
import { createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

let MenuContext = createContext(null);

const GAP = 4;
const ITEMS = '[role^="menuitem"]:not([disabled])';

// Dropdown menu. It is positioned `fixed` from the trigger's rect so scrolling
// columns never clip it, and flips above the trigger when there is no room below.
// `button` renders the trigger and receives the props (including `ref`) it must spread.
const Menu = ({ button, align = "start", className = "w-56", children }) => {
  let [open, setOpen] = useState(false);
  let [position, setPosition] = useState(null);
  let rootRef = useRef(null);
  let buttonRef = useRef(null);
  let listRef = useRef(null);
  let id = useId();

  let close = (refocus = true) => {
    setOpen(false);
    setPosition(null);
    if (refocus) buttonRef.current?.focus();
  };

  useLayoutEffect(() => {
    if (!open) return;
    let rect = buttonRef.current.getBoundingClientRect();
    let menu = listRef.current.getBoundingClientRect();
    let top = rect.bottom + GAP;
    if (top + menu.height > window.innerHeight - 8 && rect.top - GAP - menu.height > 8) {
      top = rect.top - GAP - menu.height;
    }
    let left = align === "end" ? rect.right - menu.width : rect.left;
    left = Math.min(Math.max(8, left), window.innerWidth - menu.width - 8);
    setPosition({ top, left });
  }, [open, align]);

  useEffect(() => {
    if (!open || !position) return;
    listRef.current?.querySelector(ITEMS)?.focus();

    let onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) close(false);
    };
    // The trigger may scroll away, so the menu closes rather than float in the wrong place.
    let onScroll = (e) => {
      if (!listRef.current?.contains(e.target)) close(false);
    };
    let onResize = () => close(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, position]);

  let handleKeyDown = (e) => {
    let items = [...listRef.current.querySelectorAll(ITEMS)];
    let index = items.indexOf(document.activeElement);
    let focusAt = (i) => items[(i + items.length) % items.length]?.focus();

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusAt(index + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusAt(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusAt(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusAt(items.length - 1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === "Tab") {
      close(false);
    }
  };

  let toggle = (e) => {
    e.stopPropagation();
    if (open) close();
    else setOpen(true);
  };

  return (
    <div ref={rootRef} className="relative">
      {button({
        ref: buttonRef,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? id : undefined,
        onClick: toggle,
        onKeyDown: (e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        },
      })}
      {open && (
        <div
          id={id}
          ref={listRef}
          role="menu"
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          style={position ?? { top: 0, left: 0, visibility: "hidden" }}
          className={`animate-pop-in fixed z-40 max-h-[min(70dvh,420px)] overflow-y-auto rounded-card bg-surface py-1.5 text-sm text-ink shadow-overlay ${className}`}
        >
          <MenuContext.Provider value={close}>{children}</MenuContext.Provider>
        </div>
      )}
    </div>
  );
};

const tones = {
  default: "text-ink",
  danger: "text-danger-text",
};

// `checked` turns the item into a radio option (used by filter menus).
export const MenuItem = ({ onSelect, icon, checked, tone = "default", children }) => {
  let close = useContext(MenuContext);
  let isRadio = checked !== undefined;

  return (
    <button
      type="button"
      role={isRadio ? "menuitemradio" : "menuitem"}
      aria-checked={isRadio ? checked : undefined}
      tabIndex={-1}
      onClick={() => {
        close();
        onSelect();
      }}
      className={`flex min-h-11 w-full items-center gap-2.5 border-l-2 px-3 text-left hover:bg-surface-hover focus-visible:bg-surface-hover focus-visible:shadow-none md:min-h-9 ${
        checked ? "border-brand bg-brand-subtle/60" : "border-transparent focus-visible:border-brand"
      } ${tones[tone]}`}
    >
      {icon}
      <span className="flex-1">{children}</span>
      {checked && <Check size={16} aria-hidden="true" className="text-brand" />}
    </button>
  );
};

export const MenuLabel = ({ children }) => (
  <p className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
    {children}
  </p>
);

export const MenuDivider = () => <hr role="separator" className="my-1.5 border-line" />;

export default Menu;
