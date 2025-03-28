import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/api/index.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";
import {
	getResultsSchema,
	getResultsForCaseSchema,
	getResultsForRunSchema,
	addResultSchema,
	addResultForCaseSchema,
	addResultsSchema,
	addResultsForCasesSchema,
} from "../../shared/schemas/results.js";

/**
 * Function to register test result-related API tools
 * @param server McpServer instance
 * @param testRailClient TestRail client instance
 */
export function registerResultTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// テスト結果一覧取得
	server.tool(
		"getResults",
		getResultsSchema,
		async ({ testId, ...filters }) => {
			try {
				const results = await testRailClient.results.getResults(
					testId,
					filters,
				);
				const successResponse = createSuccessResponse(
					"Results retrieved successfully",
					{
						results,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching results for test ${testId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// テストケース結果一覧取得
	server.tool(
		"getResultsForCase",
		getResultsForCaseSchema,
		async ({ runId, caseId, ...filters }) => {
			try {
				const results = await testRailClient.results.getResultsForCase(
					runId,
					caseId,
					filters,
				);
				const successResponse = createSuccessResponse(
					"Results retrieved successfully",
					{
						results,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching results for run ${runId} and case ${caseId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// テストラン結果一覧取得
	server.tool(
		"getResultsForRun",
		getResultsForRunSchema,
		async ({ runId, ...filters }) => {
			try {
				const results = await testRailClient.results.getResultsForRun(
					runId,
					filters,
				);
				const successResponse = createSuccessResponse(
					"Results retrieved successfully",
					{
						results,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching results for run ${runId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// テスト結果追加
	server.tool(
		"addResult",
		addResultSchema,
		async ({ testId, ...resultData }) => {
			try {
				// 結果データを準備
				const data: Record<string, unknown> = {};

				// ステータスIDが指定されていれば追加
				if (resultData.statusId) {
					data.status_id = resultData.statusId;
				}

				// コメントが指定されていれば追加
				if (resultData.comment) {
					data.comment = resultData.comment;
				}

				// バージョンが指定されていれば追加
				if (resultData.version) {
					data.version = resultData.version;
				}

				// 所要時間が指定されていれば追加
				if (resultData.elapsed) {
					data.elapsed = resultData.elapsed;
				}

				// 欠陥IDが指定されていれば追加
				if (resultData.defects) {
					data.defects = resultData.defects;
				}

				// 担当者IDが指定されていれば追加
				if (resultData.assignedtoId) {
					data.assignedto_id = resultData.assignedtoId;
				}

				const result = await testRailClient.results.addResult(testId, data);
				const successResponse = createSuccessResponse(
					"Result added successfully",
					{
						result,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error adding result for test ${testId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// テストケース結果追加
	server.tool(
		"addResultForCase",
		addResultForCaseSchema,
		async ({ runId, caseId, ...resultData }) => {
			try {
				// 結果データを準備
				const data: Record<string, unknown> = {};

				// ステータスIDが指定されていれば追加
				if (resultData.statusId) {
					data.status_id = resultData.statusId;
				}

				// コメントが指定されていれば追加
				if (resultData.comment) {
					data.comment = resultData.comment;
				}

				// バージョンが指定されていれば追加
				if (resultData.version) {
					data.version = resultData.version;
				}

				// 所要時間が指定されていれば追加
				if (resultData.elapsed) {
					data.elapsed = resultData.elapsed;
				}

				// 欠陥IDが指定されていれば追加
				if (resultData.defects) {
					data.defects = resultData.defects;
				}

				// 担当者IDが指定されていれば追加
				if (resultData.assignedtoId) {
					data.assignedto_id = resultData.assignedtoId;
				}

				const result = await testRailClient.results.addResultForCase(
					runId,
					caseId,
					data,
				);
				const successResponse = createSuccessResponse(
					"Result added successfully",
					{
						result,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error adding result for run ${runId} and case ${caseId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// 複数テスト結果追加
	server.tool("addResults", addResultsSchema, async ({ runId, results }) => {
		try {
			// APIに送信するデータを準備
			const data = {
				results: results.map((result) => {
					const resultData: Record<string, unknown> = {
						test_id: result.testId,
					};

					// ステータスIDが指定されていれば追加
					if (result.statusId) {
						resultData.status_id = result.statusId;
					}

					// コメントが指定されていれば追加
					if (result.comment) {
						resultData.comment = result.comment;
					}

					// バージョンが指定されていれば追加
					if (result.version) {
						resultData.version = result.version;
					}

					// 所要時間が指定されていれば追加
					if (result.elapsed) {
						resultData.elapsed = result.elapsed;
					}

					// 欠陥IDが指定されていれば追加
					if (result.defects) {
						resultData.defects = result.defects;
					}

					// 担当者IDが指定されていれば追加
					if (result.assignedtoId) {
						resultData.assignedto_id = result.assignedtoId;
					}

					return resultData;
				}),
			};

			const addedResults = await testRailClient.results.addResults(runId, data);
			const successResponse = createSuccessResponse(
				"Results added successfully",
				{
					results: addedResults,
				},
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				`Error adding results for run ${runId}`,
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// 複数テストケース結果追加
	server.tool(
		"addResultsForCases",
		addResultsForCasesSchema,
		async ({ runId, results }) => {
			try {
				// APIに送信するデータを準備
				const data = {
					results: results.map((result) => {
						const resultData: Record<string, unknown> = {
							case_id: result.caseId,
						};

						// ステータスIDが指定されていれば追加
						if (result.statusId) {
							resultData.status_id = result.statusId;
						}

						// コメントが指定されていれば追加
						if (result.comment) {
							resultData.comment = result.comment;
						}

						// バージョンが指定されていれば追加
						if (result.version) {
							resultData.version = result.version;
						}

						// 所要時間が指定されていれば追加
						if (result.elapsed) {
							resultData.elapsed = result.elapsed;
						}

						// 欠陥IDが指定されていれば追加
						if (result.defects) {
							resultData.defects = result.defects;
						}

						// 担当者IDが指定されていれば追加
						if (result.assignedtoId) {
							resultData.assignedto_id = result.assignedtoId;
						}

						return resultData;
					}),
				};

				const addedResults = await testRailClient.results.addResultsForCases(
					runId,
					data,
				);
				const successResponse = createSuccessResponse(
					"Results added successfully",
					{
						results: addedResults,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error adding results for run ${runId}`,
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
