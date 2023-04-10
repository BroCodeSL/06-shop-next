export const isValidEmail = (email: string): boolean => {
  const match = String(email)
    .toLowerCase()
    .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);

  return !!match;
};

export const isEmail = (email: string): string | undefined => {
  return isValidEmail(email) ? undefined : "The email does not seem to be valid";
};
