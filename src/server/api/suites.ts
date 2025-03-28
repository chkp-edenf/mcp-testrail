import { z } from "zod";
import { FastMCP } from "fastmcp";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * Function to register test suite-related API tools
 * @param server FastMCP server instance
 * @param testRailClient TestRail client instance
 */
export function registerSuiteTools(
	server: FastMCP,
	testRailClient: TestRailClient,
): void {
	// Get all test suites for a project
	server.addTool({
		name: "getSuites",
		description: "Get all test suites for a project from TestRail",
		parameters: z.object({
			projectId: z.number().describe("TestRail Project ID"),
		}),
		execute: async ({ projectId }) => {
			try {
				const suites = await testRailClient.getSuites(projectId);
				return createSuccessResponse("Test suites retrieved successfully", {
					suites,
				});
			} catch (error) {
				return createErrorResponse(
					`Error fetching test suites for project ${projectId}`,
					error,
				);
			}
		},
	});

	// Get a specific test suite
	server.addTool({
		name: "getSuite",
		description: "Get a specific test suite from TestRail",
		parameters: z.object({
			suiteId: z.number().describe("TestRail Suite ID"),
		}),
		execute: async ({ suiteId }) => {
			try {
				const suite = await testRailClient.getSuite(suiteId);
				return createSuccessResponse("Test suite retrieved successfully", {
					suite,
				});
			} catch (error) {
				return createErrorResponse(
					`Error fetching test suite ${suiteId}`,
					error,
				);
			}
		},
	});

	// Create a new test suite
	server.addTool({
		name: "addSuite",
		description: "Create a new test suite in TestRail",
		parameters: z.object({
			projectId: z.number().describe("TestRail Project ID"),
			name: z.string().describe("Test suite name (required)"),
			description: z.string().optional().describe("Test suite description"),
		}),
		execute: async ({ projectId, name, description }) => {
			try {
				const suiteData = {
					name,
					description,
				};
				const suite = await testRailClient.addSuite(projectId, suiteData);
				return createSuccessResponse("Test suite created successfully", {
					suite,
				});
			} catch (error) {
				return createErrorResponse(
					`Error creating test suite for project ${projectId}`,
					error,
				);
			}
		},
	});

	// Update an existing test suite
	server.addTool({
		name: "updateSuite",
		description: "Update an existing test suite in TestRail",
		parameters: z.object({
			suiteId: z.number().describe("TestRail Suite ID"),
			name: z.string().optional().describe("Test suite name"),
			description: z.string().optional().describe("Test suite description"),
		}),
		execute: async ({ suiteId, name, description }) => {
			try {
				const data: Record<string, unknown> = {};
				if (name) data.name = name;
				if (description !== undefined) data.description = description;

				const suite = await testRailClient.updateSuite(suiteId, data);
				return createSuccessResponse("Test suite updated successfully", {
					suite,
				});
			} catch (error) {
				return createErrorResponse(
					`Error updating test suite ${suiteId}`,
					error,
				);
			}
		},
	});

	// Delete a test suite
	server.addTool({
		name: "deleteSuite",
		description: "Delete a test suite from TestRail",
		parameters: z.object({
			suiteId: z.number().describe("TestRail Suite ID"),
		}),
		execute: async ({ suiteId }) => {
			try {
				await testRailClient.deleteSuite(suiteId);
				return createSuccessResponse(
					`Test suite ${suiteId} deleted successfully`,
				);
			} catch (error) {
				return createErrorResponse(
					`Error deleting test suite ${suiteId}`,
					error,
				);
			}
		},
	});
}
