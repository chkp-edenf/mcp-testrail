import { z } from "zod";
import { FastMCP } from "fastmcp";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * Function to register test result-related API tools
 * @param server FastMCP server instance
 * @param testRailClient TestRail client instance
 */
export function registerResultTools(
	server: FastMCP,
	testRailClient: TestRailClient,
): void {
	// Add a test result
	server.addTool({
		name: "addTestResult",
		description: "Add a test result",
		parameters: z.object({
			testId: z.number().describe("TestRail Test ID"),
			statusId: z
				.number()
				.describe(
					"Status ID (1:Pass, 2:Blocked, 3:Untested, 4:Retest, 5:Fail)",
				),
			comment: z.string().optional().describe("Comment for the test result"),
			defects: z
				.string()
				.optional()
				.describe("Defects linked to the test result"),
			assignedtoId: z
				.number()
				.optional()
				.describe("User to assign the test to"),
			version: z.string().optional().describe("Version or build tested"),
			elapsed: z
				.string()
				.optional()
				.describe("Time spent testing (e.g., '30s', '2m 30s')"),
		}),
		execute: async ({
			testId,
			statusId,
			comment,
			defects,
			assignedtoId,
			version,
			elapsed,
		}) => {
			try {
				const data: Record<string, unknown> = {
					status_id: statusId,
				};

				if (comment) data.comment = comment;
				if (defects) data.defects = defects;
				if (assignedtoId) data.assignedto_id = assignedtoId;
				if (version) data.version = version;
				if (elapsed) data.elapsed = elapsed;

				const result = await testRailClient.addResult(testId, data);
				return createSuccessResponse("Test result added successfully", {
					result,
				});
			} catch (error) {
				return createErrorResponse(
					`Error adding result for test ${testId}`,
					error,
				);
			}
		},
	});

	// Add a result for a specific test case
	server.addTool({
		name: "addResultForCase",
		description: "Add a test result for a specific test case in a test run",
		parameters: z.object({
			runId: z.number().describe("TestRail Run ID"),
			caseId: z.number().describe("TestRail Case ID"),
			statusId: z
				.number()
				.describe(
					"Status ID (1:Pass, 2:Blocked, 3:Untested, 4:Retest, 5:Fail)",
				),
			comment: z.string().optional().describe("Comment for the test result"),
			defects: z
				.string()
				.optional()
				.describe("Defects linked to the test result"),
			assignedtoId: z
				.number()
				.optional()
				.describe("User to assign the test to"),
			version: z.string().optional().describe("Version or build tested"),
			elapsed: z
				.string()
				.optional()
				.describe("Time spent testing (e.g., '30s', '2m 30s')"),
		}),
		execute: async ({
			runId,
			caseId,
			statusId,
			comment,
			defects,
			assignedtoId,
			version,
			elapsed,
		}) => {
			try {
				const data: Record<string, unknown> = {
					status_id: statusId,
				};

				if (comment) data.comment = comment;
				if (defects) data.defects = defects;
				if (assignedtoId) data.assignedto_id = assignedtoId;
				if (version) data.version = version;
				if (elapsed) data.elapsed = elapsed;

				const result = await testRailClient.addResultForCase(
					runId,
					caseId,
					data,
				);
				return createSuccessResponse("Test result added successfully", {
					result,
				});
			} catch (error) {
				return createErrorResponse(
					`Error adding result for case ${caseId} in run ${runId}`,
					error,
				);
			}
		},
	});
}
