import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/api/index.js";
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
	server.tool(
		"getSuites",
		{ projectId: getSuitesSchema.shape.projectId },
		async (args, extra) => {
			try {
				const { projectId } = args;
				const suites = await testRailClient.suites.getSuites(projectId);
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
					`Error fetching test suites for project ${args.projectId}`,
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
		{ suiteId: getSuiteSchema.shape.suiteId },
		async (args, extra) => {
			try {
				const { suiteId } = args;
				const suite = await testRailClient.suites.getSuite(suiteId);
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
					`Error fetching test suite ${args.suiteId}`,
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
			projectId: addSuiteSchema.shape.projectId,
			name: addSuiteSchema.shape.name,
			description: addSuiteSchema.shape.description,
		},
		async (args, extra) => {
			try {
				const { projectId, name, description } = args;
				const data = {
					name,
					description,
				};
				const suite = await testRailClient.suites.addSuite(projectId, data);
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
					`Error creating test suite for project ${args.projectId}`,
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
			suiteId: updateSuiteSchema.shape.suiteId,
			name: updateSuiteSchema.shape.name,
			description: updateSuiteSchema.shape.description,
		},
		async (args, extra) => {
			try {
				const { suiteId, name, description } = args;
				const data: { name?: string; description?: string } = {};

				if (name) data.name = name;
				if (description) data.description = description;

				const suite = await testRailClient.suites.updateSuite(suiteId, data);
				const successResponse = createSuccessResponse(
					"Suite updated successfully",
					{
						suite,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error updating suite ${args.suiteId}`,
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
		{ suiteId: deleteSuiteSchema.shape.suiteId },
		async (args, extra) => {
			try {
				const { suiteId } = args;
				await testRailClient.suites.deleteSuite(suiteId);
				const successResponse = createSuccessResponse(
					`Suite ${suiteId} deleted successfully`,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error deleting suite ${args.suiteId}`,
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
