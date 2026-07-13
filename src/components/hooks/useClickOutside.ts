import { RefObject, useEffect } from "react";

const useClickOutside = (
  ref: RefObject<Element | null>,
  callback: () => void,
  excludeRefs: RefObject<Element | null>[] = [],
) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isInsideMain = ref.current?.contains(e.target as Node);
      const isInsideExcluded = excludeRefs.some((r) =>
        r.current?.contains(e.target as Node),
      );

      if (!isInsideMain && !isInsideExcluded) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback, excludeRefs]);
};

export default useClickOutside;
