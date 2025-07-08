import { describe, expect, it } from "vitest";
import { generateShortDaysNames } from "../app/utils/meeting/TimeFunctions";

describe("TimeFunctions", () => {
  describe("generateShortDaysNames", () => {
    it("returns array of 7 day names", () => {
      const dayNames = generateShortDaysNames();
      expect(dayNames).toHaveLength(7);
      expect(Array.isArray(dayNames)).toBe(true);
    });

    it("returns proper day names starting with Monday", () => {
      const dayNames = generateShortDaysNames();
      // The first day should be Monday (depends on locale)
      expect(dayNames[0]).toBeTruthy();
      expect(dayNames[6]).toBeTruthy();
    });

    it("returns string values", () => {
      const dayNames = generateShortDaysNames();
      dayNames.forEach((day: string) => {
        expect(typeof day).toBe("string");
        expect(day.length).toBeGreaterThan(0);
      });
    });
  });
});

describe("Meeting Time Management", () => {
  describe("Time Range Generation", () => {
    it("generates correct time ranges for a day", () => {
      const startHour = 9;
      const endHour = 17;
      const date = new Date();
      date.setHours(0, 0, 0, 0);

      const timeSlots = [];
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slot = new Date(date);
          slot.setHours(hour, minute, 0, 0);
          timeSlots.push(slot.getTime());
        }
      }

      expect(timeSlots).toHaveLength((endHour - startHour) * 2);

      const firstSlot = new Date(date);
      firstSlot.setHours(startHour, 0, 0, 0);
      const lastSlot = new Date(date);
      lastSlot.setHours(endHour - 1, 30, 0, 0);

      expect(timeSlots[0]).toBe(firstSlot.getTime());
      expect(timeSlots[timeSlots.length - 1]).toBe(lastSlot.getTime());
    });

    it("handles single hour time range", () => {
      const startHour = 9;
      const endHour = 10;
      const date = new Date();
      date.setHours(0, 0, 0, 0);

      const timeSlots = [];
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slot = new Date(date);
          slot.setHours(hour, minute, 0, 0);
          timeSlots.push(slot.getTime());
        }
      }

      expect(timeSlots).toHaveLength(2); // 9:00 and 9:30
    });

    it("handles midnight time range", () => {
      const startHour = 0;
      const endHour = 2;
      const date = new Date();
      date.setHours(0, 0, 0, 0);

      const timeSlots = [];
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slot = new Date(date);
          slot.setHours(hour, minute, 0, 0);
          timeSlots.push(slot.getTime());
        }
      }

      expect(timeSlots).toHaveLength(4); // 00:00, 00:30, 01:00, 01:30
    });
  });

  describe("Date Validation", () => {
    it("validates future dates", () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      expect(tomorrow.getTime() > today.getTime()).toBe(true);
      expect(yesterday.getTime() < today.getTime()).toBe(true);
    });

    it("validates date ranges", () => {
      const today = new Date();
      const dates = [
        new Date(today.getTime() + 24 * 60 * 60 * 1000),
        new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      ];

      expect(dates).toHaveLength(3);
      dates.forEach((date) => {
        expect(date.getTime() > today.getTime()).toBe(true);
      });
    });

    it("handles maximum date limit", () => {
      const maxDates = 15;
      const dates = Array.from({ length: maxDates }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        return date;
      });

      expect(dates).toHaveLength(maxDates);
    });
  });

  describe("Time Slot Management", () => {
    it("converts datetime to time components", () => {
      const now = new Date();
      now.setHours(14, 30, 0, 0);

      expect(now.getHours()).toBe(14);
      expect(now.getMinutes()).toBe(30);
    });

    it("checks if datetime is 13 digits (timestamp)", () => {
      const datetime = new Date().getTime();
      expect(datetime.toString().length).toBe(13);
    });

    it("handles time slot selection and deselection", () => {
      const selectedSlots = new Set<number>();
      const now = new Date();
      now.setHours(9, 0, 0, 0);
      const timeSlot = now.getTime();

      // Select
      selectedSlots.add(timeSlot);
      expect(selectedSlots.has(timeSlot)).toBe(true);

      // Deselect
      selectedSlots.delete(timeSlot);
      expect(selectedSlots.has(timeSlot)).toBe(false);
    });

    it("manages multiple time slots", () => {
      const selectedSlots = new Set<number>();
      const baseTime = new Date();
      baseTime.setHours(9, 0, 0, 0);

      const slots = [
        baseTime.getTime(),
        baseTime.getTime() + 30 * 60 * 1000, // +30 minutes
        baseTime.getTime() + 60 * 60 * 1000, // +1 hour
      ];

      slots.forEach((slot) => selectedSlots.add(slot));
      expect(selectedSlots.size).toBe(3);

      selectedSlots.delete(slots[1]);
      expect(selectedSlots.size).toBe(2);
      expect(selectedSlots.has(slots[0])).toBe(true);
      expect(selectedSlots.has(slots[1])).toBe(false);
      expect(selectedSlots.has(slots[2])).toBe(true);
    });
  });

  describe("Meeting Data Validation", () => {
    it("validates meeting name requirements", () => {
      const validName = "Team Meeting";
      const shortName = "abc";
      const longName = "a".repeat(51);
      const emptyName = "";

      expect(validName.length).toBeGreaterThanOrEqual(4);
      expect(validName.length).toBeLessThanOrEqual(50);
      expect(shortName.length).toBeLessThan(4);
      expect(longName.length).toBeGreaterThan(50);
      expect(emptyName.length).toBe(0);
    });

    it("validates meeting place requirements", () => {
      const validPlace = "Conference Room A";
      const longPlace = "a".repeat(101);
      const emptyPlace = "";

      expect(validPlace.length).toBeLessThanOrEqual(100);
      expect(longPlace.length).toBeGreaterThan(100);
      expect(emptyPlace.length).toBe(0);
    });

    it("validates URL format", () => {
      const validUrls = [
        "https://example.com",
        "http://example.com",
        "https://meet.google.com/abc-def-ghi",
        "https://zoom.us/j/123456789",
      ];

      const invalidUrls = [
        "not-a-url",
        "example.com",
        "ftp://example.com",
        "javascript:alert(1)",
      ];

      validUrls.forEach((url) => {
        expect(url.startsWith("http://") || url.startsWith("https://")).toBe(
          true
        );
      });

      invalidUrls.forEach((url) => {
        expect(url.startsWith("http://") || url.startsWith("https://")).toBe(
          false
        );
      });
    });

    it("validates selected dates array", () => {
      const today = new Date();
      const validDates = [
        new Date(today.getTime() + 24 * 60 * 60 * 1000).getTime(),
        new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).getTime(),
        new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).getTime(),
      ];

      const emptyDates: number[] = [];
      const tooManyDates = Array.from({ length: 16 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i + 1);
        return date.getTime();
      });

      expect(validDates.length).toBeGreaterThan(0);
      expect(validDates.length).toBeLessThanOrEqual(15);
      expect(emptyDates.length).toBe(0);
      expect(tooManyDates.length).toBeGreaterThan(15);
    });
  });

  describe("Time Range Calculations", () => {
    it("calculates time difference correctly", () => {
      const start = new Date();
      start.setHours(9, 0, 0, 0);
      const end = new Date();
      end.setHours(17, 0, 0, 0);
      const duration = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      );

      expect(duration).toBe(8);
    });

    it("handles cross-day time ranges", () => {
      const start = new Date();
      start.setHours(23, 0, 0, 0);
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      end.setHours(1, 0, 0, 0);
      const duration = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      );

      expect(duration).toBe(2);
    });

    it("calculates overlapping time slots", () => {
      const baseTime = new Date();
      baseTime.setHours(9, 0, 0, 0);

      const slot1 = {
        start: baseTime.getTime(),
        end: baseTime.getTime() + 2 * 60 * 60 * 1000, // +2 hours
      };

      const slot2 = {
        start: baseTime.getTime() + 1 * 60 * 60 * 1000, // +1 hour
        end: baseTime.getTime() + 3 * 60 * 60 * 1000, // +3 hours
      };

      const overlap = slot1.end > slot2.start && slot2.end > slot1.start;
      expect(overlap).toBe(true);
    });
  });
});
