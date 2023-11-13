import {
  DUTCH_MAGNITUDE,
  DUTCH_TEN,
  DUTCH_UNIT,
  ENGLISH_MAGNITUDE,
  ENGLISH_SPECIFIC_SPLIT,
  ENGLISH_TEN,
  ENGLISH_UNIT,
  PORTUGUESE_MAGNITUDE,
  PORTUGUESE_TEN,
  PORTUGUESE_UNIT,
  TOKEN_TYPE,
} from './constants';
import { getAllIndexes } from './util';

type Possibility = {
  start: number;
  end: number;
  type: TOKEN_TYPE | 'splitter';
  value: string;
};

/**
 * Calculates all possible number occurrences in the chunk
 *
 * @param possibleUnits Language specific units
 * @param possibleTens Language specific tens
 * @param possibleHundreds Language specific hundreds
 * @param possibleMagnitudes Language specific magnitudes
 * @param chunk A piece of the text
 * @returns {Possibility[]}
 */
function calculatePossibilities(
  possibleUnits: string[],
  possibleTens: string[],
  possibleHundreds: string[],
  possibleMagnitudes: string[],
  chunk: string
): Possibility[] {
  const possibilities: Possibility[] = [];
  possibleUnits.forEach(possibility => {
    const indexes = getAllIndexes(chunk, possibility);
    indexes.forEach(start => {
      const end = start + possibility.length - 1;
      possibilities.push({
        start,
        end,
        type: TOKEN_TYPE.UNIT,
        value: possibility,
      });
    });
  });

  possibleTens.forEach(possibility => {
    const indexes = getAllIndexes(chunk, possibility);
    indexes.forEach(start => {
      const end = start + possibility.length - 1;
      possibilities.push({
        start,
        end,
        type: TOKEN_TYPE.TEN,
        value: possibility,
      });
    });
  });

  possibleHundreds.forEach(possibility => {
    const indexes = getAllIndexes(chunk, possibility);
    indexes.forEach(start => {
      const end = start + possibility.length - 1;
      possibilities.push({
        start,
        end,
        type: TOKEN_TYPE.HUNDRED,
        value: possibility,
      });
    });
  });

  possibleMagnitudes.forEach(possibility => {
    const indexes = getAllIndexes(chunk, possibility);
    indexes.forEach(start => {
      const end = start + possibility.length - 1;
      possibilities.push({
        start,
        end,
        type: TOKEN_TYPE.MAGNITUDE,
        value: possibility,
      });
    });
  });
  return possibilities;
}

/**
 * Calculates the best 2 possibilties, based on the assumption that there are always two numbers, one at the start and one at the end.
 *
 * @param possibilities All possibilities that are in the chunk
 * @param chunk Piece of the whole text
 * @object { Possibility, Possibility }
 * @property {Possibility} longestStart
 * @property {Possibility} longestEnd
 */
function predict(
  possibilities: Possibility[],
  chunk: string
): { longestStart: Possibility; longestEnd: Possibility } {
  let startingPossibilities: Possibility[] = [];
  let endingPossibilities: Possibility[] = [];
  //@ts-ignore
  let longestStart: Possibility = null;
  //@ts-ignore
  let longestEnd: Possibility = null;

  possibilities.forEach(possibility => {
    let start: boolean = false;
    let end: boolean = false;

    if (possibility.start === 0) {
      start = true;
      startingPossibilities.push(possibility);
    }
    if (possibility.end === chunk.length - 1) {
      end = true;
      endingPossibilities.push(possibility);
    }
    //Longest starting possibility
    if (
      start &&
      (longestStart?.value!.length ?? 0) < possibility.value.length
    ) {
      longestStart = possibility;
    }
    //Longest ending possibility
    if (end && (longestEnd?.value!.length ?? 0) < possibility.value.length) {
      longestEnd = possibility;
    }
  });
  return { longestStart, longestEnd };
}

/**
 * Changes the lexicongraphy of dutch chunks so the compiler understands which number
 * Much more difficult then the english modifiers since dutch has multiple numbers in a piece of text
 * @param chunk a piece of the entire string
 * @returns {string | string[]} if string it's the original chunk, otherwise if string[] it's a uncompatible string made compatible
 */
