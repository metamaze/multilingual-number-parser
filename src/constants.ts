export const ENGLISH_UNIT = {
  zero: 0,
  first: 1,
  one: 1,
  second: 2,
  two: 2,
  third: 3,
  thirteenth: 13,
  thirteen: 13,
  three: 3,
  fourth: 4,
  fourteenth: 14,
  fourteen: 14,
  four: 4,
  fifteenth: 15,
  fifteen: 15,
  fifth: 5,
  five: 5,
  sixth: 6,
  sixteenth: 16,
  sixteen: 16,
  six: 6,
  seventeenth: 17,
  seventeen: 17,
  seventh: 7,
  seven: 7,
  eighteenth: 18,
  eighteen: 18,
  eighth: 8,
  eight: 8,
  nineteenth: 19,
  nineteen: 19,
  ninth: 9,
  nine: 9,
  tenth: 10,
  ten: 10,
  eleventh: 11,
  eleven: 11,
  twelfth: 12,
  twelve: 12,
  a: 1,
};

export const ENGLISH_TEN = {
  twenty: 20,
  twentieth: 20,
  thirty: 30,
  thirtieth: 30,
  forty: 40,
  fortieth: 40,
  fifty: 50,
  fiftieth: 50,
  sixty: 60,
  sixtieth: 60,
  seventy: 70,
  seventieth: 70,
  eighty: 80,
  eightieth: 80,
  ninety: 90,
  ninetieth: 90,
};

export const ENGLISH_MAGNITUDE = {
  hundred: 100,
  hundredth: 100,
  thousand: 1000,
  million: 1000000,
  billion: 1000000000,
  trillion: 1000000000000,
  quadrillion: 1000000000000000,
  quintillion: 1000000000000000000,
  sextillion: 1000000000000000000000,
  septillion: 1000000000000000000000000,
  octillion: 1000000000000000000000000000,
  nonillion: 1000000000000000000000000000000,
  decillion: 1000000000000000000000000000000000,
};

export const DUTCH_UNIT = {
  nul: 0,
  eerste: 1,
  één: 1,
  een: 1,
  tweede: 2,
  twee: 2,
  drie: 3,
  dertiende: 13,
  dertien: 13,
  derde: 3,
  vierde: 4,
  veertiende: 14,
  veertien: 14,
  vier: 4,
  vijftiende: 15,
  vijftien: 15,
  vijf: 5,
  vijfde: 5,
  zes: 6,
  zestiende: 16,
  zestien: 16,
  zesde: 6,
  zeventiende: 17,
  zeventien: 17,
  zeven: 7,
  zevende: 7,
  achttiende: 18,
  achttien: 18,
  acht: 8,
  achtste: 8,
  negentiende: 19,
  negentien: 19,
  negende: 9,
  negen: 9,
  tiende: 10,
  tien: 10,
  elfde: 11,
  elf: 11,
  twaalfde: 12,
  twaalf: 12,
};

export const DUTCH_TEN = {
  twintig: 20,
  twintigste: 20,
  dertig: 30,
  dertigste: 30,
  veertig: 40,
  veertigste: 40,
  vijftigste: 50,
  vijftig: 50,
  zestig: 60,
  zestigste: 60,
  zeventig: 70,
  zeventigste: 70,
  tachtigste: 80,
  tachtig: 80,
  negentig: 90,
  negentigste: 90,
};

export const DUTCH_MAGNITUDE = {
  honderd: 100,
  honderdste: 100,
  duizend: 1000,
  miljoen: 1000000,
  miljard: 1000000000,
  biljoen: 1000000000000,
  biljard: 1000000000000000,
  triljoen: 1000000000000000000,
  triljard: 1000000000000000000000,
  quadriljoen: 1000000000000000000000000,
  quadriljard: 1000000000000000000000000000,
  quintiljoen: 1000000000000000000000000000000,
  quintiljard: 1000000000000000000000000000000000,
};

export const GERMAN_UNIT = {
  null: 0,
  ein: 1,
  eins: 1,
  elf: 11,
  zwölf: 12,
  zwei: 2,
  zwo:2,
  dreizehn: 13,
  drei: 3,
  vierzehn: 14,
  vier: 4,
  fünf: 5,
  fünzehn: 15,
  sechs: 6,
  sechzehn: 16,
  siebzehn: 17,
  sieben: 7,
  achtzehn: 18,
  acht: 8,
  neunzehn: 19,
  neun: 9,
  zehn: 10
};

export const GERMAN_TEN = {
  zwanzig: 20,
  dreissig: 30,
  dreißig: 30,
  vierzig: 40,
  fünfzig: 50,
  sechzig: 60,
  siebzig: 70,
  achtzig: 80,
  neunzig: 90,
};

export const GERMAN_MAGNITUDE = {
  hundert: 100,
  tausend: 1000,
  million: 1000000,
  millionen: 1000000,
  milliarde: 1000000000,
  billion: 1000000000000,
  billiarde: 1000000000000000,
  trillion: 1000000000000000000
};

export const NUMBER = {
  ...ENGLISH_UNIT,
  ...ENGLISH_TEN,
  ...ENGLISH_MAGNITUDE,
  ...DUTCH_UNIT,
  ...DUTCH_TEN,
  ...DUTCH_MAGNITUDE,
  ...GERMAN_UNIT,
  ...GERMAN_TEN,
  ...GERMAN_MAGNITUDE,
};

export const UNIT_KEYS = Object.keys({ ...ENGLISH_UNIT, ...DUTCH_UNIT, ...GERMAN_UNIT });
export const TEN_KEYS = Object.keys({ ...ENGLISH_TEN, ...DUTCH_TEN, ...GERMAN_TEN });
export const MAGNITUDE_KEYS = Object.keys({
  ...ENGLISH_MAGNITUDE,
  ...DUTCH_MAGNITUDE,
  ...GERMAN_MAGNITUDE,
});

//@ts-ignore
export const NUMBER_WORDS = [...UNIT_KEYS, ...TEN_KEYS, ...MAGNITUDE_KEYS];

export const JOINERS = ['and', 'en', 'und'];
export const DECIMALS = ['point', 'dot', 'komma', 'punt'];

export const PUNCTUATION = [
  '.',
  ',',
  '\\',
  '#',
  '!',
  '$',
  '%',
  '^',
  '&',
  '/',
  '*',
  ';',
  ':',
  '{',
  '}',
  '=',
  '-',
  '_',
  '`',
  '~',
  '(',
  ')',
  ' ',
];

export enum TOKEN_TYPE {
  UNIT = 'UNIT',
  TEN = 'TEN',
  MAGNITUDE = 'MAGNITUDE',
  DECIMAL = 'DECIMAL',
}

export const ALL_WORDS = [...NUMBER_WORDS, ...JOINERS, ...DECIMALS];

export const BLACKLIST_SINGULAR_WORDS = ['a', 'een'];
export const DUTCH_SPECIFIC_SPLIT = ['en', 'ën'];
export const ENGLISH_SPECIFIC_SPLIT = ['-'];
