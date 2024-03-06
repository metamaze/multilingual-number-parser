import { wordsToNumbers } from '../src/index';
import { Languages } from '../src/types';

describe('Convert words to numbers', () => {
  it('drieëndertig', () => {
    const words = 'drieëndertig';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(33);
  });
  it('vierenveertig', () => {
    const words = 'vierenveertig';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(44);
  });
  it('twee miljoen zes honderd tweeëntwintig duizend drie honderd achtentachtig', () => {
    const words =
      'twee miljoen zes honderd tweeëntwintig duizend drie honderd achtentachtig';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(2622388);
  });
  it('tweeëntwintig duizend', () => {
    const words = 'tweeëntwintig duizend';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(22000);
  });
  it('vijf komma zevenenzestig', () => {
    const words = 'vijf komma zevenenzestig';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(5.67);
  });

  it('negen miljoen zeven honderd drieënzestig duizend vier honderd vierenveertig', () => {
    const words =
      'negen miljoen zeven honderd drieënzestig duizend vier honderd vierenveertig';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(9763444);
  });
  it('vijf punt eenentwintig', () => {
    const words = 'vijf punt eenentwintig';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(5.21);
  });
  it('vijf komma vijf honderd eenentwintig', () => {
    const words = 'vijf komma vijf honderd eenentwintig';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(5.521);
  });
  it('vijf miljoen vier honderd duizend drie honderd eenentwintig', () => {
    const words = 'vijf miljoen vier honderd duizend drie honderd eenentwintig';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(5400321);
  });
  it('vijf miljoen vier honderd duizend drie honderd eenentwintig en normale text creeert een nieuwe regio zoals vijf honderd en twee', () => {
    const words =
      'vijf miljoen vier honderd duizend drie honderd eenentwintig en normale text creeert een nieuwe regio zoals vijf honderd en twee';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual('5400321 en normale text creeert 1 nieuwe regio zoals 502');
  });
  it('één honderd', () => {
    const words = 'één honderd';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(100);
  });

  it('vijfentwintig', () => {
    const words = 'vijfentwintig';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(25);
  });
  it('jaartal negentien achtennegentig', () => {
    const words = 'negentien achtennegentig';
    const result = wordsToNumbers(words, {
      language: Languages['nl-nl'],
      oneNumber: true,
    });
    expect(result).toEqual(1998);
  });

  it('tweeëntwintigste mei', () => {
    const words = 'tweeëntwintigste mei';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual('22 mei');
  });

  it('negentienhonderd negenenzestig', () => {
    const words = 'negentienhonderd negenenzestig';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(1969);
  });
  it('vijfde mei negentienhonderd negenennegentig', () => {
    const words = 'vijfde mei negentienhonderd negenennegentig';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual('5 mei 1999');
  });
  it('drieënnegentig', () => {
    const words = 'drieënnegentig';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(93);
  });
  it('tweehonderddrieëndertig', () => {
    const words = 'tweehonderddrieëndertig';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(233);
  });
  it('tweehonderdduizend', () => {
    const words = 'tweehonderdduizend';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(200000);
  });

  it('vijftienhonderd', () => {
    const words = 'vijftienhonderd';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(1500);
  });
  it('driehonderdvijftien', () => {
    const words = 'driehonderdvijftien';
    const result = wordsToNumbers(words, { language: Languages['nl-nl'] });
    expect(result).toEqual(315);
  });
});
