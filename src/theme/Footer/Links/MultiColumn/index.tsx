import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {ThemeClassNames} from '@docusaurus/theme-common';
import LinkItem from '@theme/Footer/LinkItem';
import type {Props} from '@theme/Footer/Links/MultiColumn';

import styles from './styles.module.css';

type ColumnType = Props['columns'][number];
type ColumnItemType = ColumnType['items'][number];

function ColumnLinkItem({item}: {item: ColumnItemType}) {
  return item.html ? (
    <li
      className={clsx('footer__item', item.className)}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: item.html}}
    />
  ) : (
    <li key={item.href ?? item.to} className="footer__item">
      <LinkItem item={item} />
    </li>
  );
}

function Column({column}: {column: ColumnType}) {
  return (
    <div
      className={clsx(
        ThemeClassNames.layout.footer.column,
        'col footer__col',
        column.className,
      )}>
      <div className="footer__title">{column.title}</div>
      <ul className="footer__items clean-list">
        {column.items.map((item, i) => (
          <ColumnLinkItem key={i} item={item} />
        ))}
      </ul>
    </div>
  );
}

function BrandColumn(): ReactNode {
  const {
    siteConfig: {title},
  } = useDocusaurusContext();
  const logoSrc = useBaseUrl('/img/sewa-logo.svg');
  return (
    <div className={clsx('col footer__col', styles.brand)}>
      <Link to="/" className={styles.brandLink} aria-label={title}>
        <img
          src={logoSrc}
          alt=""
          aria-hidden
          height={50}
          className={styles.brandLogo}
        />
        <span className={styles.brandTitle}>{title}</span>
      </Link>
    </div>
  );
}

export default function FooterLinksMultiColumn({columns}: Props): ReactNode {
  return (
    <div className={clsx('row footer__links', styles.footerLinks)}>
      <BrandColumn />
      {columns.map((column, i) => (
        <Column key={i} column={column} />
      ))}
    </div>
  );
}
