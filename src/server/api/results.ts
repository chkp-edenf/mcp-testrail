import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * Function to register test result-related API tools
 * @param server McpServer instance
 * @param testRailClient TestRail client instance
 */
export function registerResultTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// Get results for a test
	server.tool(
		"getResults",
		{
			testId: z.number().describe("TestRail Test ID"),
			limit: z
				.number()
				.optional()
				.describe("The number of results to return per page"),
			offset: z
				.number()
				.optional()
				.describe("The offset to start returning results"),
			statusId: z
				.string()
				.optional()
				.describe("Filter by status IDs (comma-separated)"),
			defectsFilter: z.string().optional().describe("Filter by defect ID"),
		},
		async ({ testId, limit, offset, statusId, defectsFilter }) => {
			try {
				const params: Record<
					string,
					string | number | boolean | null | undefined
				> = {};

				// デバッグログ
				console.log(`パラメータ型情報 - testId: ${typeof testId}`);
				console.log(`パラメータ値 - testId: ${testId}`);

				if (limit !== undefined) params.limit = limit;
				if (offset !== undefined) params.offset = offset;
				if (statusId) params.status_id = statusId;
				if (defectsFilter) params.defects_filter = defectsFilter;

				const results = await testRailClient.results.getResults(testId, params);
				const successResponse = createSuccessResponse(
					"Test results retrieved successfully",
					{
						results,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error retrieving results for test ${testId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Get results for a case in a run
	server.tool(
		"getResultsForCase",
		{
			runId: z.number().describe("TestRail Run ID"),
			caseId: z.number().describe("TestRail Case ID"),
			limit: z
				.number()
				.optional()
				.describe("The number of results to return per page"),
			offset: z
				.number()
				.optional()
				.describe("The offset to start returning results"),
			statusId: z
				.string()
				.optional()
				.describe("Filter by status IDs (comma-separated)"),
			defectsFilter: z.string().optional().describe("Filter by defect ID"),
		},
		async ({ runId, caseId, limit, offset, statusId, defectsFilter }) => {
			try {
				const params: Record<
					string,
					string | number | boolean | null | undefined
				> = {};

				// デバッグログ
				console.log(
					`パラメータ型情報 - runId: ${typeof runId}, caseId: ${typeof caseId}`,
				);
				console.log(`パラメータ値 - runId: ${runId}, caseId: ${caseId}`);

				if (limit !== undefined) params.limit = limit;
				if (offset !== undefined) params.offset = offset;
				if (statusId) params.status_id = statusId;
				if (defectsFilter) params.defects_filter = defectsFilter;

				const results = await testRailClient.results.getResultsForCase(
					runId,
					caseId,
					params,
				);
				const successResponse = createSuccessResponse(
					"Test results retrieved successfully",
					{
						results,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error retrieving results for case ${caseId} in run ${runId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Get results for a run
	server.tool(
		"getResultsForRun",
		{
			runId: z.number().describe("TestRail Run ID"),
			limit: z
				.number()
				.optional()
				.describe("The number of results to return per page"),
			offset: z
				.number()
				.optional()
				.describe("The offset to start returning results"),
			statusId: z
				.string()
				.optional()
				.describe("Filter by status IDs (comma-separated)"),
			defectsFilter: z.string().optional().describe("Filter by defect ID"),
		},
		async ({ runId, limit, offset, statusId, defectsFilter }) => {
			try {
				const params: Record<
					string,
					string | number | boolean | null | undefined
				> = {};

				// デバッグログ
				console.log(`パラメータ型情報 - runId: ${typeof runId}`);
				console.log(`パラメータ値 - runId: ${runId}`);

				if (limit !== undefined) params.limit = limit;
				if (offset !== undefined) params.offset = offset;
				if (statusId) params.status_id = statusId;
				if (defectsFilter) params.defects_filter = defectsFilter;

				const results = await testRailClient.results.getResultsForRun(
					runId,
					params,
				);
				const successResponse = createSuccessResponse(
					"Test results retrieved successfully",
					{
						results,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error retrieving results for run ${runId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Add a result for a specific test case
	server.tool(
		"addResultForCase",
		{
			runId: z.number().describe("TestRail Run ID"),
			caseId: z.number().describe("TestRail Case ID"),
			statusId: z
				.number()
				.optional()
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
		},
		async ({
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
				// MCPツールが厳密に数値型を要求するため、確実に数値型に変換
				const numericRunId = Number(runId);
				const numericCaseId = Number(caseId);
				let numericStatusId = undefined;
				let numericAssignedtoId = undefined;

				if (statusId !== undefined) {
					numericStatusId = Number(statusId);
				}

				if (assignedtoId !== undefined) {
					numericAssignedtoId = Number(assignedtoId);
				}

				// デバッグログ
				console.log(
					`パラメータ型情報(変換後) - runId: ${typeof numericRunId}, caseId: ${typeof numericCaseId}, statusId: ${typeof numericStatusId}`,
				);
				console.log(
					`パラメータ値(変換後) - runId: ${numericRunId}, caseId: ${numericCaseId}, statusId: ${numericStatusId}`,
				);

				// データオブジェクトを構築
				const data: Record<string, unknown> = {};

				if (numericStatusId !== undefined) data.status_id = numericStatusId;
				if (numericAssignedtoId !== undefined)
					data.assignedto_id = numericAssignedtoId;
				if (comment) data.comment = comment;
				if (defects) data.defects = defects;
				if (version) data.version = version;
				if (elapsed) data.elapsed = elapsed;

				// デバッグログ
				console.log(`送信データ: ${JSON.stringify(data)}`);
				console.log(
					`Adding result for case ${numericCaseId} in run ${numericRunId} with data:`,
					data,
				);

				// クライアントAPIを呼び出し
				const result = await testRailClient.results.addResultForCase(
					numericRunId,
					numericCaseId,
					data,
				);

				const successResponse = createSuccessResponse(
					"Test result added successfully",
					{
						result,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				// エラー詳細を出力
				console.error("テスト結果追加エラー詳細:", error);

				const errorResponse = createErrorResponse(
					`Error adding result for case ${caseId} in run ${runId}`,
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
