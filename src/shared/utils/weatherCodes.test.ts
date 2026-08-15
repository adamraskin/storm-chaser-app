import { describeWeatherCode, isSevereWeatherCode } from './weatherCodes';

describe('describeWeatherCode', () => {
  it('maps known codes to human-readable descriptions', () => {
    expect(describeWeatherCode(0)).toBe('Clear sky');
    expect(describeWeatherCode(95)).toBe('Thunderstorm');
  });

  it('falls back to "Unknown conditions" for unmapped codes', () => {
    expect(describeWeatherCode(-1)).toBe('Unknown conditions');
    expect(describeWeatherCode(9999)).toBe('Unknown conditions');
  });
});

describe('isSevereWeatherCode', () => {
  it('flags thunderstorm and heavy precipitation codes as severe', () => {
    expect(isSevereWeatherCode(95)).toBe(true);
    expect(isSevereWeatherCode(96)).toBe(true);
    expect(isSevereWeatherCode(65)).toBe(true);
    expect(isSevereWeatherCode(82)).toBe(true);
  });

  it('does not flag clear or mildly cloudy codes as severe', () => {
    expect(isSevereWeatherCode(0)).toBe(false);
    expect(isSevereWeatherCode(2)).toBe(false);
    expect(isSevereWeatherCode(51)).toBe(false);
  });
});
