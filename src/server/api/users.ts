import { z } from "zod";
import { FastMCP } from "fastmcp";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * Function to register user-related API tools
 * @param server FastMCP server instance
 * @param testRailClient TestRail client instance
 */
export function registerUserTools(
	server: FastMCP,
	testRailClient: TestRailClient,
): void {
	// Get all users
	server.addTool({
		name: "getUsers",
		description: "Get a list of users from TestRail",
		parameters: z.object({}),
		execute: async () => {
			try {
				const users = await testRailClient.getUsers();
				return createSuccessResponse("Users retrieved successfully", {
					users,
				});
			} catch (error) {
				return createErrorResponse("Error fetching users", error);
			}
		},
	});

	// Get user by ID
	server.addTool({
		name: "getUser",
		description: "Get a specific user by ID from TestRail",
		parameters: z.object({
			userId: z.number().describe("TestRail User ID"),
		}),
		execute: async ({ userId }) => {
			try {
				const user = await testRailClient.getUser(userId);
				return createSuccessResponse("User retrieved successfully", {
					user,
				});
			} catch (error) {
				return createErrorResponse(`Error fetching user ${userId}`, error);
			}
		},
	});

	// Get user by email
	server.addTool({
		name: "getUserByEmail",
		description: "Get a specific user by email from TestRail",
		parameters: z.object({
			email: z.string().email().describe("Email address of the user"),
		}),
		execute: async ({ email }) => {
			try {
				const user = await testRailClient.getUserByEmail(email);
				return createSuccessResponse("User retrieved successfully", {
					user,
				});
			} catch (error) {
				return createErrorResponse(
					`Error fetching user with email ${email}`,
					error,
				);
			}
		},
	});
}
