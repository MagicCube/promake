import { useCallback, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

import { cn } from "@/lib/utils";

export function Scrubber({
  className,
  children: childrenProp,
  defaultIndex,
  ...props
}: React.ComponentProps<"div"> & { defaultIndex?: number }) {
  const [hoverIndex, setHoverIndex] = useState(defaultIndex ?? 0);
  const [debouncedHoverIndex] = useDebounce(hoverIndex, 100);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const children = useMemo(() => {
    if (Array.isArray(childrenProp)) {
      return childrenProp;
    }
    return [childrenProp];
  }, [childrenProp]);
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (children.length < 1) return;
      if (!isHovered) return;
      if (!containerRef.current) return;
      const x =
        event.clientX - containerRef.current.getBoundingClientRect().left;
      const index = Math.round(
        (x / containerRef.current.clientWidth) * (children.length - 1),
      );
      setHoverIndex(index);
    },
    [children.length, isHovered],
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleMouseEnter = useCallback(() => {
    if (children.length < 1) return;
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 800);
  }, [children.length]);
  const handleMouseLeave = useCallback(() => {
    if (children.length < 1) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(false);
    setHoverIndex(defaultIndex ?? 0);
  }, [children.length, defaultIndex]);
  return (
    <div
      className={cn("group/scrubber relative size-full", className)}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children.map((child, index) => {
        const className = debouncedHoverIndex === index ? "block" : "hidden";
        return (
          <div key={`${index}`} className={cn(className, "size-full")}>
            {child}
          </div>
        );
      })}
      {children.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 top-4 flex items-center pl-4">
          <div className="flex items-center gap-1 opacity-0 transition-opacity delay-600 duration-200 group-hover/scrubber:opacity-100">
            {children.map((_, index) => (
              <div
                key={`${index}`}
                className={cn(
                  "size-1 bg-white/40 shadow-md transition-all duration-200 ease-out",
                  debouncedHoverIndex === index
                    ? "h-1 w-2.5 rounded-sm bg-white/85"
                    : "rounded-full",
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
