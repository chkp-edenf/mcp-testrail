import { z } from "zod";

// Schema for retrieving all users (no parameters needed)
export const getUsersSchema = {};

// Schema for retrieving a user by ID
export const getUserSchema = {
	userId: z.number().describe("TestRail User ID"),
};

// Schema for retrieving a user by email address
export const getUserByEmailSchema = {
	email: z.string().email().describe("Email address of the user"),
};

// Create Zod objects from each schema
export const GetUsersInput = z.object(getUsersSchema);
export const GetUserInput = z.object(getUserSchema);
export const GetUserByEmailInput = z.object(getUserByEmailSchema);

// Extract input types
export type GetUsersInputType = z.infer<typeof GetUsersInput>;
export type GetUserInputType = z.infer<typeof GetUserInput>;
export type GetUserByEmailInputType = z.infer<typeof GetUserByEmailInput>;

// -----------------------------------------------
// Response schema definitions - migrated from types.ts
// -----------------------------------------------

/**
 * TestRail API Response for User
 */
export const TestRailUserSchema = z.object({
	id: z.number(),
	name: z.string(),
	email: z.string(),
	is_active: z.boolean(),
	role_id: z.number(),
});
export type TestRailUser = z.infer<typeof TestRailUserSchema>;
