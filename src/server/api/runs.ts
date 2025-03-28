import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";
import {
	getRunsSchema,
	getRunSchema,
	addRunSchema,
	updateRunSchema,
	closeRunSchema,
	deleteRunSchema,
} from "../../shared/schemas/runs.js";

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
		getRunsSchema,
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
	server.tool("getRun", getRunSchema, async ({ runId }) => {
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
	});

	// Create a new test run
	server.tool(
		"addRun",
		addRunSchema,
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
		updateRunSchema,
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
	server.tool("closeRun", closeRunSchema, async ({ runId }) => {
		try {
			const run = await testRailClient.closeRun(runId);
			const successResponse = createSuccessResponse(
				"Test run closed successfully",
				{
					run,
				},
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
	});

	// Delete a test run
	server.tool("deleteRun", deleteRunSchema, async ({ runId }) => {
		try {
			await testRailClient.deleteRun(runId);
			const successResponse = createSuccessResponse(
				"Test run deleted successfully",
				{
					runId,
				},
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
	});
}
