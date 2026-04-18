import moment from "moment";
import { describe, expect, it } from "vitest";

describe("Moment.js Integration", () => {
  it("should work with moment", () => {
    const now = moment();
    expect(now.isValid()).toBe(true);
  });

  it("should create moment from timestamp", () => {
    const timestamp = new Date().getTime();
    const momentFromTimestamp = moment(timestamp);
    expect(momentFromTimestamp.isValid()).toBe(true);
  });

  it("should format dates correctly", () => {
    const date = moment("2023-12-25");
    expect(date.format("YYYY-MM-DD")).toBe("2023-12-25");
  });
});