//@ts-ignore
export const modifyDutch = (chunk: string): string | string[] => {
  //@ts-ignore
  const units = [...Object.keys(DUTCH_UNIT)];
  const tens = [...Object.keys(DUTCH_TEN)];
  const magnitudes = [...Object.keys(DUTCH_MAGNITUDE)];

  if (
    units.includes(chunk) ||
    tens.includes(chunk) ||
    magnitudes.includes(chunk)
  ) {
    return chunk; //This chunk is already a whole number that doesnt need converting
  }

  const possibleUnits: string[] = units.filter(unit => chunk.includes(unit));
  const possibleTens: string[] = tens.filter(unit => chunk.includes(unit));
  const possibleMagnitudes: string[] = magnitudes.filter(unit =>
    chunk.includes(unit)
  );

  const possibilities: Possibility[] = calculatePossibilities(
    possibleUnits,
    possibleTens,
    [],
    possibleMagnitudes,
    chunk
  );
  let numbers: Possibility[] = [];

  // Filter out smaller units
  for (const possibility of possibilities) {
    switch (possibility.type) {
      case TOKEN_TYPE.UNIT: {
        // vijftien but contains 2 units: vijf and tien
        // twinigste but contains twintig and twintigste itself
        const nested = possibilities.find(p => {
          return (
            p.value !== possibility.value &&
            p.start <= possibility.start &&
            p.end >= possibility.end
          );
        });
        if (!nested) {
          numbers.push(possibility);
        }
        break;
      }
      case TOKEN_TYPE.TEN: {
        // twinigste has priority over twintig, filter out twintig
        const hasAdjective = possibilities.find(p => {
          return (
            p.value.includes(possibility.value) &&
            p.start === possibility.start &&
            p.end > possibility.end
          );
        });
        if (!hasAdjective) numbers.push(possibility);
        break;
      }
      default:
        numbers.push(possibility);
        break;
    }
  }

  numbers = numbers.sort((a, b) => {
    return a.start - b.start;
  });

  // Place numbers in english lexicongraphic order
  // EXPECTED OUTPUT:
  // UNIT + MAGNITUDE
  // TEN + UNIT
  // dutch examples:
  // driehonderd = drie honderd
  // vijfendertig = dertig vijf
  // tweehonderdduizendvierendertig = twee honderd duizend dertig vier
  const result: string[] = [];
  for (let i = 0; i < numbers.length; i++) {
    const previous = numbers[i - 1];
    const next = numbers[i + 1];
    const number = numbers[i];
    if (!previous) {
      if (
        number.type === TOKEN_TYPE.UNIT &&
        next.type === TOKEN_TYPE.MAGNITUDE
      ) {
        result.push(number.value);
      } else if (
        number.type === TOKEN_TYPE.UNIT &&
        next.type === TOKEN_TYPE.TEN
      ) {
        result.push(next.value);
      } else {
        result.push(number.value);
      }
    } else {
      if (number.type === TOKEN_TYPE.TEN && previous.type === TOKEN_TYPE.UNIT) {
        result.push(previous.value);
      } else if (
        number.type === TOKEN_TYPE.MAGNITUDE &&
        previous.type === TOKEN_TYPE.UNIT
      ) {
        result.push(number.value);
      } else if (
        number.type === TOKEN_TYPE.UNIT &&
        next &&
        next.type === TOKEN_TYPE.TEN
      ) {
        result.push(next.value);
      } else result.push(number.value);
    }
  }
  return result;
};

/**
 * Changes the lexicongraphy of english chunks so the compiler understands which number
 *  This works perfectly since english numbers have maximum '2' numbers in a piece of text.
 * @param chunk a piece of the entire string
 * @returns {string | string[]} if string it's the original chunk, otherwise if string[] it's a uncompatible string made compatible
 */
