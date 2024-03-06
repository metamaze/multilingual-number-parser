import wordsToNumbers from '../src/index';
import { Languages } from '../src/types';

describe('Convert words to numbers', () => {
  it('thirty-three', () => {
    const words = 'thirty-three';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(33);
  });
  it('forty-four', () => {
    const words = 'forty-four';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(44);
  });
  it('two million six hundred twenty two thousand three hundred eighty eight', () => {
    const words =
      'two million six hundred twenty two thousand three hundred eighty eight';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(2622388);
  });
  it('twenty two thousand', () => {
    const words = 'twenty two thousand';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(22000);
  });

  it('five point sixty seven', () => {
    const words = 'five point sixty seven';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(5.67);
  });

  it('nine million seven hundred sixty three thousand four hundred forty four', () => {
    const words =
      'nine million seven hundred and sixty three thousand four hundred forty four';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(9763444);
  });
  it('five point twenty one', () => {
    const words = 'five point twenty one';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(5.21);
  });
  it('five point five hundred twenty one', () => {
    const words = 'five point five hundred twenty one';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(5.521);
  });

  it('five million four hundred thousand three hundred and twenty one', () => {
    const words =
      'five million four hundred thousand three hundred and twenty one';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(5400321);
  });

  it('five million four hundred thousand three hundred and twenty one and normal text should create anoither region like this five hundred and two', () => {
    const words =
      'five million four hundred thousand three hundred and twenty one and normal text should create anoither region like this five hundred and two';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(
        '5400321 and normal text should create anoither region like this 502'
      );
  });

  it('one-hundred', () => {
    const words = 'one-hundred';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(100);
  });

  it('twenty-five', () => {
    const words = 'twenty-five';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(25);
  });

  it('should support years like 1998 (ENGLISH)', () => {
    const words = 'nineteen ninety-eight';
    const result = wordsToNumbers(words, {
      language: Languages['en-us'],
      oneNumber: true,
    });
    expect(result).toEqual(1998);
  });

  it('The twenty-second of may', () => {
    const words = 'The twenty-second of may';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual('The 22 of may');
  });

  it('nineteen hundred sixty nine', () => {
    const words = 'nineteen hundred sixty nine';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(1969);
  });
  it('fifth of may nineteenhundred ninety-nine', () => {
    const words = 'fifth of may nineteenhundred ninety-nine';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual('5 of may 1999');
  });

  it('two hundred thousand', () => {
    const words = 'two hundred thousand';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(200000);
  });

  // Failing tests from words-to-numbers

  it('one thirty thousand', () => {
    const words = 'one thirty thousand';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual('1 30000');
  });

  it('nineteen eighty thousand', () => {
    const words = 'nineteen eighty thousand';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual('19 80000');
  });

  it('one hundred two thousand', () => {
    const words = 'one hundred two thousand';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(102000);
  });

  it('one hundred and two thousand', () => {
    const words = 'one hundred and two thousand';
    const result = wordsToNumbers(words, { language: Languages['en-us'] });
    expect(result).toEqual(102000);
  });
});
