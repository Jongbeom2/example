export const isNotAuthorizedError = (error) => {
  return (
    error?.networkError?.result?.errors?.[0]?.extensions?.code ===
    'NOT_AUTHORIZED'
  );
};