//@ts-ignore
export const modifyEnglish = (chunk: string): string | string[] => {
  const units = [...Object.keys(ENGLISH_UNIT)];
  const tens = [...Object.keys(ENGLISH_TEN)];
  const magnitudes = [...Object.keys(ENGLISH_MAGNITUDE)];

  if (
    units.includes(chunk) ||
    tens.includes(chunk) ||
    magnitudes.includes(chunk)
  ) {
    return chunk; //This chunk is already a whole number that doesnt need converting
  }

  const possibleUnits: string[] = units.filter(unit => chunk.includes(unit));
  const possibleTens: string[] = tens.filter(unit => chunk.includes(unit));
  const possibleMagnitudes: string[] = magnitudes.filter(unit =>
    chunk.includes(unit)
  );

  const possibilities: Possibility[] = calculatePossibilities(
    possibleUnits,
    possibleTens,
    [],
    possibleMagnitudes,
    chunk
  );
  //Check which possibilities DO NOT OVERLAP and are valid.
  if (possibilities.length >= 2) {
    const { longestStart, longestEnd } = predict(possibilities, chunk);
    if (!longestStart || !longestEnd) return [];
    //Pick possibilities with shortest distance between start and end
    if (longestStart.end === longestEnd.start - 1) {
      //No Splitter in this chunk
      return [longestStart.value, longestEnd.value];
    } else {
      // ! IMPORTANT: ENGLISH SPECIFIC SPLITTERS
      //Splitter in this chunk
      //@ts-ignore
      let possibleSplitter: Possibility = null;
      const possible = ENGLISH_SPECIFIC_SPLIT.some(splitter => {
        const index = chunk.indexOf(splitter, longestStart.end);
        if (index !== -1) {
          possibleSplitter = {
            start: index,
            end: index + splitter.length - 1,
            type: 'splitter',
            value: splitter,
          };
          return (
            longestStart.start === 0 &&
            longestStart.end < possibleSplitter.start &&
            possibleSplitter.end < longestEnd.start &&
            longestEnd.end === chunk.length - 1
          );
        }
        return false;
      });

      if (possible) {
        //Perfect match
        // ! ENGLISH SPECIFIC
        if (
          longestStart.type === TOKEN_TYPE.TEN &&
          longestEnd.type === TOKEN_TYPE.UNIT
        )
          return [longestStart.value, longestEnd.value];
        if (
          longestStart.type === TOKEN_TYPE.UNIT &&
          longestEnd.type === TOKEN_TYPE.MAGNITUDE
        )
          return [longestStart.value, longestEnd.value];
      } else {
        console.log(longestStart, longestEnd, possibleSplitter, chunk);
        throw 'CANNOT PARSE CHUNK INTO NUMBER (ENGLISH: CANNOT FIND A GOOD SPLITTER)';
      }
    }
  }
};

export const modifyPortuguese = (chunk: string): string | string[] | undefined => {
  const units = [...Object.keys(PORTUGUESE_UNIT)];
  const tens = [...Object.keys(PORTUGUESE_TEN)];
  const magnitudes = [...Object.keys(PORTUGUESE_MAGNITUDE)];
  const hundreds = [...Object.keys(PORTUGUESE_UNIT)];

  if (
    units.includes(chunk) ||
    tens.includes(chunk) ||
    hundreds.includes(chunk) ||
    magnitudes.includes(chunk)
  ) {
    return chunk; //This chunk is already a whole number that doesnt need converting
  }

  const possibleUnits: string[] = units.filter(unit => chunk.includes(unit));
  const possibleTens: string[] = tens.filter(ten => chunk.includes(ten));
  const possibleHundreds: string[] = hundreds.filter(hundred => chunk.includes(hundred));
  const possibleMagnitudes: string[] = magnitudes.filter(unit =>
    chunk.includes(unit)
  );

  const possibilities: Possibility[] = calculatePossibilities(
    possibleUnits,
    possibleTens,
    possibleHundreds,
    possibleMagnitudes,
    chunk
  );
  //Check which possibilities DO NOT OVERLAP and are valid.
  if (possibilities.length >= 2) {
    const { longestStart, longestEnd } = predict(possibilities, chunk);
    if (!longestStart || !longestEnd) return [];
    //Pick possibilities with shortest distance between start and end
    if (longestStart.end === longestEnd.start - 1) {
      //No Splitter in this chunk
      return [longestStart.value, longestEnd.value];
    } else {
      // ! IMPORTANT: ENGLISH SPECIFIC SPLITTERS
      //Splitter in this chunk
      //@ts-ignore
      let possibleSplitter: Possibility = null;
      const possible = ENGLISH_SPECIFIC_SPLIT.some(splitter => {
        const index = chunk.indexOf(splitter, longestStart.end);
        if (index !== -1) {
          possibleSplitter = {
            start: index,
            end: index + splitter.length - 1,
            type: 'splitter',
            value: splitter,
          };
          return (
            longestStart.start === 0 &&
            longestStart.end < possibleSplitter.start &&
            possibleSplitter.end < longestEnd.start &&
            longestEnd.end === chunk.length - 1
          );
        }
        return false;
      });

      if (possible) {
        //Perfect match
        // ! ENGLISH SPECIFIC
        if (
          longestStart.type === TOKEN_TYPE.TEN &&
          longestEnd.type === TOKEN_TYPE.UNIT
        )
          return [longestStart.value, longestEnd.value];
        if (
          longestStart.type === TOKEN_TYPE.UNIT &&
          longestEnd.type === TOKEN_TYPE.MAGNITUDE
        )
          return [longestStart.value, longestEnd.value];
      } else {
        console.log(longestStart, longestEnd, possibleSplitter, chunk);
        throw 'CANNOT PARSE CHUNK INTO NUMBER (ENGLISH: CANNOT FIND A GOOD SPLITTER)';
      }
    }
  }
  return;
};



