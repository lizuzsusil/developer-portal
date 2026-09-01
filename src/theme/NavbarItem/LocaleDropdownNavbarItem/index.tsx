/**
 * Fixed LocaleDropdownNavbarItem
 * Overrides Docusaurus default which incorrectly uses siteConfig.baseUrl ("/")
 * instead of current locale's baseUrl, causing URLs like /ta/si/si/ to stack.
 * See https://github.com/facebook/docusaurus/issues/9170
 */

import React, {type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {translate} from '@docusaurus/Translate';
import {mergeSearchStrings, useHistorySelector} from '@docusaurus/theme-common';
import {useLocation} from '@docusaurus/router';
import {applyTrailingSlash} from '@docusaurus/utils-common';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import IconLanguage from '@theme/Icon/Language';
import type {LinkLikeNavbarItemProps} from '@theme/NavbarItem';
import type {Props} from '@theme/NavbarItem/LocaleDropdownNavbarItem';

import styles from './styles.module.css';

function useLocaleDropdownUtils() {
  const {
    siteConfig,
    i18n: {localeConfigs, currentLocale},
  } = useDocusaurusContext();
  const {pathname} = useLocation();
  const search = useHistorySelector((history) => history.location.search);
  const hash = useHistorySelector((history) => history.location.hash);

  const getLocaleConfig = (locale: string) => {
    const localeConfig = localeConfigs[locale];
    if (!localeConfig) {
      throw new Error(
        `Docusaurus bug, no locale config found for locale=${locale}`,
      );
    }
    return localeConfig;
  };

  // Correctly compute pathname suffix using current locale's baseUrl,
  // not global siteConfig.baseUrl which is always "/" and causes stacking
  const getPathnameSuffix = () => {
    const currentLocaleBaseUrl = getLocaleConfig(currentLocale).baseUrl;
    const canonicalPathname = applyTrailingSlash(pathname, {
      trailingSlash: siteConfig.trailingSlash,
      baseUrl: currentLocaleBaseUrl,
    });
    // Remove the current locale prefix to get the locale-agnostic suffix
    // e.g. "/si/docs/overview" with baseUrl "/si/" => "docs/overview"
    // e.g. "/docs/overview" with baseUrl "/" => "docs/overview"
    // e.g. "/si/" with baseUrl "/si/" => ""
    // e.g. "/" with baseUrl "/" => ""
    if (canonicalPathname === currentLocaleBaseUrl) {
      return '';
    }
    // Ensure we correctly strip prefix; fallback to replace first occurrence
    if (canonicalPathname.startsWith(currentLocaleBaseUrl)) {
      return canonicalPathname.slice(currentLocaleBaseUrl.length);
    }
    // Fallback (should not happen) – strip global baseUrl
    return canonicalPathname.replace(siteConfig.baseUrl, '');
  };

  const pathnameSuffix = getPathnameSuffix();

  const createUrl = ({
    locale,
    fullyQualified,
  }: {
    locale: string;
    fullyQualified: boolean;
  }): string => {
    const localeConfig = getLocaleConfig(locale);
    const newUrl = `${fullyQualified ? localeConfig.url : ''}`;
    const newBaseUrl = localeConfig.baseUrl;
    return `${newUrl}${newBaseUrl}${pathnameSuffix}`;
  };

  const getBaseURLForLocale = (locale: string) => {
    const localeConfig = getLocaleConfig(locale);
    const isSameDomain = localeConfig.url === siteConfig.url;
    if (isSameDomain) {
      const path = createUrl({
        locale,
        fullyQualified: false,
      });
      // Remove leading slash to avoid triple slashes: pathname:// + /path = pathname:///path
      const pathWithoutLeadingSlash = path.startsWith('/') ? path.slice(1) : path;
      return `pathname://${pathWithoutLeadingSlash}`;
    }
    return createUrl({
      locale,
      fullyQualified: true,
    });
  };

  return {
    getURL: (locale: string, options: {queryString: string | undefined}) => {
      const finalSearch = mergeSearchStrings(
        [search, options.queryString],
        'append',
      );
      return `${getBaseURLForLocale(locale)}${finalSearch}${hash}`;
    },
    getLabel: (locale: string) => {
      return getLocaleConfig(locale).label;
    },
    getLang: (locale: string) => {
      return getLocaleConfig(locale).htmlLang;
    },
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
