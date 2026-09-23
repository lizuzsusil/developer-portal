import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import type {Props} from '@theme/Footer/Layout';
import styles from "@site/src/theme/Footer/Links/MultiColumn/styles.module.css";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function FooterLayout({style, links}: Props): ReactNode {
    const logoSrc = useBaseUrl('/img/footerGlow.png');
  return (
    <footer
      className={clsx(ThemeClassNames.layout.footer.container, 'lg:pt-15 lg:pb-30 py-8 relative', {
        'footer--dark': style === 'dark',
      })}>
      <div className="container container-fluid">{links}</div>
        <img
            src={logoSrc}
            alt=""
            aria-hidden
            className="absolute bottom-0 left-0 w-full select-none pointer-events-none"
        />
    </footer>
  );
}
