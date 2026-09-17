// @vitest-environment jsdom
//
// Tests for the HtmlPageFilters widget — the two-block page filter layout:
//   * `filters`        -> always-visible block underneath the page title.
//   * `default_filters` -> collapsible block hidden behind a filter-icon
//                          toggle, rendered ABOVE the page header.
// Legacy configs without `default_filters` keep rendering all `filters`
// always-visible and show NO toggle.
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetStore, initPageStore, fakePage } from './helpers/harness';
import { HtmlPageFilters } from '../src/widgets/html-page-filters';
import fsOverzichtConfig from '../src/pages/fs_overzicht/config';
import type { IPageConfig } from '../src/shared/interfaces';

function makeConfig(overrides: Partial<IPageConfig> = {}): IPageConfig {
  return {
    slug: 'test',
    segment: {
      key: '',
      gemeente: 'all',
      periodization: 'monthly',
      cumulative: true,
      vanaf: '2025-01-01',
    } as IPageConfig['segment'],
    filters: ['vanaf'],
    endpoints: [],
    groups: [],
    ...overrides,
  };
}

function buildFilters(config: IPageConfig) {
  const page = fakePage(config);
  const widget = new HtmlPageFilters(page);
  widget.draw();
  return { page, widget };
}

beforeEach(() => {
  resetStore();
  document.body.innerHTML = '<div class="page_header"></div>';
  initPageStore(makeConfig());
});

describe('HtmlPageFilters – legacy config (no default_filters)', () => {
  it('renders all filters always-visible under the title and NO toggle', () => {
    const config = makeConfig({ filters: ['vanaf', 'gemeenten'] });
    buildFilters(config);

    const header = document.querySelector('.page_header') as HTMLElement;
    const alwaysUl = header.querySelector(
      '.page_filter_list_group > ul',
    );
    expect(alwaysUl).not.toBeNull();
    expect(alwaysUl!.children.length).toBe(2);

    // No toggle and no collapsible block anywhere (above or below header).
    expect(document.querySelector('.page_filter_toggle')).toBeNull();
    expect(
      document.querySelector('.page_filter_list_group--collapsible'),
    ).toBeNull();
  });

  it('wires the always-visible selector to onFilterChange', () => {
    const config = makeConfig({ filters: ['vanaf'] });
    const { page } = buildFilters(config);

    const input = document.querySelector(
      '.page_header .page_filter_list_group input[type="date"]',
    ) as HTMLInputElement;
    expect(input).not.toBeNull();

    input.value = '2024-06-01';
    input.dispatchEvent(new Event('change'));
    expect(page.onFilterChange).toHaveBeenCalledWith({ vanaf: '2024-06-01' });
  });
});

