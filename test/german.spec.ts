import wordsToNumbers from '../src/index';
import { Languages } from '../src/types';

describe('Convert words to numbers', () => {
  it('dreiunddreißig', () => {
    const words = 'dreiunddreißig';
    const result = wordsToNumbers(words, { language: Languages['de-de'] });
    expect(result).toEqual(33);
  });
  it('vierundvierzig', () => {
    const words = 'vierundvierzig';
    const result = wordsToNumbers(words, { language: Languages['de-de'] });
    expect(result).toEqual(44);
  });
  it('zwei Millionen sechshundertzweiundzwanzigtausenddreihundertachtundachtzig', () => {
    const words =
      'zwei Millionen sechshundertzweiundzwanzigtausenddreihundertachtundachtzig';
    const result = wordsToNumbers(words, { language: Languages['de-de'] });
    expect(result).toEqual(2622388);
  });
  it('zweiundzwanzigtausend', () => {
    const words = 'zweiundzwanzigtausend';
    const result = wordsToNumbers(words, { language: Languages['de-de'] });
    expect(result).toEqual(22000);
  });

  it('fünf Komma siebenundsechzig', () => {
    const words = 'fünf Komma siebenundsechzig';
    const result = wordsToNumbers(words, { language: Languages['de-de'] });
    expect(result).toEqual(5.67);
  });

  it('neun Millionen siebenhundertdreiundsechzigtausendvierhundertvierundvierzig', () => {
    const words = 'neun Millionen siebenhundertdreiundsechzigtausendvierhundertvierundvierzig';
    const result = wordsToNumbers(words, { language: Languages['de-de'] });
    expect(result).toEqual(9763444);
  });
  it('fünf Komma einundzwanzig', () => {
      const words = 'fünf Komma einundzwanzig';
      const result = wordsToNumbers(words, { language: Languages['de-de'] });
      expect(result).toEqual(5.21);
  });
  it('dreihundertundeinundzwanzig', () => {
    const words = 'dreihunderteinundzwanzig';
    const result = wordsToNumbers(words, { language: Languages['de-de'] });
    expect(result).toEqual(321);
});
  it('dreihunderteinundzwanzig', () => {
    const words = 'dreihunderteinundzwanzig';
    const result = wordsToNumbers(words, { language: Languages['de-de'] });
    expect(result).toEqual(321);
});
  it('fünf Millionen vierhunderttausenddreihundertundeinundzwanzig', () => {
      const words = 'fünf Millionen vierhunderttausenddreihundertundeinundzwanzig';
      const result = wordsToNumbers(words, { language: Languages['de-de'] });
      expect(result).toEqual(5400321);
  });

  it('fünf Millionen vierhunderttausenddreihundertundeinundzwanzig und normaler Text sollte eine andere Region wie dies fünfhundertundzwei erstellen', () => {
      const words = 'fünf Millionen vierhunderttausenddreihundertundeinundzwanzig und normaler Text sollte eine andere Region wie dies fünfhundertundzwei erstellen';
      const result = wordsToNumbers(words, { language: Languages['de-de'] });
      expect(result).toEqual('5400321 und normaler Text sollte 1 andere Region wie dies 502 erstellen');
  });

  it('einhundert', () => {
      const words = 'einhundert';
      const result = wordsToNumbers(words, { language: Languages['de-de'] });
      expect(result).toEqual(100);
  });

  it('fünfundzwanzig', () => {
      const words = 'fünfundzwanzig';
      const result = wordsToNumbers(words, { language: Languages['de-de'] });
      expect(result).toEqual(25);
  });

  it('sollte Jahre wie 1998 unterstützen', () => {
      const words = 'neunzehnhundertachtundneunzig';
      const result = wordsToNumbers(words, {
        language: Languages['de-de'],
        oneNumber: true,
      });
      expect(result).toEqual(1998);
  });

  it('Der zweiundzwanzigste Mai', () => {
      const words = 'Der zweiundzwanzigste Mai';
      const result = wordsToNumbers(words, { language: Languages['de-de'] });
      expect(result).toEqual('Der 22 Mai');
  });

  it('neunzehnhundertneunundsechzig', () => {
      const words = 'neunzehnhundertneunundsechzig';
      const result = wordsToNumbers(words, { language: Languages['de-de'] });
      expect(result).toEqual(1969);
  });
  it('fünfter Mai neunzehnhundertneunundneunzig', () => {
      const words = 'fünfter Mai neunzehnhundertneunundneunzig';
      const result = wordsToNumbers(words, { language: Languages['de-de'] });
      expect(result).toEqual('5 Mai 1999');
  });

  it('zweihunderttausend', () => {
      const words = 'zweihunderttausend';
      const result = wordsToNumbers(words, { language: Languages['de-de'] });
      expect(result).toEqual(200000);
  });

  // Fehlschlagende Tests von words-to-numbers

  it('eins dreißigtausend', () => {
      const words = 'eins dreißigtausend';
      const result = wordsToNumbers(words, { language: Languages['de-de'] });
      expect(result).toEqual('1 30000');
  });

  it('einemillionneunhundertachtzigtausend', () => {
      const words = 'einemillionneunhundertachtzigtausend';
      const result = wordsToNumbers(words, { language: Languages['de-de'] });
      expect(result).toEqual(1980000);
  });

  it('einhundertzweitausend', () => {
      const words = 'einhundertzweitausend';
      const result = wordsToNumbers(words, { language: Languages['de-de'] });
      expect(result).toEqual(102000);
  });

  it('einhundertundzweitausend', () => {
      const words = 'einhundertundzweitausend';
      const result = wordsToNumbers(words, { language: Languages['de-de'] });
      expect(result).toEqual(102000);
  });

  // wrong
  // it('neunzehnhundertachtzigtausend', () => {
  //     const words = 'neunzehnhundertachtzigtausend';
  //     const result = wordsToNumbers(words, { language: Languages['de-de'] });
  //     expect(result).toEqual('1980000');
  // });
  
//   it('fünf Komma fünf zwei eins', () => {
//     const words = 'fünf Komma fünf zwei eins';
//     const result = wordsToNumbers(words, { language: Languages['de-de'] });
//     expect(result).toEqual(5.521);
// });
});
