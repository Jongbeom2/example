export const isNotAuthorizedError = (error) => {
  return (
    error?.networkError?.result?.errors?.[0]?.extensions?.code ===
    'NOT_AUTHORIZED'
  );
};

export const isNotAuthorizedErrorSubscription = (error) => {
  return error?.message?.split(
    'Context creation failed: Context creation failed: Context creation failed: Context creation failed: Context creation failed: Context creation failed: Context creation failed: ',
  )[1];
};
