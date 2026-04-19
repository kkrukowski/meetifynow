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
      }),
    ),
  },
  handler: async (ctx, args) => {
    if (args.meetName.trim().length < 4)
      throw new Error("Meeting name must be at least 4 characters.");
    if (args.meetName.length > 50)
      throw new Error("Meeting name can have a maximum of 50 characters.");
    if (args.meetPlace && args.meetPlace.length > 100)
      throw new Error("Meeting place can have a maximum of 100 characters.");
    if (args.meetLink && args.meetLink.length > 200)
      throw new Error("Meeting link is too long.");
      throw new Error("At least one date is required.");
    if (args.dates.length > 15)
      throw new Error("You can select up to 15 dates.");

    const appointmentId = generateId();
    await ctx.db.insert("meetings", {
      appointmentId,
      meetName: args.meetName.trim(),
      meetPlace: args.meetPlace?.trim() || undefined,
      meetLink: args.meetLink?.trim() || undefined,
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
        q.eq("appointmentId", args.appointmentId),
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
      }),
    ),
  },
  handler: async (ctx, args) => {
    const trimmedUsername = args.username.trim();
    if (!trimmedUsername) throw new Error("Username is required.");
    if (trimmedUsername.length > 20)
      throw new Error("Username can have a maximum of 20 characters.");

    const meeting = await ctx.db
      .query("meetings")
      .withIndex("by_appointmentId", (q) =>
        q.eq("appointmentId", args.appointmentId),
      )
      .unique();

    if (!meeting) throw new Error("Meeting not found.");

    const alreadyAnswered = meeting.answers.some(
      (a) => a.username.toLowerCase() === trimmedUsername.toLowerCase(),
    );
    if (alreadyAnswered)
      throw new Error(
        "This username is already taken. Please choose another one.",
      );

    const answerId = crypto.randomUUID();

    await ctx.db.patch(meeting._id, {
      answers: [
        ...meeting.answers,
        { id: answerId, username: trimmedUsername, dates: args.dates },
      ],
    });

    return { answerId };
  },
});

export const updateAnswer = mutation({
  args: {
    appointmentId: v.string(),
    answerId: v.string(),
    username: v.string(),
    dates: v.array(
      v.object({
        meetDate: v.number(),
        isOnline: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const trimmedUsername = args.username.trim();
    if (!trimmedUsername) throw new Error("Username is required.");
    if (trimmedUsername.length > 20)
      throw new Error("Username can have a maximum of 20 characters.");

    const meeting = await ctx.db
      .query("meetings")
      .withIndex("by_appointmentId", (q) =>
        q.eq("appointmentId", args.appointmentId),
      )
      .unique();

    if (!meeting) throw new Error("Meeting not found.");

    const answerIndex = meeting.answers.findIndex(
      (a) => a.id === args.answerId,
    );
    if (answerIndex === -1)
      throw new Error(
        "Answer not found or you don't have permission to edit it.",
      );

    const alreadyAnswered = meeting.answers.some(
      (a, idx) =>
        idx !== answerIndex &&
        a.username.toLowerCase() === trimmedUsername.toLowerCase(),
    );
    if (alreadyAnswered)
      throw new Error(
        "This username is already taken. Please choose another one.",
      );

    const updatedAnswers = [...meeting.answers];
    updatedAnswers[answerIndex] = {
      ...updatedAnswers[answerIndex],
      username: trimmedUsername,
      dates: args.dates,
    };

    await ctx.db.patch(meeting._id, { answers: updatedAnswers });
    return { success: true };
  },
});
