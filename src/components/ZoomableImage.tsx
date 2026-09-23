import React, { useCallback, useEffect, useRef, useState } from "react";

interface ZoomableImageProps {
  src: string;
  alt: string;
}

export function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(s + 0.25, 4));
  }, []);
  const zoomOut = useCallback(() => {
    setScale((s) => {
      const next = Math.max(s - 0.25, 1);
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);
  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Native non-passive wheel listener so scrolling over the image zooms
  // the image instead of the page. React's synthetic onWheel is passive
  // at the document root and cannot preventDefault.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setScale((s) => {
        const next = Math.min(Math.max(s - Math.sign(e.deltaY) * 0.15, 1), 4);
        if (next === 1) setOffset({ x: 0, y: 0 });
        return next;
      });
    };
    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, []);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale === 1) return;
      dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y };
    },
    [scale, offset],
  );
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    setOffset({ x: drag.ox + (e.clientX - drag.startX), y: drag.oy + (e.clientY - drag.startY) });
  }, []);
  const endDrag = useCallback(() => {
    dragRef.current = null;
  }, []);

  return (
    <div
      style={{
        border: "1px solid var(--color-border-decorative)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        margin: "16px 0 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          background: "var(--color-surface-sunken)",
          borderBottom: "1px solid var(--color-border-decorative)",
        }}
      >
        <button
          type="button"
          onClick={zoomOut}
          disabled={scale <= 1}
          aria-label="Zoom out"
          style={buttonStyle(scale <= 1)}
        >
          −
        </button>
        <span style={{ fontSize: "0.8rem", minWidth: "3.5em", textAlign: "center" }}>
          {Math.round(scale * 100)}%
        </span>
        <button type="button" onClick={zoomIn} disabled={scale >= 4} aria-label="Zoom in" style={buttonStyle(scale >= 4)}>
          +
        </button>
        <button type="button" onClick={reset} aria-label="Reset zoom" style={buttonStyle(false)}>
          Reset
        </button>
      </div>
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        style={{
          overflow: "hidden",
          cursor: scale > 1 ? "grab" : "default",
          background: "var(--neutral-0, #fff)",
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            display: "block",
            width: "100%",
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "center",
            transition: dragRef.current ? "none" : "transform 0.15s ease-out",
            userSelect: "none",
          }}
        />
      </div>
    </div>
  );
}

function buttonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: "4px 12px",
    fontSize: "0.85rem",
    fontWeight: 700,
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--color-border-default)",
    background: disabled ? "var(--color-action-disabled-bg)" : "var(--color-surface-card)",
    color: disabled ? "var(--color-action-disabled-fg)" : "var(--color-text-primary)",
    cursor: disabled ? "not-allowed" : "pointer",
  };
}
