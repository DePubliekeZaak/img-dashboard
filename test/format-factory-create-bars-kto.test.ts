import { describe, it, expect } from 'vitest';
import { createBarsForKTO } from '../src/shared/data.format.factory';

const param = {
  label: 'Maand cijfer',
  column: 'kto_score_gemiddeld',
  colour: 'orange',
};

describe('createBarsForKTO legacy compatibility', () => {
  it('falls back to _month when completed_month is missing (current API)', () => {
    const bars = createBarsForKTO(
      'kto_score_gemiddeld',
      param,
      [{ _year: 2025, _month: '03', kto_score_gemiddeld: '7.2' }],
      { periodization: 'monthly' } as any,
    );

    expect(bars[0].date).toBe('2025_03');
    expect(bars[0].value).toBe(7.2);
  });

  it('still honours a present completed_month (legacy API behaviour)', () => {
    const bars = createBarsForKTO(
      'kto_score_gemiddeld',
      param,
      [{ _year: 2025, _month: '03', completed_month: '04', kto_score_gemiddeld: '7.2' }],
      { periodization: 'monthly' } as any,
    );

    expect(bars[0].date).toBe('2025_04');
  });

  it('treats an empty completed_month like a missing one', () => {
    const bars = createBarsForKTO(
      'kto_score_gemiddeld',
      param,
      [{ _year: 2025, _month: '03', completed_month: '', kto_score_gemiddeld: '7.2' }],
      { periodization: 'monthly' } as any,
    );

    expect(bars[0].date).toBe('2025_03');
  });
});
