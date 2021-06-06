export const isNotAuthorizedError = (error) => {
  return (
    error?.networkError?.result?.errors?.[0]?.extensions?.code ===
    'NOT_AUTHORIZED'
  );
};

export const isNotAuthorizedErrorSubscription = (error) => {
  return error?.message.includes('NOT_AUTHORIZED');
};
