import {NUMBER, TOKEN_TYPE} from './constants';
import {Languages, Region, SubRegion} from './types';
import {splice} from './util';

export type Options = Partial<{
  numbersOnly: boolean;
  oneNumber: boolean;
  useSuffix: boolean;
  debug: boolean;
  language: Languages;
}>;

export const convertChunkToNumber = (txt: string): number => {
  return (NUMBER as any)[txt];
};
/**
 * Custom created compiler which acts better than the original one.
 * !Should not be called externally: use wordsToNumbers()
 *
 * Converts SubRegion's to an actual number
 * Supports comma separated values aswell.
 *
 * @param {SubRegion} subRegion passed in by compileRegion
 * @param {boolean} decimal passed in by compileRegion
 * @returns
 */
export const compileSubRegion = (subRegion: SubRegion, decimal: boolean = false): { sum: number; decimal: boolean } => {
  let sum = 0;
  switch (subRegion.type) {
    case TOKEN_TYPE.DECIMAL:
      return { sum: 0, decimal: true };
    case TOKEN_TYPE.UNIT:
      if (subRegion.tokens.length > 1 || subRegion.tokens.length === 0)
        throw 'SHOULD HAVE 1 TOKEN! SUBREGION TYPE = UNIT';
      sum += convertChunkToNumber(subRegion.tokens[0].lowerCaseValue);
      break;
    case TOKEN_TYPE.TEN:
      if (subRegion.tokens.length > 1 || subRegion.tokens.length === 0)
        throw 'SHOULD HAVE 1 TOKEN! SUBREGION TYPE = TEN';
      sum += convertChunkToNumber(subRegion.tokens[0].lowerCaseValue);
      break;
    case TOKEN_TYPE.HUNDRED:
      if (subRegion.tokens.length > 1 || subRegion.tokens.length === 0)
        throw 'SHOULD HAVE 1 TOKEN! SUBREGION TYPE = HUNDRED';
      sum += convertChunkToNumber(subRegion.tokens[0].lowerCaseValue);
      break;
    case TOKEN_TYPE.MAGNITUDE:
      subRegion.tokens.map(token => {
        switch (token.type) {
          case TOKEN_TYPE.UNIT:
          case TOKEN_TYPE.TEN:
          case TOKEN_TYPE.HUNDRED:
            sum += convertChunkToNumber(token.lowerCaseValue);
            break;
          case TOKEN_TYPE.MAGNITUDE:
            if (sum === 0) sum = 1;
            sum *= convertChunkToNumber(token.lowerCaseValue);
            break;
        }
      });
  }
  return { sum, decimal: decimal };
};

/**
 * Custom created compiler which acts better than the original one.
 * !Should not be called externally: use wordsToNumbers()
 *
 * Converts Region's to an actual number
 * Supports comma separated values aswell.
 *
 * @param {Region} region
 * @returns {number} the value of the region
 */
export const compileRegion = (region: Region): number => {
  let before: number = 0;
  let after: number = 0;
  let isDecimal: boolean = false;
  for (const subRegion of region.subRegions) {
    const { sum, decimal } = compileSubRegion(subRegion, isDecimal);
    isDecimal = decimal;
    if (decimal) {
      after += sum;
    } else {
      before += sum;
    }
  }
  return parseFloat(`${before}.${after}`);
};

/**
 * !DEPRECATED: COMPILER OF THE ORIGINAL PACKAGE SUCKS
 * Converts tokens (words) to actual numbers.
 * Subregions receive a sub total that is calculated, when they're all calculated, the sum for the whole region is calculated.
 * @param {Region} region
 * @returns {number} the total sum of the region
 */
// const getNumber = (region: Region): number => {
//   let sum = 0;
//   let decimalReached = false;
//   let decimalUnits: SubRegion[] = [];
//   region.subRegions.forEach((subRegion: SubRegion) => {
//     const { tokens, type } = subRegion;
//     let subRegionSum = 0;
//     if (type === TOKEN_TYPE.DECIMAL) {
//       decimalReached = true;
//       return;
//     }
//     if (decimalReached) {
//       decimalUnits.push(subRegion);
//       return;
//     }
//     switch (type) {
//       case TOKEN_TYPE.MAGNITUDE: {
//         subRegionSum = 1;
//         tokens
//           .reduce((result, token, i) => {
//             return result.concat({ token, numberValue: convertChunkToNumber(token.lowerCaseValue) });
//           }, [])
//           .forEach(({ numberValue, token }: { numberValue: number; token: Token }) => {
//             subRegionSum *= numberValue;
//           });
//         break;
//       }
//       //These are simple calculations, just converting the token to actual number. They're added to the subRegionSum.
//       case TOKEN_TYPE.UNIT:
//       case TOKEN_TYPE.TEN: {
//         tokens.forEach(token => {
//           subRegionSum += convertChunkToNumber(token.lowerCaseValue);
//         });
//         break;
//       }
//       // no default
//     }
//     //After all subregions are calculated,
//     sum += subRegionSum;
//   });
//   let currentDecimalPlace = 1;
//   decimalUnits.forEach(({ tokens }) => {
//     tokens.forEach(({ lowerCaseValue }) => {
//       const numericValue: string = convertChunkToNumber(lowerCaseValue).toString();
//       let power = '1';
//       for (let i = 0; i < numericValue.length; i++) {
//         power += '0';
//       }
//       const positionAfterDecimal = parseFloat(numericValue) / Math.pow(parseFloat(power), currentDecimalPlace);
//       sum += positionAfterDecimal;
//       currentDecimalPlace += 1;
//     });
//   });

//   return sum;
// };

/**
 * Converts all 'words' in the text to their actual 'number' based on the 'regions' that are calculated by the parser
 * @param {Region[]} regions all regions that exist inside the passed text
 * @param {string} text original text
 * @returns {string}
 */
const replaceRegionsInText = (regions: Region[], text: string): string => {
  let replaced = text;
  let offset = 0;
  regions.forEach(region => {
    const length = region.end - region.start + 1;
    const replaceWith = `${compileRegion(region)}`;
    replaced = splice(replaced, region.start + offset, length, replaceWith);
    offset -= length - replaceWith.length;
  });
  return replaced;
};

/**
 * Converts all 'words' in the text to their actual 'number' based on the 'regions' that are calculated by the parser
 * If only numbers are present in the text, it will return a number, otherwise a string
 *
 * !Should not be called externally: use wordsToNumbers()
 *
 * @param {Region[], text:string}
 * @returns {string | number}
 */
export const compiler = (
  {
    regions,
    text,
  }: {
    regions: Region[];
    text: string;
  },
  options: Options
): string | number | number[] => {
  if (!regions) return text;
  if (options.numbersOnly) {
    return regions.map(region => compileRegion(region));
  }
  if (options.oneNumber) {
    let temp = '';
    regions.forEach(region => {
      temp += compileRegion(region);
    });
    return parseFloat(temp);
  }
  if (regions.length && regions[0].end - regions[0].start === text.length - 1) {
    return compileRegion(regions[0]);
  }
  return replaceRegionsInText(regions, text);
};
