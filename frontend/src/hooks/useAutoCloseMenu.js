import { useEffect, useRef } from "react";

export function useAutoCloseMenu(isOpen, onClose, dependencies) {
  const prevDepsRef = useRef(dependencies);

  useEffect(() => {
    const hasChanged = dependencies.some(
      (dep, index) => dep !== prevDepsRef.current[index]
    );

    if (isOpen && hasChanged) {
      setTimeout(() => {
        onClose();
      }, 0);
    }

    prevDepsRef.current = dependencies;
  }, [isOpen, onClose, dependencies]);
}
