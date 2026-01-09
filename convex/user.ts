import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    const account = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", userId))
      .first();

    const derivedName = user.name || user.email?.split("@")[0] || null;

    return {
      ...user,
      email: account?.email || null,
      name: derivedName,
      image: user.image || null,
    };
  },
});

export const updateUserName = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate name: trim whitespace and check length
    const trimmedName = args.name.trim();
    if (trimmedName.length === 0) {
      throw new Error("Name cannot be empty");
    }
    if (trimmedName.length > 100) {
      throw new Error("Name must be 100 characters or less");
    }

    // Update the user's name
    await ctx.db.patch(userId, {
      name: trimmedName,
    });

    return { success: true };
  },
});
