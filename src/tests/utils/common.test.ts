import { describe, it, expect } from "vitest";

import { getPasswordStrength } from "utils/common";

describe.concurrent("getPasswordStrength", () => {
  it("should return weak strength for short passwords", () => {
    const result = getPasswordStrength("abc");

    expect(result).toEqual({
      score: 1,
      label: "Weak",
      color: "#dc2626",
    });
  });

  it("should return medium strength for passwords with mixed character types", () => {
    const result = getPasswordStrength("Password123");

    expect(result).toEqual({
      score: 4,
      label: "Medium",
      color: "#f59e0b",
    });
  });

  it("should return strong strength for complex passwords", () => {
    const result = getPasswordStrength("Strong$1Password");

    expect(result).toEqual({
      score: 6,
      label: "Strong",
      color: "#10b981",
    });
  });
});
