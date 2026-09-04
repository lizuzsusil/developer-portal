import React from "react";

export type PhIconWeight = "thin" | "light" | "regular" | "bold" | "fill";

interface PhIconProps {
  /** Icon name without the `ph-` prefix, e.g. `arrow-right`, `lock-key`. */
  name: string;
  /** v1 icon fonts ship one codepoint per weight; base class is regular. */
  weight?: PhIconWeight;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

/**
 * Phosphor Icons (v1 icon font) wrapper. Decorative by default
 * (`aria-hidden`); pass `title` to expose it to assistive tech.
 * Inherits surrounding font-size and color.
 *
 * NOTE: only the `bold` glyphs listed in `src/css/custom.css` are bundled
 * (subset font in `static/fonts`). Other weights/names render blank until
 * added to the subset - see the comment in custom.css.
 */
export function PhIcon({
  name,
  weight = "bold",
  className,
  style,
  title,
}: PhIconProps) {
  const cls =
    weight === "regular" ? `ph-${name}` : `ph-${name}-${weight}`;
  return (
    <i
      aria-hidden={title ? undefined : true}
      className={className ? `${cls} ${className}` : cls}
      style={style}
      title={title}
    />
  );
}
