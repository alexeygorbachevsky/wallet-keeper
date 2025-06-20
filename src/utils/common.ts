export const sleep = (ms = 0) =>
  new Promise(resolve => {
    setTimeout(resolve, 0, ms);
  });

export const getPasswordStrength = (
  password: string
): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;

  if (password.length >= 8) {
    score++;
  }
  if (password.length >= 12) {
    score++;
  }
  if (/[a-z]/.test(password)) {
    score++;
  }
  if (/[A-Z]/.test(password)) {
    score++;
  }
  if (/\d/.test(password)) {
    score++;
  }
  if (/[^a-zA-Z\d]/.test(password)) {
    score++;
  }

  if (score <= 2) {
    return { score, label: "Weak", color: "#dc2626" };
  }
  if (score <= 4) {
    return { score, label: "Medium", color: "#f59e0b" };
  }

  return { score, label: "Strong", color: "#10b981" };
};
