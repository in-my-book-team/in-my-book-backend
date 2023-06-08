import type { ResultWithContext } from 'express-validator/src/chain';

export const getHasErrors = (validationResults: ResultWithContext[]): boolean =>
  validationResults
    .map((result) => result.isEmpty())
    .reduce((acc, isEmpty) => {
      if (!isEmpty) return true;
      return acc;
    }, false);
