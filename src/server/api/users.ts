import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * Function to register user-related API tools
 * @param server McpServer instance
 * @param testRailClient TestRail client instance
 */
export function registerUserTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// Get all users
	server.tool("getUsers", {}, async () => {
		try {
			const users = await testRailClient.getUsers();
			const successResponse = createSuccessResponse(
				"Users retrieved successfully",
				{
					users,
				},
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse("Error fetching users", error);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// Get user by ID
	server.tool(
		"getUser",
		{
			userId: z.number().describe("TestRail User ID"),
		},
		async ({ userId }) => {
			try {
				const user = await testRailClient.getUser(userId);
				const successResponse = createSuccessResponse(
					"User retrieved successfully",
					{
						user,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching user ${userId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Get user by email
	server.tool(
		"getUserByEmail",
		{
			email: z.string().email().describe("Email address of the user"),
		},
		async ({ email }) => {
			try {
				const user = await testRailClient.getUserByEmail(email);
				const successResponse = createSuccessResponse(
					"User retrieved successfully",
					{
						user,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching user with email ${email}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);
}