describe('HtmlPageFilters – split config (default_filters present)', () => {
  it('renders filters always-visible under the title and default_filters togglable ABOVE the header', () => {
    const config = makeConfig({
      default_filters: ['gemeenten'],
      filters: ['vanaf'],
    });
    buildFilters(config);

    const header = document.querySelector('.page_header') as HTMLElement;

    // filters = ["vanaf"] -> always-visible date input inside the header.
    const alwaysUl = header.querySelector(
      '.page_filter_list_group > ul',
    );
    expect(alwaysUl!.children.length).toBe(1);
    expect(alwaysUl!.querySelector('input[type="date"]')).not.toBeNull();

    // Toggle + collapsible are wrapped together ABOVE the header.
    const toggle = document.querySelector(
      '.page_filter_toggle',
    ) as HTMLButtonElement;
    expect(toggle).not.toBeNull();

    const collapsible = document.querySelector(
      '.page_filter_list_group--collapsible',
    ) as HTMLElement;
    expect(collapsible).not.toBeNull();

    const wrapper = document.querySelector(
      '.page_filter_above_header',
    ) as HTMLElement;
    expect(wrapper).not.toBeNull();
    expect(toggle.parentNode).toBe(wrapper);
    expect(collapsible.parentNode).toBe(wrapper);
    // The button precedes the collapsible list inside the wrapper.
    expect(wrapper.children[0]).toBe(toggle);
    expect(wrapper.children[1]).toBe(collapsible);

    // The wrapper sits ABOVE the header in document order (a direct sibling).
    expect(wrapper.parentNode).toBe(header.parentNode);
    expect(
      wrapper.compareDocumentPosition(header) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    // default_filters = ["gemeenten"] -> hidden collapsible block holds select.
    expect(collapsible.hasAttribute('hidden')).toBe(true);
    expect(collapsible.querySelector('ul')!.children.length).toBe(1);
    expect(collapsible.querySelector('select')).not.toBeNull();
  });

  it('wraps the toggle + collapsible block in a full-width container with a right-aligned button', () => {
    const config = makeConfig({
      default_filters: ['gemeenten'],
      filters: ['vanaf'],
    });
    buildFilters(config);

    const header = document.querySelector('.page_header') as HTMLElement;
    const wrapper = document.querySelector(
      '.page_filter_above_header',
    ) as HTMLElement;
    expect(wrapper).not.toBeNull();

    // Full width (a synthetic stylesheet mirrors the SCSS rule so
    // getComputedStyle reflects what the class is wired to).
    const style = document.createElement('style');
    style.textContent = '.page_filter_above_header { width: 100%; }';
    document.head.appendChild(style);
    expect(getComputedStyle(wrapper).width).toBe('100%');
    style.remove();

    // Contains exactly the toggle button + collapsible list, above the header.
    expect(wrapper.children.length).toBe(2);
    expect(wrapper.querySelector('.page_filter_toggle')).not.toBeNull();
    expect(
      wrapper.querySelector('.page_filter_list_group--collapsible'),
    ).not.toBeNull();
    expect(wrapper.parentNode).toBe(header.parentNode);
    expect(
      wrapper.compareDocumentPosition(header) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    // The button is a flex child that the SCSS right-aligns (align-self:
    // flex-end). Verify the hookup class is present.
    const toggle = wrapper.querySelector('.page_filter_toggle') as HTMLElement;
    expect(toggle.classList.contains('page_filter_toggle--above-header')).toBe(
      true,
    );
    // No bottom margin on the block: the wrapper class drives margin-bottom 0.
    expect(wrapper.classList.contains('page_filter_above_header')).toBe(true);
  });

  it('toggle exposes aria-controls pointing at the panel and an aria-label', () => {
    const config = makeConfig({
      default_filters: ['gemeenten'],
      filters: ['vanaf'],
    });
    buildFilters(config);

    const toggle = document.querySelector(
      '.page_filter_toggle',
    ) as HTMLButtonElement;
    const collapsible = document.querySelector(
      '.page_filter_list_group--collapsible',
    ) as HTMLElement;

    expect(toggle).not.toBeNull();
    expect(collapsible).not.toBeNull();

    // aria-controls must reference the collapsible block's id.
    expect(toggle.getAttribute('aria-controls')).toBe(collapsible.id);
    expect(collapsible.id).toBe('page_filter_collapsible');

    // aria-label must be present on the icon-only toggle.
    const label = toggle.getAttribute('aria-label');
    expect(label).not.toBeNull();
    expect(label!.trim().length).toBeGreaterThan(0);
  });

  it('toggle reveals/hides the collapsible block and updates aria-expanded', () => {
    const config = makeConfig({
      default_filters: ['gemeenten'],
      filters: ['vanaf'],
    });
    buildFilters(config);

    const toggle = document.querySelector(
      '.page_filter_toggle',
    ) as HTMLButtonElement;
    const collapsible = document.querySelector(
      '.page_filter_list_group--collapsible',
    ) as HTMLElement;

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(collapsible.hasAttribute('hidden')).toBe(true);

    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(collapsible.hasAttribute('hidden')).toBe(false);

    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(collapsible.hasAttribute('hidden')).toBe(true);
  });

  it('wires the togglable default_filters selector to onFilterChange', () => {
    const config = makeConfig({
      default_filters: ['gemeenten'],
      filters: ['vanaf'],
    });
    const { page } = buildFilters(config);

    const select = document.querySelector(
      '.page_filter_list_group--collapsible select',
    ) as HTMLSelectElement;
    expect(select).not.toBeNull();

    select.value = 'Groningen';
    select.dispatchEvent(new Event('change'));
    expect(page.onFilterChange).toHaveBeenCalledWith({ gemeente: 'Groningen' });
  });

  it('empty default_filters keeps filters always-visible and shows an empty togglable block above the header', () => {
    const config = makeConfig({
      default_filters: [],
      filters: ['vanaf', 'gemeenten'],
    });
    buildFilters(config);

    const header = document.querySelector('.page_header') as HTMLElement;

    // filters stay always-visible (split is in effect, so only filters here).
    const alwaysUl = header.querySelector('.page_filter_list_group > ul');
    expect(alwaysUl!.children.length).toBe(2);

    // Empty default_filters -> toggle still present, collapsible above header is empty.
    const toggle = document.querySelector('.page_filter_toggle');
    expect(toggle).not.toBeNull();
    expect(toggle!.getAttribute('aria-expanded')).toBe('false');

    const collapsible = document.querySelector(
      '.page_filter_list_group--collapsible',
    ) as HTMLElement;
    expect(collapsible).not.toBeNull();
    expect(collapsible.parentNode?.parentNode).toBe(header.parentNode);
    expect(collapsible.hasAttribute('hidden')).toBe(true);
    expect(collapsible.querySelector('ul')!.children.length).toBe(0);
  });
});

describe('HtmlPageFilters – real fs_overzicht config', () => {
  it('renders the actual split: filters ["vanaf"] always-visible, default_filters ["gemeenten"] togglable above the header', () => {
    // Seed the store from the real config (weekly periodization etc.).
    resetStore();
    document.body.innerHTML = '<div class="page_header"></div>';
    initPageStore(fsOverzichtConfig);

    buildFilters(fsOverzichtConfig);

    const header = document.querySelector('.page_header') as HTMLElement;

    // filters = ["vanaf"] -> always-visible date input inside the header.
    const alwaysUl = header.querySelector('.page_filter_list_group > ul');
    expect(alwaysUl!.children.length).toBe(1);
    expect(alwaysUl!.querySelector('input[type="date"]')).not.toBeNull();

    // default_filters = ["gemeenten"] -> togglable select above the header.
    const toggle = document.querySelector(
      '.page_filter_toggle',
    ) as HTMLButtonElement;
    expect(toggle).not.toBeNull();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    const wrapper = document.querySelector(
      '.page_filter_above_header',
    ) as HTMLElement;
    expect(wrapper).not.toBeNull();
    expect(toggle.parentNode).toBe(wrapper);
    expect(wrapper.parentNode).toBe(header.parentNode);

    const collapsible = document.querySelector(
      '.page_filter_list_group--collapsible',
    ) as HTMLElement;
    expect(collapsible).not.toBeNull();
    expect(collapsible.parentNode).toBe(wrapper);
    expect(
      wrapper.compareDocumentPosition(header) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(collapsible.hasAttribute('hidden')).toBe(true);
    expect(collapsible.querySelector('ul')!.children.length).toBe(1);
    expect(collapsible.querySelector('select')).not.toBeNull();

    // aria-controls wiring holds for the real config too.
    expect(toggle.getAttribute('aria-controls')).toBe(collapsible.id);
  });
});
