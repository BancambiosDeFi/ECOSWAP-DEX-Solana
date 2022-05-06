import BN from 'bn.js';

import {
  Fraction,
  Percent,
  Price,
  TokenAmount,
  TEN,
  ZERO,
  BigNumberish,
} from '@raydium-io/raydium-sdk';

const stringNumberRegex = /(-?)(\d*)\.?(\d*)/;
export type Numberish = number | string | bigint | Fraction | BN;

export function toFraction(value: Numberish): Fraction {
  //  to complete math format(may have decimal), not int
  if (value instanceof Percent) return new Fraction(value.numerator, value.denominator);

  if (value instanceof Price) return value.adjusted;

  // to complete math format(may have decimal), not BN
  if (value instanceof TokenAmount) return toFraction(value.toExact());

  // do not ideal with other fraction value
  if (value instanceof Fraction) return value;

  // wrap to Fraction
  const n = String(value);
  const details = parseNumberInfo(n);

  return new Fraction(details.numerator, details.denominator);
}

export function toBN(n: Numberish, decimal: BigNumberish = 0): BN {
  if (n instanceof BN) return n;

  return new BN(
    toFraction(n)
      .mul(TEN.pow(new BN(String(decimal))))
      .toFixed(0),
  );
}

export function parseNumberInfo(n: Numberish | undefined): {
  denominator: string;
  numerator: string;
} {
  if (n === undefined) return { denominator: '1', numerator: '0' };
  if (n instanceof BN) {
    return { numerator: n.toString(), denominator: '1' };
  }

  if (n instanceof Fraction) {
    return { denominator: n.denominator.toString(), numerator: n.numerator.toString() };
  }

  const s = String(n);
  const [, sign = '', int = '', dec = ''] = s.match(/(-?)(\d*)\.?(\d*)/) ?? [];
  const denominator = '1' + '0'.repeat(dec.length);
  const numerator = sign + (int === '0' ? '' : int) + dec || '0';

  return { denominator, numerator };
}

export function trimTailingZero(s: string) {
  // no decimal part
  if (!s.includes('.')) return s;
  const [, sign, int, dec] = s.match(stringNumberRegex) ?? [];
  let cleanedDecimalPart = dec;
  while (cleanedDecimalPart.endsWith('0')) {
    cleanedDecimalPart = cleanedDecimalPart.slice(0, cleanedDecimalPart.length - 1);
  }

  return cleanedDecimalPart ? `${sign}${int}.${cleanedDecimalPart}` : `${sign}${int}` || '0';
}

export function eq(a: Numberish | undefined, b: Numberish | undefined): boolean {
  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }
  const fa = toFraction(a);
  const fb = toFraction(b);

  return toBN(fa.sub(fb).numerator).eq(ZERO);
}

export function gt(a: Numberish | undefined, b: Numberish | undefined): boolean {
  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }
  const fa = toFraction(a);
  const fb = toFraction(b);

  return toBN(fa.sub(fb).numerator).gt(ZERO);
}

export function mul(a: Numberish, b: Numberish): Fraction;
export function mul(a: Numberish | undefined, b: Numberish | undefined): Fraction | undefined;
export function mul(a: Numberish | undefined, b: Numberish | undefined): Fraction | undefined {
  if (a === null || a === undefined || b === null || b === undefined) {
    return undefined;
  }
  const fa = toFraction(a);
  const fb = toFraction(b);

  return fa.mul(fb);
}
export function div(a: Numberish, b: Numberish): Fraction;
export function div(a: Numberish | undefined, b: Numberish | undefined): Fraction | undefined;
export function div(a: Numberish | undefined, b: Numberish | undefined): Fraction | undefined {
  if (a === null || a === undefined || b === null || b === undefined) return undefined;
  const fa = toFraction(a);
  const fb = toFraction(b);
  try {
    return fa.div(fb); // if fb is zero , operation will throw error
  } catch {
    return fa;
  }
}

export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

function getSign(s: Numberish) {
  return gt(s, 0) ? '+' : '-';
}
function getUnsignNumber(s: Numberish) {
  return gt(s, 0) ? s : mul(s, -1);
}

export function toString(
  n: Numberish | null | undefined,
  options?: {
    /** @default 'auto' */
    // eslint-disable-next-line prettier/prettier
    decimalLength?: number | 'auto' | 'auto ' | `auto ${number}`;
    /** whether set zero decimal depends on how you get zero. if you get it from very samll number, */
    zeroDecimalNotAuto?: boolean;
    separator?: string;
  },
): string {
  if (n === null || n === undefined) return '';
  // console.log(options?.separator);
  const fr = toFraction(n);
  let result = '';
  const decimalLength = options?.decimalLength ?? 'auto';
  if (decimalLength === 'auto') {
    result = trimTailingZero(fr.toFixed(6));
  } else if (isString(decimalLength) && decimalLength.startsWith('auto')) {
    const autoDecimalLength = Number(decimalLength.split(' ')[1]);
    result = trimTailingZero(fr.toFixed(autoDecimalLength));
  } else {
    result = fr.toFixed(decimalLength as number, { groupSeparator: options?.separator || '' });
  }
  // for decimal-not-auto zero
  if (eq(result, 0) && options?.zeroDecimalNotAuto) {
    const decimalLength = Number(String(options.decimalLength ?? '').match(/auto (\d*)/)?.[1] ?? 6);

    return `0.${'0'.repeat(decimalLength)}`;
  } else {
    // for rest
    return result;
  }
}

export function toPercentString(
  n: Numberish | Percent | undefined,
  options?: {
    /** by default, it will output <0.01% if it is too small   */
    exact?: boolean;
    /** @default 2  */
    fixed?: number;
    /** maybe backend will, but it's freak */
    alreadyPercented?: boolean;
    /** usually used in price */
    alwaysSigned?: boolean;
  },
): string {
  try {
    const fractionN = toFraction(n ?? 0);
    const stringPart = fractionN
      .mul(options?.alreadyPercented ? 1 : 100)
      .toFixed(options?.fixed ?? 2);
    if (eq(fractionN, 0)) return '0%';
    if (!options?.exact && stringPart === '0.00')
      return options?.alwaysSigned ? '<+0.01%' : '<0.01%';

    return options?.alwaysSigned
      ? `${getSign(stringPart)}${toString(getUnsignNumber(stringPart))}%`
      : `${stringPart}%`;
  } catch (err) {
    return '0%';
  }
}
