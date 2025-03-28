import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * Function to register test suite-related API tools
 * @param server McpServer instance
 * @param testRailClient TestRail client instance
 */
export function registerSuiteTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// Get all test suites for a project
	server.tool(
		"getSuites",
		{
			projectId: z.number().describe("TestRail Project ID"),
		},
		async ({ projectId }) => {
			try {
				const suites = await testRailClient.getSuites(projectId);
				const successResponse = createSuccessResponse(
					"Test suites retrieved successfully",
					{
						suites,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching test suites for project ${projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Get a specific test suite
	server.tool(
		"getSuite",
		{
			suiteId: z.number().describe("TestRail Suite ID"),
		},
		async ({ suiteId }) => {
			try {
				const suite = await testRailClient.getSuite(suiteId);
				const successResponse = createSuccessResponse(
					"Test suite retrieved successfully",
					{
						suite,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching test suite ${suiteId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Create a new test suite
	server.tool(
		"addSuite",
		{
			projectId: z.number().describe("TestRail Project ID"),
			name: z.string().describe("Test suite name (required)"),
			description: z.string().optional().describe("Test suite description"),
		},
		async ({ projectId, name, description }) => {
			try {
				const suiteData = {
					name,
					description,
				};
				const suite = await testRailClient.addSuite(projectId, suiteData);
				const successResponse = createSuccessResponse(
					"Test suite created successfully",
					{
						suite,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating test suite for project ${projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Update an existing test suite
	server.tool(
		"updateSuite",
		{
			suiteId: z.number().describe("TestRail Suite ID"),
			name: z.string().optional().describe("Test suite name"),
			description: z.string().optional().describe("Test suite description"),
		},
		async ({ suiteId, name, description }) => {
			try {
				const data: Record<string, unknown> = {};
				if (name) data.name = name;
				if (description !== undefined) data.description = description;

				const suite = await testRailClient.updateSuite(suiteId, data);
				const successResponse = createSuccessResponse(
					"Test suite updated successfully",
					{
						suite,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error updating test suite ${suiteId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Delete a test suite
	server.tool(
		"deleteSuite",
		{
			suiteId: z.number().describe("TestRail Suite ID"),
		},
		async ({ suiteId }) => {
			try {
				await testRailClient.deleteSuite(suiteId);
				const successResponse = createSuccessResponse(
					`Test suite ${suiteId} deleted successfully`,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error deleting test suite ${suiteId}`,
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
