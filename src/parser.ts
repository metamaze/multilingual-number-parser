/* eslint-disable no-extra-parens */
import { compileSubRegion } from './compiler';
import {
  BLACKLIST_SINGULAR_WORDS,
  DECIMALS,
  JOINERS,
  MAGNITUDE_KEYS,
  NUMBER_WORDS,
  PUNCTUATION,
  TEN_KEYS,
  TOKEN_TYPE,
  UNIT_KEYS,
} from './constants';
import { modifyDutch, modifyEnglish } from './modifiers';
import { HANDLE_TOKEN, Languages, Region, SubRegion, Token } from './types';

/**
 * Check if token can be appened to the sub region
 * @param {SubRegion} subRegion
 * @param {Token} currentToken
 * @returns
 */
const canAddTokenToEndOfSubRegion = (subRegion: SubRegion, currentToken: Token) => {
  const { tokens } = subRegion;
  const prevToken = tokens[0];
  if (!prevToken) return true;
  if (prevToken.type === TOKEN_TYPE.DECIMAL) return false;
  if (prevToken.type === TOKEN_TYPE.MAGNITUDE && currentToken.type === TOKEN_TYPE.UNIT) return true;
  if (prevToken.type === TOKEN_TYPE.MAGNITUDE && currentToken.type === TOKEN_TYPE.TEN) return true;
  if (
    subRegion.type === TOKEN_TYPE.MAGNITUDE &&
    prevToken.type === TOKEN_TYPE.TEN &&
    currentToken.type === TOKEN_TYPE.UNIT
  )
    return true;
  if (
    subRegion.type === TOKEN_TYPE.MAGNITUDE &&
    prevToken.type === TOKEN_TYPE.UNIT &&
    currentToken.type === TOKEN_TYPE.TEN
  )
    return true;
  if (prevToken.type === TOKEN_TYPE.TEN && currentToken.type === TOKEN_TYPE.UNIT) return true;
  if (prevToken.type === TOKEN_TYPE.MAGNITUDE && currentToken.type === TOKEN_TYPE.MAGNITUDE) return true;
  return false;
};

/**
 * Calculates what type the subRegion needs to be.
 * @param {SubRegion} subRegion
 * @param {Token} currentToken
 * @returns {type: TOKEN_TYPE}
 */
const getSubRegionType = (subRegion: SubRegion, currentToken: Token): { type: TOKEN_TYPE } => {
  if (currentToken.type === TOKEN_TYPE.DECIMAL) return { type: TOKEN_TYPE.DECIMAL };
  if (subRegion && subRegion.type === TOKEN_TYPE.MAGNITUDE) return { type: TOKEN_TYPE.MAGNITUDE };
  return { type: currentToken.type };
};

/**
 * Checks how the passed token should be handled.
 * @param subRegion
 * @param token
 * @returns {HANDLE_TOKEN,TOKEN_TYPE} what should happen with the token and subregion (start new region, add)
 */
const checkIfTokenFitsSubRegion = (subRegion: SubRegion, token: Token): { action: HANDLE_TOKEN; type: TOKEN_TYPE } => {
  const { type } = getSubRegionType(subRegion, token);
  if (!subRegion) return { action: HANDLE_TOKEN.START_NEW_REGION, type };
  if (canAddTokenToEndOfSubRegion(subRegion, token)) {
    return { action: HANDLE_TOKEN.ADD, type };
  }
  return { action: HANDLE_TOKEN.START_NEW_REGION, type };
};

/**
 * Looks for all tokens that combine one number
 * @example five million = 2 tokens but combine to 5.000.000 = 1 number
 * @param {Region} region a whole region
 * @returns {SubRegion[]} all found subregions (combination of tokens that combine a single number)
 */
const getSubRegions = (region: Region): SubRegion[] => {
  let subRegions: SubRegion[] = [];
  let currentSubRegion: SubRegion;
  const tokensCount = region.tokens.length;
  let i = tokensCount - 1;
  while (i >= 0) {
    const token = region.tokens[i];
    const { action, type } = checkIfTokenFitsSubRegion(currentSubRegion!, token);
    token.type = token.type;
    switch (action) {
      case HANDLE_TOKEN.ADD: {
        currentSubRegion!.type = type;
        currentSubRegion!.tokens.unshift(token);
        break;
      }
      case HANDLE_TOKEN.START_NEW_REGION: {
        currentSubRegion = {
          tokens: [token],
          type,
        };
        subRegions.unshift(currentSubRegion);
        break;
      }
      // no default
    }
    i--;
  }
  subRegions = mergeSubRegions(subRegions);
  return subRegions;
};

