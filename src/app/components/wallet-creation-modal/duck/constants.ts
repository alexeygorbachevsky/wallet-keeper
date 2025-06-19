export const WALLET_VALIDATION_RULES = {
  walletName: {
    maxLength: {
      value: 50,
      message: "Wallet name must be less than 50 characters",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters",
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    },
  },
  confirmPassword: {
    required: "Please confirm your password",
  },
};
