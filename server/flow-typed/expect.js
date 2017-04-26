declare function expect(expectation: any): {
  toBeFalsy: Function,
  toBeTruthy: Function,
  toEqual: Function,
  toMatch(regexpToMatch: string): Function,
  not: Function,
  toBe: Function,
  toContain: Function,
  toContainDocuments: Function
};
