import { describe, expect, it } from "vitest";

import {
  DEFAULT_FRIENDS,
  normalizeFriendSlug,
  validatePinChange,
  validateStatusInput,
} from "./attendance";

describe("attendance domain rules", () => {
  it("keeps the agreed friend list and slugs stable", () => {
    expect(DEFAULT_FRIENDS).toEqual([
      { name: "Faisal", slug: "faisal" },
      { name: "Alam", slug: "alam" },
      { name: "Raihan", slug: "raihan" },
      { name: "Rozik", slug: "rozik" },
      { name: "Ikbal", slug: "ikbal" },
      { name: "Denar", slug: "denar" },
      { name: "Avatar", slug: "avatar" },
    ]);
  });

  it("normalizes route slugs before looking up friends", () => {
    expect(normalizeFriendSlug(" Faisal ")).toBe("faisal");
    expect(normalizeFriendSlug("RAIHAN")).toBe("raihan");
  });

  it("accepts ready status without a reason", () => {
    expect(validateStatusInput({ status: "ready", reason: "" })).toEqual({
      ok: true,
      status: "ready",
      reason: null,
    });
  });

  it("requires a reason for not ready status", () => {
    expect(validateStatusInput({ status: "not_ready", reason: "" })).toEqual({
      ok: false,
      message: "Alasan wajib diisi kalau Not Ready.",
    });
  });

  it("trims not ready reasons before storing them", () => {
    expect(
      validateStatusInput({ status: "not_ready", reason: "  masih kerja  " }),
    ).toEqual({
      ok: true,
      status: "not_ready",
      reason: "masih kerja",
    });
  });

  it("requires a new PIN of at least four characters", () => {
    expect(validatePinChange({ oldPin: "1234", newPin: "12", repeatPin: "12" })).toEqual({
      ok: false,
      message: "PIN baru minimal 4 karakter.",
    });
  });

  it("requires repeated PIN to match", () => {
    expect(
      validatePinChange({ oldPin: "1234", newPin: "9876", repeatPin: "9870" }),
    ).toEqual({
      ok: false,
      message: "Ulangi PIN baru harus sama.",
    });
  });

  it("accepts valid PIN changes", () => {
    expect(
      validatePinChange({ oldPin: "1234", newPin: "9876", repeatPin: "9876" }),
    ).toEqual({
      ok: true,
      oldPin: "1234",
      newPin: "9876",
    });
  });
});
