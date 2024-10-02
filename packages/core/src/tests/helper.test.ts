import * as helper from "../helper";

describe('isValidQueryParams Tests', () => {
  test('should handle missing params', async () => {
    expect(helper.isValidQueryParams('', 'asdf', ['asdf'])).toBeFalsy();
    expect(helper.isValidQueryParams('asfd', '', ['asdf'])).toBeFalsy();
    expect(helper.isValidQueryParams('asdf', 'asdf', [])).toBeFalsy();
  });

  test('should handle no missing params', async () => {    
    expect(helper.isValidQueryParams('asdf', 'asdf', ['asdf'])).toBeTruthy();
  });
});

describe('getUniqueStringsFromList Tests', () => {
  test('should handle merging lists', async () => {
    expect(helper.getUniqueStringsFromList(['a'])).toStrictEqual(['a']);
    expect(helper.getUniqueStringsFromList([])).toStrictEqual([]);
    expect(helper.getUniqueStringsFromList(['abc', 'abc', 'abc', 'def'])).toStrictEqual(['abc', 'def']);
  });
});

describe('isValidEmailLength Tests', () => {
  test('should check list length', async () => {
    expect(helper.isValidEmailLength(['a'])).toBeTruthy();
    expect(helper.isValidEmailLength([])).toBeTruthy();
    expect(helper.isValidEmailLength(['abc', 'abc', 'abc', 'def'])).toBeFalsy();
  });
});
