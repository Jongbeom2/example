export const isNotAuthorizedError = error => {
  return error?.message === 'NOT_AUTHORIZED';
};
