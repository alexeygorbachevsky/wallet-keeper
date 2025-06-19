export const PASSWORD_VALIDATION_RULES = {
  password: {
    required: "Password is required",
    minLength: {
      value: 1,
      message: "Password cannot be empty",
    },
  },
};