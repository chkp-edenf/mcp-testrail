import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";
import {
	getSuitesSchema,
	getSuiteSchema,
	addSuiteSchema,
	updateSuiteSchema,
	deleteSuiteSchema,
} from "../../shared/schemas/suites.js";

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
	server.tool("getSuites", getSuitesSchema, async ({ projectId }) => {
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
	});

	// Get a specific test suite
	server.tool("getSuite", getSuiteSchema, async ({ suiteId }) => {
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
	});

	// Create a new test suite
	server.tool(
		"addSuite",
		addSuiteSchema,
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
		updateSuiteSchema,
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
	server.tool("deleteSuite", deleteSuiteSchema, async ({ suiteId }) => {
		try {
			await testRailClient.deleteSuite(suiteId);
			const successResponse = createSuccessResponse(
				"Test suite deleted successfully",
				{
					suiteId,
				},
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
	});
}
