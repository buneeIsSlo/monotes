import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  notes: defineTable({
    userId: v.id("users"),
    noteId: v.string(),
    content: v.string(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_noteId", ["userId", "noteId"]),
});

export default schema;
