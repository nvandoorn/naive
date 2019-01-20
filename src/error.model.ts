export enum NaiveErrorCode {
  UNCAUGHT = 0,
  OUT_OF_SPACE
}

const e = NaiveErrorCode;

export const lookupMsg = (c: NaiveErrorCode) => {
  switch (c) {
    case e.OUT_OF_SPACE:
      return `Out of storage space (too big for in memory buffer)`;
    case e.UNCAUGHT:
    default:
      return `Uncaught error. Please add message/code in src/error.model.ts`;
  }
};

export class NaiveError extends Error {
  constructor(public code: NaiveErrorCode) {
    super(lookupMsg(code));
  }
}
