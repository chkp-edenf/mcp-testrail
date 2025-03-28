import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * Function to register test run-related API tools
 * @param server McpServer instance
 * @param testRailClient TestRail client instance
 */
export function registerRunTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// Get all test runs for a project
	server.tool(
		"getRuns",
		{
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
		},
		async ({ projectId, createdBy, ...filters }) => {
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
				const successResponse = createSuccessResponse(
					"Test runs retrieved successfully",
					{
						runs,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching test runs for project ${projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Get a specific test run
	server.tool(
		"getRun",
		{
			runId: z.number().describe("TestRail Run ID"),
		},
		async ({ runId }) => {
			try {
				const run = await testRailClient.getRun(runId);
				const successResponse = createSuccessResponse(
					"Test run retrieved successfully",
					{
						run,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching test run ${runId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Create a new test run
	server.tool(
		"addRun",
		{
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
		},
		async ({
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
				const successResponse = createSuccessResponse(
					"Test run created successfully",
					{
						run,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating test run for project ${projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Update an existing test run
	server.tool(
		"updateRun",
		{
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
		},
		async ({
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
				const successResponse = createSuccessResponse(
					"Test run updated successfully",
					{
						run,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error updating test run ${runId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Close a test run
	server.tool(
		"closeRun",
		{
			runId: z.number().describe("TestRail Run ID"),
		},
		async ({ runId }) => {
			try {
				await testRailClient.closeRun(runId);
				const successResponse = createSuccessResponse(
					`Test run ${runId} closed successfully`,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error closing test run ${runId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Delete a test run
	server.tool(
		"deleteRun",
		{
			runId: z.number().describe("TestRail Run ID"),
		},
		async ({ runId }) => {
			try {
				await testRailClient.deleteRun(runId);
				const successResponse = createSuccessResponse(
					`Test run ${runId} deleted successfully`,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error deleting test run ${runId}`,
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
