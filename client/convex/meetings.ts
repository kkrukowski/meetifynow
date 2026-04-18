import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function generateId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const array = new Uint8Array(7);
  crypto.getRandomValues(array);
  for (const byte of array) result += chars[byte % chars.length];
  return result;
}

export const create = mutation({
  args: {
    meetName: v.string(),
    meetPlace: v.optional(v.string()),
    meetLink: v.optional(v.string()),
    dates: v.array(
      v.object({
        date: v.number(),
        times: v.array(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const appointmentId = generateId();
    await ctx.db.insert("meetings", {
      appointmentId,
      meetName: args.meetName,
      meetPlace: args.meetPlace,
      meetLink: args.meetLink,
      dates: args.dates,
      answers: [],
    });
    return appointmentId;
  },
});

export const getByAppointmentId = query({
  args: { appointmentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("meetings")
      .withIndex("by_appointmentId", (q) =>
        q.eq("appointmentId", args.appointmentId)
      )
      .unique();
  },
});

export const addAnswer = mutation({
  args: {
    appointmentId: v.string(),
    username: v.string(),
    dates: v.array(
      v.object({
        meetDate: v.number(),
        isOnline: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const meeting = await ctx.db
      .query("meetings")
      .withIndex("by_appointmentId", (q) =>
        q.eq("appointmentId", args.appointmentId)
      )
      .unique();

    if (!meeting) throw new Error("Meeting not found");

    await ctx.db.patch(meeting._id, {
      answers: [
        ...meeting.answers,
        { username: args.username, dates: args.dates },
      ],
    });
  },
});
