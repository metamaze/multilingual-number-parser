import { TOKEN_TYPE } from './constants';

export enum Languages {
  'nl-nl' = 'nl-nl',
  'en-us' = 'en-us',
}
/**
 * Token is a 'substring' of a sentence, it includes the position of the substring and checks if this substring is 'word' that needs converting to a number.
 */
export type Token = {
  start: number;
  end: number;
  value: string;
  lowerCaseValue: string;
  type: TOKEN_TYPE;
};

/**
 * A whole part of a string that is a number
 */
export type Region = {
  start: number;
  end: number;
  tokens: Token[];
  hasDecimal: boolean;
  subRegions: SubRegion[];
};

/**
 * Combination of tokens that actually forms 1 number f.e. five million => 5.000.000
 * It contains 2 tokens five and million => ['five', 'million']
 */
export type SubRegion = {
  tokens: Token[];
  type: TOKEN_TYPE;
};

/**
 * Determines what the token should do
 */
export enum HANDLE_TOKEN {
  START_NEW_REGION = 'START_NEW_REGION',
  SKIP = 'SKIP',
  ADD = 'ADD',
  NOPE = 'NOPE',
}
