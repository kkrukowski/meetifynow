import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  meetings: defineTable({
    appointmentId: v.string(),
    meetName: v.string(),
    meetPlace: v.optional(v.string()),
    meetLink: v.optional(v.string()),
    dates: v.array(
      v.object({
        date: v.number(),
        times: v.array(v.number()),
      })
    ),
    answers: v.array(
      v.object({
        username: v.string(),
        dates: v.array(
          v.object({
            meetDate: v.number(),
            isOnline: v.boolean(),
          })
        ),
      })
    ),
  }).index("by_appointmentId", ["appointmentId"]),
});
