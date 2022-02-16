export const splice = (str: string, index: number, count: number, add: string) => {
  let i = index;
  if (i < 0) {
    i = str.length + i;
    if (i < 0) {
      i = 0;
    }
  }
  return str.slice(0, i) + (add || '') + str.slice(i + count);
};

/**
 * Returns index of all occurences inside the chunk
 * @param chunk piece of text
 * @param occurence piece of text that occurs inside the chunk
 * @returns {number[]}
 */
export const getAllIndexes = (chunk: string, occurence: any): number[] => {
  var indexes = [],
    i = -1;
  while ((i = chunk.indexOf(occurence, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
};
