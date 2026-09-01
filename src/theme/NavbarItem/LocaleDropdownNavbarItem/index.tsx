import React, {type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {translate} from '@docusaurus/Translate';
import {mergeSearchStrings, useHistorySelector} from '@docusaurus/theme-common';
import {useLocation} from '@docusaurus/router';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import IconLanguage from '@theme/Icon/Language';
import type {LinkLikeNavbarItemProps} from '@theme/NavbarItem';
import type {Props} from '@theme/NavbarItem/LocaleDropdownNavbarItem';

import styles from './styles.module.css';

function getLocaleBaseUrl(locale: string, defaultLocale: string): string {
  return locale === defaultLocale ? '/' : `/${locale}/`;
}

/**
 * Swizzled to fix Docusaurus issue #9170.
 *
 * Uses locale name to derive base URLs (not localeConfigs.baseUrl or
 * siteConfig.baseUrl which cause stacking). Uses the pathname:// protocol
 * so Link renders a plain <a> tag, bypassing React Router's basename.
 */
function useLocaleDropdownUtils() {
  const {
    siteConfig,
    i18n: {currentLocale, defaultLocale},
  } = useDocusaurusContext();
  const {pathname} = useLocation();
  const search = useHistorySelector((history) => history.location.search);
  const hash = useHistorySelector((history) => history.location.hash);

  const currentPrefix = getLocaleBaseUrl(currentLocale, defaultLocale);
  const currentPrefixNoSlash = currentPrefix.replace(/\/$/, '');

  let pathnameSuffix: string;
  if (pathname.startsWith(currentPrefix)) {
    pathnameSuffix = pathname.slice(currentPrefix.length);
  } else if (pathname === currentPrefixNoSlash || pathname === currentPrefix) {
    pathnameSuffix = '';
  } else {
    pathnameSuffix = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  }

  const getURL = (locale: string, options: {queryString: string | undefined}) => {
    const prefix = getLocaleBaseUrl(locale, defaultLocale);
    const url = `${prefix}${pathnameSuffix}`;
    const finalSearch = mergeSearchStrings(
      [search, options.queryString],
      'append',
    );
    return `pathname://${url}${finalSearch}${hash}`;
  };

  const getLocaleConfig = (locale: string) => {
    const lc = siteConfig.i18n?.localeConfigs?.[locale];
    return {
      label: lc?.label ?? locale,
      htmlLang: lc?.htmlLang ?? locale,
    };
  };

  return {
    getURL,
    getLabel: (locale: string) => getLocaleConfig(locale).label,
    getLang: (locale: string) => getLocaleConfig(locale).htmlLang,
  };
}

export default function LocaleDropdownNavbarItem({
  mobile,
  dropdownItemsBefore,
  dropdownItemsAfter,
  queryString,
  ...props
}: Props): ReactNode {
  const utils = useLocaleDropdownUtils();
  const {
    i18n: {currentLocale, locales},
  } = useDocusaurusContext();

  const localeItems = locales.map((locale): LinkLikeNavbarItemProps => {
    return {
      label: utils.getLabel(locale),
      lang: utils.getLang(locale),
      to: utils.getURL(locale, {queryString}),
      target: '_self',
      autoAddBaseUrl: false,
      className:
        locale === currentLocale
          ? mobile
            ? 'menu__link--active'
            : 'dropdown__link--active'
          : '',
    };
  });

  const items = [...dropdownItemsBefore, ...localeItems, ...dropdownItemsAfter];

  const dropdownLabel = mobile
    ? translate({
        message: 'Languages',
        id: 'theme.navbar.mobileLanguageDropdown.label',
        description: 'The label for the mobile language switcher dropdown',
      })
    : utils.getLabel(currentLocale);

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      label={
        <>
          <IconLanguage className={styles.iconLanguage} />
          {dropdownLabel}
        </>
      }
      items={items}
    />
  );
}