/**
 * Checks the 'order' of the 'numbers in words'.
 * @example five fifty (5 50) is not a valid combination, so will return false.
 * @example fifty five (55) is a valid combination, so will return true.
 * @example five.five (5.5) is a valid combination, so will return true.
 * @example five five (5 5) is not a valid combination, so will return false
 * @param {Region} region
 * @param {Token} currentToken
 * @returns {boolean}
 */
const canAddTokenToEndOfRegion = (region: Region, currentToken: Token): boolean => {
  const { tokens } = region;
  const prevToken = tokens[tokens.length - 1];
  //If previous and current token are both UNITS and there is NO DECIMAL => false (five five is not valid, but five.five is a valid combination)
  if (prevToken.type === TOKEN_TYPE.UNIT && currentToken.type === TOKEN_TYPE.UNIT && !region.hasDecimal) return false;
  // If current token is a TEN and previous is a UNIT => false (five fifty is not a valid combination)
  if (prevToken.type === TOKEN_TYPE.UNIT && currentToken.type === TOKEN_TYPE.TEN) return false;
  // If previous token and current token are TENs => false (fifty fifty is not a valid combination)
  if (prevToken.type === TOKEN_TYPE.TEN && currentToken.type === TOKEN_TYPE.TEN) return false;
  return true;
};

/**
 * Check if token fits in the passed region.
 *
 * token===PUNCTUATION => SKIP
 * token===DECIMAL && region===null => START_NEW_REGION
 * token===JOINER => SKIP
 * token===DECIMAL && !region.hasDecimal =>ADD
 * token===NUMBER && region===null => START_NEW_REGION
 * (token===NUMBER && region.previous) valid combination => ADD else START_NEW_REGION
 * token===USELESS => NOPE
 * @param {Region} region
 * @param {Token} token
 * @returns {HANDLE_TOKEN} what should happen with the token and region (start new region, add, skip, nope)
 */
const checkIfTokenFitsRegion = (region: Region, token: Token): HANDLE_TOKEN => {
  const isDecimal = DECIMALS.includes(token.lowerCaseValue);
  //If there is no region and no tokens BUT token is a decimal => START_NEW_REGION
  if ((!region || !region.tokens.length) && isDecimal) {
    return HANDLE_TOKEN.START_NEW_REGION;
  }
  //If token is a punctuation => SKIP
  const isPunctuation = PUNCTUATION.includes(token.lowerCaseValue);
  if (isPunctuation) return HANDLE_TOKEN.SKIP;
  //If it is a joiner (token.lwoercaseValue === 'and') => SKIP
  const isJoiner = JOINERS.includes(token.lowerCaseValue);
  if (isJoiner) return HANDLE_TOKEN.SKIP;

  //If region has no decimal yet, but the token is a decimal => ADD
  if (isDecimal && !region.hasDecimal) {
    return HANDLE_TOKEN.ADD;
  }
  //If token is a 'number word' and there is no region => START_NEW_REGION
  //If token can be combined with previous token f.e.(fifty five)=55 => ADD
  //If token cannot be combined with previous token f.e. (five fifty)=5 50 => START_NEW_REGION
  const isNumberWord = NUMBER_WORDS.includes(token.lowerCaseValue);
  if (isNumberWord) {
    if (!region) return HANDLE_TOKEN.START_NEW_REGION;
    if (canAddTokenToEndOfRegion(region, token)) {
      return HANDLE_TOKEN.ADD;
    }
    return HANDLE_TOKEN.START_NEW_REGION;
  }
  //If token is worthless => NOPE
  return HANDLE_TOKEN.NOPE;
};

/**
 * Checks if tokens should be blacklisted.
 * Returns true when there is only ONE TOKEN that EQUALS a value from BLACKLIST_SINGULAR_WORDS
 * @param {Token[]} tokens
 * @returns {boolean} black list, no regions present in token collection.
 */
const checkBlacklist = (tokens: Token[]): boolean =>
  tokens.length === 1 && BLACKLIST_SINGULAR_WORDS.includes(tokens[0].lowerCaseValue);

/**
 * Creates regions, regions are a collection of tokens
 * @example tokens = ['five', 'hundred', 'fifty'] = returns 1 region = 550
 * @example 2 tokens + decimal = ['five','.','thirthy'] = 1 region = 5.30
 * @param {Token[]} tokens
 * @returns {Region[]} all regions found in the whole token collection
 */
