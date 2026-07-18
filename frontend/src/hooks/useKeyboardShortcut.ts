import { useEffect, useCallback } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; shift?: boolean; meta?: boolean } = {},
) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== key) return;
      if (modifiers.ctrl && !e.ctrlKey) return;
      if (modifiers.shift && !e.shiftKey) return;
      if (modifiers.meta && !e.metaKey) return;
      e.preventDefault();
      callback();
    },
    [key, callback, modifiers],
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
