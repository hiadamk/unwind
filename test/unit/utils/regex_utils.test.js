const regex_utils = require('../../../src/utils/regex_utils');

describe('getTweetId', () => {
  test('Tweet Id is retrieved from basic valid tweet url', () => {
    const mockUrl = 'https://twitter.com/Adele/status/1199448948404035590';

    const expected = '1199448948404035590';

    const result = regex_utils.getTweetId(mockUrl);

    expect(result).toEqual(expected);
  });

  test('Tweet Id is retrieved from valid tweet url with  s parameter', () => {
    const mockUrl = 'https://twitter.com/Adele/status/1199448948404035590?s=12';

    const expected = '1199448948404035590';

    const result = regex_utils.getTweetId(mockUrl);

    expect(result).toEqual(expected);
  });


  test('Invalid tweet url returns null', () => {
    const mockUrl = 'https://twitter.com/Adele/status/';

    const expected = null;

    const result = regex_utils.getTweetId(mockUrl);

    expect(result).toEqual(expected);
  });

});


describe('replaceAll', () => {

  test('Url in string is replaced', () => {
    const mockText = 'https://www.google.com/apple is my fav place to start my day.';

    const replacement = 'Twitter'

    const expected = replacement + ' is my fav place to start my day.'

    const result = regex_utils.replaceAll(mockText, 'https://www.google.com/apple', replacement);

    expect(result).toEqual(expected);

  });

  test('Hashtag in string is replaced', () => {

    const original = '#Winning'

    const mockText = original + ' is my favourite pass-time';

    const replacement = 'Eating fruit'

    const expected = replacement + ' is my favourite pass-time';

    const result = regex_utils.replaceAll(mockText, original, replacement);

    expect(result).toEqual(expected)
  });

  test('Symbol in string is replaced', () => {

    const original = '$AAPL'

    const mockText = original + ' IS THE BEST STOCK AT THEM MOMEMNT ' + original + ' AT ALL TIME HIGH';

    const replacement = 'APPLE'

    const expected = replacement + ' IS THE BEST STOCK AT THEM MOMEMNT ' + replacement + ' AT ALL TIME HIGH';

    const result = regex_utils.replaceAll(mockText, original, replacement);

    expect(result).toEqual(expected)
  });


});