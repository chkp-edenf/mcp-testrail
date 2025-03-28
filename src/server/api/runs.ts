import { z } from "zod";
import { FastMCP } from "fastmcp";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * Function to register test run-related API tools
 * @param server FastMCP server instance
 * @param testRailClient TestRail client instance
 */
export function registerRunTools(
	server: FastMCP,
	testRailClient: TestRailClient,
): void {
	// Get all test runs for a project
	server.addTool({
		name: "getRuns",
		description: "Get a list of test runs for a project from TestRail",
		parameters: z.object({
			projectId: z.number().describe("TestRail Project ID"),
			createdAfter: z
				.number()
				.optional()
				.describe("Only return runs created after this timestamp"),
			createdBefore: z
				.number()
				.optional()
				.describe("Only return runs created before this timestamp"),
			createdBy: z
				.array(z.number())
				.optional()
				.describe("Only return runs created by these user IDs"),
			milestoneId: z
				.number()
				.optional()
				.describe("Only return runs for this milestone"),
			suiteId: z
				.number()
				.optional()
				.describe("Only return runs for this test suite"),
			limit: z
				.number()
				.optional()
				.describe("The number of runs to return per page"),
			offset: z
				.number()
				.optional()
				.describe("The offset to start returning runs"),
		}),
		execute: async ({ projectId, createdBy, ...filters }) => {
			try {
				// Convert createdBy to string format
				const params: Record<
					string,
					string | number | boolean | null | undefined
				> = {
					...filters,
				};

				if (createdBy) {
					params.created_by = createdBy.join(",");
				}

				const runs = await testRailClient.getRuns(projectId, params);
				return createSuccessResponse("Test runs retrieved successfully", {
					runs,
				});
			} catch (error) {
				return createErrorResponse(
					`Error fetching test runs for project ${projectId}`,
					error,
				);
			}
		},
	});

	// Get a specific test run
	server.addTool({
		name: "getRun",
		description: "Get a specific test run from TestRail",
		parameters: z.object({
			runId: z.number().describe("TestRail Run ID"),
		}),
		execute: async ({ runId }) => {
			try {
				const run = await testRailClient.getRun(runId);
				return createSuccessResponse("Test run retrieved successfully", {
					run,
				});
			} catch (error) {
				return createErrorResponse(`Error fetching test run ${runId}`, error);
			}
		},
	});

	// Create a new test run
	server.addTool({
		name: "addRun",
		description: "Create a new test run in TestRail",
		parameters: z.object({
			projectId: z.number().describe("TestRail Project ID"),
			suiteId: z
				.number()
				.optional()
				.describe("Suite ID (required for multi-suite projects)"),
			name: z.string().describe("Test run name"),
			description: z.string().optional().describe("Test run description"),
			milestoneId: z.number().optional().describe("Milestone ID"),
			assignedtoId: z.number().optional().describe("User ID to assign to"),
			includeAll: z
				.boolean()
				.optional()
				.describe("Include all test cases from the suite"),
			caseIds: z
				.array(z.number())
				.optional()
				.describe("Specific case IDs to include"),
			configIds: z
				.array(z.number())
				.optional()
				.describe("Configuration IDs to use"),
			refs: z.string().optional().describe("Reference/requirement IDs"),
		}),
		execute: async ({
			projectId,
			suiteId,
			name,
			description,
			milestoneId,
			assignedtoId,
			includeAll,
			caseIds,
			configIds,
			refs,
		}) => {
			try {
				const data: Record<string, unknown> = {
					name,
				};

				if (suiteId) data.suite_id = suiteId;
				if (description) data.description = description;
				if (milestoneId) data.milestone_id = milestoneId;
				if (assignedtoId) data.assignedto_id = assignedtoId;
				if (includeAll !== undefined) data.include_all = includeAll;
				if (caseIds) data.case_ids = caseIds;
				if (configIds) data.config_ids = configIds;
				if (refs) data.refs = refs;

				const run = await testRailClient.addRun(projectId, data);
				return createSuccessResponse("Test run created successfully", {
					run,
				});
			} catch (error) {
				return createErrorResponse(
					`Error creating test run for project ${projectId}`,
					error,
				);
			}
		},
	});

	// Update an existing test run
	server.addTool({
		name: "updateRun",
		description: "Update an existing test run in TestRail",
		parameters: z.object({
			runId: z.number().describe("TestRail Run ID"),
			name: z.string().optional().describe("Test run name"),
			description: z.string().optional().describe("Test run description"),
			milestoneId: z.number().optional().describe("Milestone ID"),
			assignedtoId: z.number().optional().describe("User ID to assign to"),
			includeAll: z
				.boolean()
				.optional()
				.describe("Include all test cases from the suite"),
			caseIds: z
				.array(z.number())
				.optional()
				.describe("Specific case IDs to include"),
			refs: z.string().optional().describe("Reference/requirement IDs"),
		}),
		execute: async ({
			runId,
			name,
			description,
			milestoneId,
			assignedtoId,
			includeAll,
			caseIds,
			refs,
		}) => {
			try {
				const data: Record<string, unknown> = {};

				if (name) data.name = name;
				if (description !== undefined) data.description = description;
				if (milestoneId !== undefined) data.milestone_id = milestoneId;
				if (assignedtoId !== undefined) data.assignedto_id = assignedtoId;
				if (includeAll !== undefined) data.include_all = includeAll;
				if (caseIds) data.case_ids = caseIds;
				if (refs) data.refs = refs;

				const run = await testRailClient.updateRun(runId, data);
				return createSuccessResponse("Test run updated successfully", {
					run,
				});
			} catch (error) {
				return createErrorResponse(`Error updating test run ${runId}`, error);
			}
		},
	});

	// Close a test run
	server.addTool({
		name: "closeRun",
		description: "Close an existing test run in TestRail",
		parameters: z.object({
			runId: z.number().describe("TestRail Run ID"),
		}),
		execute: async ({ runId }) => {
			try {
				await testRailClient.closeRun(runId);
				return createSuccessResponse(`Test run ${runId} closed successfully`);
			} catch (error) {
				return createErrorResponse(`Error closing test run ${runId}`, error);
			}
		},
	});

	// Delete a test run
	server.addTool({
		name: "deleteRun",
		description: "Delete an existing test run in TestRail",
		parameters: z.object({
			runId: z.number().describe("TestRail Run ID"),
		}),
		execute: async ({ runId }) => {
			try {
				await testRailClient.deleteRun(runId);
				return createSuccessResponse(`Test run ${runId} deleted successfully`);
			} catch (error) {
				return createErrorResponse(`Error deleting test run ${runId}`, error);
			}
		},
	});
}