// ! MY FIRST VERSION, KINDA WORKED BUT UNREADBLE PIECE OF GARABGE, SHOULD KEEP IT FOR REFERENCE/FUTURE
// /**
//  * Custom made, never part of the original package.
//  * All languages have their own lexicongraphy. More specific, languages has their own 'order' of words for numbers.
//  * @example 'english' = twenty five | 'dutch' = vijfentwintig (literally: five and twenty  )
//  * The compiler can only compile numbers that follow the lexicongraphy of english so all chunks needs to be adapted so it can be compiled.
//  *
//  * @param {string} uncompatible a string that can possibly be converted
//  * @param {Languages} language the language we have to use to make the string compatible
//  */
//  const modifyLexicography = (uncompatible: string, language: Languages): string | string[] => {
//     let unitKey;
//     let tenKey;
//     let magnitudeKey;
//     let splitters: string[];
//     // PART 1: Setting everything up based on language
//     switch (language) {
//       // DUTCH CONVERSIONS:
//       // tweeëntwintig , the 'ën' is a splitter + need to rearrange the splitted outcome
//       // vierentwintig , the 'en' is a splitter + need to rearrange the splitted outcome
//       case Languages['nl-nl']:
//         unitKey = DUTCH_UNIT;
//         tenKey = DUTCH_TEN;
//         magnitudeKey = DUTCH_MAGNITUDE; // never occurs -> tweeëndertig does, but tweeënhonderd doesnt (en/ën = splitter)
//         splitters = DUTCH_SPECIFIC_SPLIT;
//         break;
//       // twenty-five , the '-' is a splitter, does not need a rearrangement
//       // one-hundred, the '-' is a splitter, does not need a rearrangement
//       case Languages['en-us']:
//         unitKey = ENGLISH_UNIT;
//         tenKey = ENGLISH_TEN;
//         magnitudeKey = ENGLISH_MAGNITUDE; // does occur in contrary to nl -> two-hundred (- = splitter)
//         splitters = ENGLISH_SPECIFIC_SPLIT;
//         break;
//       default:
//         //English will be the default modifier
//         unitKey = ENGLISH_UNIT;
//         tenKey = ENGLISH_TEN;
//         magnitudeKey = ENGLISH_MAGNITUDE;
//         splitters = ENGLISH_SPECIFIC_SPLIT;
//         break;
//     }
//     // PART 2: check which numbers the passed string contains and if it can be made compatible based on 'indexOf'
//     const units = [...Object.keys(unitKey)];
//     const tens = [...Object.keys(tenKey)];
//     let magnitudes;
//     if (magnitudeKey) {
//       magnitudes = [...Object.keys(magnitudeKey)];
//     }
//     let containsUnit: string = units.find(unit => uncompatible.includes(unit));
//     let containsTen: string = tens.find(ten => uncompatible.includes(ten));
//     let containsMagnitude: string = '';
//     if (magnitudes) {
//       containsMagnitude = magnitudes.find(magnitude => uncompatible.includes(magnitude));
//     }
//     if (
//       (containsTen || containsMagnitude) &&
//       containsUnit &&
//       !(tens.includes(uncompatible) || magnitudes.includes(uncompatible)) &&
//       !units.includes(uncompatible)
//     ) {
//       let startPart1 = uncompatible.indexOf(containsUnit);
//       let endPart1 = startPart1 + containsUnit.length - 1;
//       let startPart2 = containsTen ? uncompatible.indexOf(containsTen) : uncompatible.indexOf(containsMagnitude);
//       let endPart2 = containsTen ? startPart2 + containsTen.length - 1 : startPart2 + containsMagnitude.length - 1;
//       // PART 3: number inside a number is never allowed. for example: 'thousANd' contains the number 'thousand'and 'an'
//       //Checking if found unit is the right one, otherwise try to find another unit/ten/magnitude. Example: negenzestig -> unit found zes instead of negen
//       //Checking on the indexes of start/end makes sure we get the right unit (no overlaps).
//       while ((startPart1 >= startPart2 && endPart1 <= endPart2) || (startPart2 >= startPart1 && endPart2 <= endPart1)) {
//         if (startPart1 >= startPart2 && endPart1 <= endPart2) {
//           containsUnit = units.find(unit => uncompatible.includes(unit) && unit !== containsUnit);
//           if (containsUnit) {
//             startPart1 = uncompatible.indexOf(containsUnit);
//             endPart1 = startPart1 + containsUnit.length - 1;
//           } else {
//             containsUnit = units.find(unit => uncompatible.includes(unit) && unit);
//             startPart1 = uncompatible.indexOf(containsUnit, 1);
//             startPart1 + containsUnit.length - 1;
//           }
//         } else if (startPart2 >= startPart1 && endPart2 <= endPart1) {
//           containsTen = tens.find(ten => uncompatible.includes(ten) && ten !== containsTen);
//           containsMagnitude = magnitudes.find(
//             magnitude => uncompatible.includes(magnitude) && magnitude !== containsMagnitude
//           );
//           if (containsTen || containsMagnitude) {
//             startPart2 = containsTen ? uncompatible.indexOf(containsTen) : uncompatible.indexOf(containsMagnitude);
//             endPart2 = containsTen ? startPart2 + containsTen.length - 1 : startPart2 + containsMagnitude.length - 1;
//           } else {
//             containsTen = tens.find(ten => uncompatible.includes(ten));
//             containsMagnitude = magnitudes.find(magnitude => uncompatible.includes(magnitude));
//             startPart2 = containsTen ? uncompatible.indexOf(containsTen, 1) : uncompatible.indexOf(containsMagnitude, 1);
//             endPart2 = containsTen ? startPart2 + containsTen.length - 1 : startPart2 + containsMagnitude.length - 1;
//           }
//         }
//       }
//       //SKIP SPLITTERS, JUST SPLIT THE WORD IN TWO.
//       if (endPart1 + 1 === startPart2) {
//         if (containsMagnitude && containsUnit) {
//           return [uncompatible.slice(startPart1, endPart1 + 1), uncompatible.slice(startPart2, endPart2 + 1)];
//         } else {
//           console.warn('DO NOT REMOVE WARNING: THIS IS LOGGED ON : ', uncompatible);
//           return [uncompatible.slice(startPart2, endPart2 + 1), uncompatible.slice(startPart1, endPart1 + 1)];
//         }
//       }
//       let splitIndex = -1;
//       // PART 4: Iterate over every splitter to see if the uncompatible string can be made compatible
//       splitters.some(splitter => {
//         if (splitIndex === -1) {
//           // one-hundred and twenty-five are arranged differently, so we need to double check where the splitter occurs (after the unit or magnitude or ten)
//           const temp = uncompatible.indexOf(splitter, endPart1 + 1);
//           if (temp === -1) splitIndex = uncompatible.indexOf(splitter, endPart2 + 1);
//           else splitIndex = temp;
//         } else {
//           return true;
//         }
//       });
//       // PART 5: return the correctly arranged compatible string
//       if ((splitIndex > endPart1 && splitIndex < startPart2) || (splitIndex > endPart2 && splitIndex < endPart1)) {
//         if (containsMagnitude && containsUnit) {
//           return [uncompatible.slice(startPart1, endPart1 + 1), uncompatible.slice(startPart2, endPart2 + 1)];
//         } else {
//           return [uncompatible.slice(startPart2, endPart2 + 1), uncompatible.slice(startPart1, endPart1 + 1)];
//         }
//       } else {
//         throw 'WORD TO NUMBER: Cannot make string compatible.';
//       }
//     }
//     return uncompatible;
//   };