const matchRegions = (tokens: Token[]): Region[] => {
  const regions: Region[] = [];
  // There are no regions if tokens are blacklisted
  if (checkBlacklist(tokens)) {
    return regions;
  }

  let i = 0;
  let currentRegion: Region | null = null;
  const tokensCount = tokens.length;
  while (i < tokensCount) {
    const token = tokens[i];
    const tokenFits: HANDLE_TOKEN = checkIfTokenFitsRegion(currentRegion!, token);
    switch (tokenFits) {
      case HANDLE_TOKEN.SKIP: {
        break;
      }
      case HANDLE_TOKEN.ADD: {
        if (currentRegion) {
          currentRegion.end = token.end;
          currentRegion.tokens.push(token);
          if (token.type === TOKEN_TYPE.DECIMAL) {
            currentRegion.hasDecimal = true;
          }
        }
        break;
      }
      case HANDLE_TOKEN.START_NEW_REGION: {
        currentRegion = {
          start: token.start,
          end: token.end,
          tokens: [token],
          hasDecimal: false,
          subRegions: [],
        };
        regions.push(currentRegion);
        if (token.type === TOKEN_TYPE.DECIMAL) {
          currentRegion.hasDecimal = true;
        }
        break;
      }
      case HANDLE_TOKEN.NOPE:
      default: {
        currentRegion = null;
        break;
      }
    }
    i++;
  }
  return regions.map(region => ({ ...region, subRegions: getSubRegions(region) }));
};
/**
 * Check what type the chunk is. This chunk will later be converted to a Token
 * @param {string} chunk a substring of the whole sentence
 * @returns {TOKEN_TYPE}
 */
//@ts-ignore
const getTokenType = (chunk: string): TOKEN_TYPE => {
  if (UNIT_KEYS.includes(chunk.toLowerCase())) return TOKEN_TYPE.UNIT;
  if (TEN_KEYS.includes(chunk.toLowerCase())) return TOKEN_TYPE.TEN;
  if (MAGNITUDE_KEYS.includes(chunk.toLowerCase())) return TOKEN_TYPE.MAGNITUDE;
  if (DECIMALS.includes(chunk.toLowerCase())) return TOKEN_TYPE.DECIMAL;
};

/**
 * Parse the actual string to regions.
 * !Should not be called externally: use wordsToNumbers()
 *
 * @param {string} text the actual string that needs to be converted
 * @param {Languages} language the language from the passed string. Default = english
 */
export const parser = (text: string, language: Languages): Region[] => {
  let splitted: string[] = text.split(/(\s|[[:punct:]]|\(|\))/i);
  const tokens: Token[] = splitted.reduce((result: Token[], currentValue: string) => {
    const start = result.length ? result[result.length - 1].end + 1 : 0;
    const end = start + currentValue.length;
    let splitted;
    let tokens: Token[] = [];
    switch (language) {
      case Languages['nl-nl']:
        splitted = modifyDutch(currentValue);
        break;
      case Languages['en-us']:
        splitted = modifyEnglish(currentValue);
        break;
    }

    if (splitted && splitted.length > 0 && Array.isArray(splitted)) {
      tokens = splitted.map(split => {
        return {
          start,
          end: end - 1,
          value: split,
          lowerCaseValue: split.toLowerCase(),
          type: getTokenType(split),
        };
      });
    } else {
      tokens = [
        {
          start,
          end: end - 1,
          value: currentValue,
          lowerCaseValue: currentValue.toLowerCase(),
          type: getTokenType(currentValue),
        },
      ];
    }
    //@ts-ignore
    return end !== start ? result.concat(...tokens) : result;
  }, []);
  const regions = matchRegions(tokens);
  return regions;
};

/**
 * !IMPORTANT FIX FOR ORIGINAL PACKAGE
 *
 * If previous subregion is smaller then the current, they can be merged.
 * f.e. 2622000
 * six hundred will be a subregion and twenty two thousand will be a subregion
 * Check that will be executed is: previous subregion smaller then current? Merge.
 * @param {SubRegion[]} subRegions all subRegions from a Region
 * @returns {SubRegion[]} all subRegions that are passed as input, but some can be merged
 */
const mergeSubRegions = (subRegions: SubRegion[]): SubRegion[] => {
  for (let i = 0; i < subRegions.length; i++) {
    const current = subRegions[i];
    if (i > 0) {
      const previous = subRegions[i - 1];
      if (previous.type === TOKEN_TYPE.MAGNITUDE && compileSubRegion(previous).sum < compileSubRegion(current).sum) {
        //Merge the subregions
        const newSubRegion: SubRegion = {
          tokens: [...previous.tokens, ...current.tokens],
          type: current.type,
        };
        subRegions.splice(i - 1, 2, newSubRegion);
      }
    }
  }
  return subRegions;
};
