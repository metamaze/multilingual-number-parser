import chai from 'chai';
import wordsToNumbers from '../src/index';
import { Languages } from '../src/types';

describe('Convert words to numbers', () => {
  it('trinta e três', () => {
    const words = 'trinta e três';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal(33);
  });
  it('quarenta e quatro', () => {
    const words = 'quarenta e quatro';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal(44);
  });
  it('dois milhões seiscentos e vinte e dois mil trezentos e oitenta e oito', () => {
    const words =
      'dois milhões seiscentos e vinte e dois mil trezentos e oitenta e oito';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal(2622388);
  });
  it('vinte e dois mil', () => {
    const words = 'vinte e dois mil';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal(22000);
  });

  it('cinco vírgula sessenta e sete', () => {
    const words = 'cinco vírgula sessenta e sete';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal(5.67);
  });

  it('nove milhões setecentos e sessenta e três mil quatrocentos e quarenta e quatro', () => {
    const words =
      'nove milhões setecentos e sessenta e três mil quatrocentos e quarenta e quatro';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal(9763444);
  });
  it('cinco vírgula vinte e um', () => {
    const words = 'cinco vírgula vinte e um';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal(5.21);
  });
  it('cinco vírgula quinhentos e vinte e um', () => {
    const words = 'cinco vírgula quinhentos e vinte e um';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal(5.521);
  });

  it('cinco milhões quatrocentos mil trezentos e vinte e um', () => {
    const words =
      'cinco milhões quatrocentos mil trezentos e vinte e um';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal(5400321);
  });

  it('cinco milhões quatrocentos mil trezentos e vinte e texto normal deveria criar outra região como essa quinhentos e dois', () => {
    const words =
      'cinco milhões quatrocentos mil trezentos e vinte e texto normal deveria criar outra região como essa quinhentos e dois';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai
      .expect(result)
      .to.equal(
        '5400320 e texto normal deveria criar outra região como essa 502'
      );
  });

  it('cem', () => {
    const words = 'cem';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal(100);
  });

  it('11111', () => {
    const words = 'onze mil cento e onze';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal(11111);
  });

  it('Os décimos terceiros salários', ()=> {
    const words = 'Os décimos terceiros salários';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal('Os 13 salários');
  });

  it('vinte e cinco', () => {
    const words = 'vinte e cinco';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal(25);
  });

  it('vigésima segunda imperatriz', () => {
    const words = 'vigésima segunda imperatriz';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal('22 imperatriz');
  });

  it('quinto dia de maio de mil novecentos e noventa e nove', () => {
    const words = 'quinto dia de maio de mil novecentos e noventa e nove';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal('5 dia de maio de 1999');
  });

  it('duzentos mil', () => {
    const words = 'duzentos mil';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal(200000);
  });

  it('dois trilhões quatrocentos e noventa e sete bilhões cem milhões quinhentos e vinte e dois mil trezentos e oitenta e oito', () => {
    const words = 'dois trilhões quatrocentos e noventa e sete bilhões cem milhões quinhentos e vinte e dois mil trezentos e oitenta e oito';
    const result = wordsToNumbers(words, { language: Languages['pt-br'] });
    chai.expect(result).to.equal(2497100522388)
  })
});
