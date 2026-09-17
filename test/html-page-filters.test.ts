// @vitest-environment jsdom
//
// Tests for the HtmlPageFilters widget — the two-block page filter layout:
// an always-visible block (default_filters) plus a collapsible block hidden
// behind a filter-icon toggle (filters). Legacy configs without
// default_filters must keep rendering all filters always-visible.
//
import { describe, it, expect, beforeEach } from 'vitest';
import { resetStore, initPageStore, fakePage } from './helpers/harness';
import { HtmlPageFilters } from '../src/widgets/html-page-filters';
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
  it('renders all filters always-visible and no toggle/collapsible block', () => {
    const config = makeConfig({ filters: ['vanaf', 'gemeenten'] });
    const { page } = buildFilters(config);

    const alwaysUl = document.querySelector(
      '.page_header > .page_filter_list_group > ul',
    );
    expect(alwaysUl).not.toBeNull();
    expect(alwaysUl!.children.length).toBe(2);

    expect(document.querySelector('.page_filter_toggle')).toBeNull();
    expect(
      document.querySelector('.page_filter_list_group--collapsible'),
    ).toBeNull();
  });

  it('wires the always-visible selector to onFilterChange', () => {
    const config = makeConfig({ filters: ['vanaf'] });
    const { page } = buildFilters(config);

    const input = document.querySelector(
      '.page_header > .page_filter_list_group input[type="date"]',
    ) as HTMLInputElement;
    expect(input).not.toBeNull();

    input.value = '2024-06-01';
    input.dispatchEvent(new Event('change'));
    expect(page.onFilterChange).toHaveBeenCalledWith({ vanaf: '2024-06-01' });
  });
});

describe('HtmlPageFilters – split config (default_filters present)', () => {
  it('renders default_filters always-visible and filters behind the toggle', () => {
    const config = makeConfig({
      default_filters: ['vanaf'],
      filters: ['gemeenten'],
    });
    const { page } = buildFilters(config);

    // Always-visible block holds the date ("vanaf") filter.
    const alwaysUl = document.querySelector(
      '.page_header > .page_filter_list_group > ul',
    );
    expect(alwaysUl!.children.length).toBe(1);
    expect(
      alwaysUl!.querySelector('input[type="date"]'),
    ).not.toBeNull();

    // Toggle + collapsible block hold the municipality filter.
    const toggle = document.querySelector('.page_filter_toggle');
    expect(toggle).not.toBeNull();
    expect(toggle!.getAttribute('aria-expanded')).toBe('false');

    const collapsible = document.querySelector(
      '.page_filter_list_group--collapsible',
    );
    expect(collapsible).not.toBeNull();
    expect(collapsible!.hasAttribute('hidden')).toBe(true);
    expect(collapsible!.querySelector('ul')!.children.length).toBe(1);
    expect(collapsible!.querySelector('select')).not.toBeNull();
  });

  it('toggle reveals/hides the collapsible block and updates aria-expanded', () => {
    const config = makeConfig({
      default_filters: ['vanaf'],
      filters: ['gemeenten'],
    });
    buildFilters(config);

    const toggle = document.querySelector(
      '.page_filter_toggle',
    ) as HTMLButtonElement;
    const collapsible = document.querySelector(
      '.page_filter_list_group--collapsible',
    ) as HTMLElement;

    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(collapsible.hasAttribute('hidden')).toBe(false);

    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(collapsible.hasAttribute('hidden')).toBe(true);
  });

  it('wires the hidden municipality selector to onFilterChange', () => {
    const config = makeConfig({
      default_filters: ['vanaf'],
      filters: ['gemeenten'],
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
});
