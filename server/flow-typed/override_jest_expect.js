// this file contains definition of toContainDocuments which is not available in npm/jest_*
// name of this file should be listed after jest_* when sorting files so jest expect will be overridden

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
