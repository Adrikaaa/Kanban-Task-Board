import { useEffect, useRef } from "react";

let isTyping = (el) =>
  el instanceof HTMLElement &&
  (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

// Single-key shortcut ("c", "/") that is ignored while typing or while a dialog is open.
export let useShortcut = (key, handler) => {
  let handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    let onKeyDown = (e) => {
      if (e.key !== key || e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTyping(document.activeElement)) return;
      if (document.querySelector("dialog[open]")) return;
      e.preventDefault();
      handlerRef.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key]);
};
