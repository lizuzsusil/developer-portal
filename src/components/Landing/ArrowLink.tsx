import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import { PhIcon } from "../PhIcon";

interface ArrowLinkProps {
  to: string;
  id: string;
  description: string;
  className?: string;
  children: string;
}

/**
 * Section header / card CTA link with a trailing Phosphor arrow.
 * The arrow travels via Translate `values` so translators can reposition it.
 */
export function ArrowLink({
  to,
  id,
  description,
  className,
  children,
}: ArrowLinkProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1.5 ${className ?? ""}`}
    >
      <Translate id={id} description={description} values={{ arrow: <PhIcon name="arrow-right" /> }}>
        {children}
      </Translate>
    </Link>
  );
}
