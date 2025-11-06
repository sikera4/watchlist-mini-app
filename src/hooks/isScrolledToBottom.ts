import { useEffect, useState } from "react";

type UseIsScrolledToBottomOptions = {
  offset?: number; // How close to the bottom before counting as "scrolled to bottom"
};

/**
 * Hook to track whether a scrollable element (or window) is scrolled to the bottom.
 *
 * @param ref - A React ref to the scrollable container. If omitted, uses window scrolling.
 * @param options - Optional offset to trigger "bottom" slightly before reaching it.
 * @returns boolean indicating whether it's scrolled to the bottom.
 */
export function useIsScrolledToBottom(
  ref?: React.RefObject<HTMLElement>,
  options: UseIsScrolledToBottomOptions = {},
): boolean {
  const { offset = 0 } = options;
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let atBottom = false;

      if (ref?.current) {
        const { scrollTop, scrollHeight, clientHeight } = ref.current;
        atBottom = scrollHeight - scrollTop - clientHeight <= offset;
      } else {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        atBottom = docHeight - (scrollTop + windowHeight) <= offset;
      }

      setIsAtBottom(atBottom);
    };

    const scrollElement = ref?.current ?? window;
    scrollElement.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize state

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [ref, offset]);

  return isAtBottom;
}
