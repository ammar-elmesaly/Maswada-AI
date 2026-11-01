import { useCallback, useEffect, useRef, useState } from "react";

export type AutosaveStatus = "saved" | "dirty" | "saving" | "error";

export function useAutosave<T extends object>(
  save: (patch: Partial<T>) => Promise<unknown>,
  delay = 1500,
) {
  const pending = useRef<Partial<T>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queueTail = useRef<Promise<void>>(Promise.resolve());
  const saveRef = useRef(save);
  const [status, setStatus] = useState<AutosaveStatus>("saved");

  // Always call the latest `save` without making `flush` change identity.
  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  const hasPending = useCallback(() => Object.keys(pending.current).length > 0, []);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  /** Save everything buffered now. Resolves when this save attempt finishes. */
  const flush = useCallback((): Promise<void> => {
    clearTimer();

    // Chain onto the previous save so requests run strictly one after another.
    queueTail.current = queueTail.current.then(async () => {
      if (!hasPending()) return;

      // Take the buffer and clear it, so keystrokes made during the request
      // land in a fresh buffer instead of being lost.
      const patch = pending.current;
      pending.current = {};
      setStatus("saving");

      try {
        await saveRef.current(patch);
        setStatus(hasPending() ? "dirty" : "saved");
      } catch {
        // Put the failed patch back; newer edits take priority.
        pending.current = { ...patch, ...pending.current };
        setStatus("error");
      }
    });

    return queueTail.current;
  }, [hasPending]);

  /** Buffer a change and (re)start the debounce timer. */
  const queue = useCallback(
    (patch: Partial<T>) => {
      pending.current = { ...pending.current, ...patch };
      setStatus("dirty");
      clearTimer();
      timer.current = setTimeout(() => void flush(), delay);
    },
    [flush, delay],
  );

  /** Drop anything buffered (e.g. the note is being deleted). */
  const discard = useCallback(() => {
    clearTimer();
    pending.current = {};
    setStatus("saved");
  }, []);

  // Flush on unmount (navigating away, "Back" button, route change).
  useEffect(() => {
    return () => {
      void flush();
    };
  }, [flush]);

  // Flush when the tab is hidden; warn if the user closes with unsaved data.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") void flush();
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasPending() || status === "saving") e.preventDefault();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [flush, hasPending, status]);

  return { queue, flush, discard, hasPending, status };
}