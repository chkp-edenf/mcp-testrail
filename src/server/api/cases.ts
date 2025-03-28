import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";
import {
	getTestCaseSchema,
	getTestCasesSchema,
	addTestCaseSchema,
	updateTestCaseSchema,
	deleteTestCaseSchema,
	getTestCaseTypesSchema,
	getTestCaseFieldsSchema,
	copyTestCasesToSectionSchema,
	moveTestCasesToSectionSchema,
	getTestCaseHistorySchema,
} from "../../shared/schemas/cases.js";

/**
 * テストケース関連のAPIツールを登録する関数
 * @param server McpServerインスタンス
 * @param testRailClient TestRailクライアントインスタンス
 */
export function registerCaseTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// テストケース取得
	server.tool("getTestCase", getTestCaseSchema, async ({ caseId }) => {
		try {
			const testCase = await testRailClient.getCase(caseId);
			const successResponse = createSuccessResponse(
				"Test case retrieved successfully",
				{
					testCase,
				},
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				`Error fetching test case ${caseId}`,
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// プロジェクトのテストケース一覧取得
	server.tool("getTestCases", getTestCasesSchema, async ({ projectId }) => {
		try {
			const testCases = await testRailClient.getCases(projectId);
			const successResponse = createSuccessResponse(
				"Test cases retrieved successfully",
				{
					offset: 0,
					limit: 250,
					size: testCases.length,
					_links: {
						next: null,
						prev: null,
					},
					testCases,
				},
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				`Error fetching test cases for project ${projectId}`,
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// テストケース作成
	server.tool(
		"addTestCase",
		addTestCaseSchema,
		async ({
			sectionId,
			title,
			typeId,
			priorityId,
			estimate,
			milestoneId,
			refs,
			customSteps,
			customExpected,
			customPrerequisites,
		}) => {
			try {
				const data: Record<string, unknown> = { title };

				if (typeId !== undefined) data.type_id = typeId;
				if (priorityId !== undefined) data.priority_id = priorityId;
				if (estimate) data.estimate = estimate;
				if (milestoneId !== undefined) data.milestone_id = milestoneId;
				if (refs) data.refs = refs;
				if (customSteps) data.custom_steps = customSteps;
				if (customExpected) data.custom_expected = customExpected;
				if (customPrerequisites) data.custom_preconds = customPrerequisites;

				const testCase = await testRailClient.addCase(sectionId, data);
				const successResponse = createSuccessResponse(
					"Test case added successfully",
					{
						testCase,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error adding test case to section ${sectionId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// テストケース更新
	server.tool(
		"updateTestCase",
		updateTestCaseSchema,
		async ({
			caseId,
			title,
			typeId,
			priorityId,
			estimate,
			milestoneId,
			refs,
			customSteps,
			customExpected,
			customPrerequisites,
		}) => {
			try {
				const data: Record<string, unknown> = {};

				if (title) data.title = title;
				if (typeId !== undefined) data.type_id = typeId;
				if (priorityId !== undefined) data.priority_id = priorityId;
				if (estimate) data.estimate = estimate;
				if (milestoneId !== undefined) data.milestone_id = milestoneId;
				if (refs) data.refs = refs;
				if (customSteps) data.custom_steps = customSteps;
				if (customExpected) data.custom_expected = customExpected;
				if (customPrerequisites) data.custom_preconds = customPrerequisites;

				const testCase = await testRailClient.updateCase(caseId, data);
				const successResponse = createSuccessResponse(
					"Test case updated successfully",
					{
						testCase,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error updating test case ${caseId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// テストケース削除
	server.tool("deleteTestCase", deleteTestCaseSchema, async ({ caseId }) => {
		try {
			await testRailClient.deleteCase(caseId);
			const successResponse = createSuccessResponse(
				"Test case deleted successfully",
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				`Error deleting test case ${caseId}`,
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// テストケースタイプ取得
	server.tool("getTestCaseTypes", getTestCaseTypesSchema, async () => {
		try {
			const caseTypes = await testRailClient.getCaseTypes();
			const successResponse = createSuccessResponse(
				"Test case types retrieved successfully",
				{
					caseTypes,
				},
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				"Error fetching test case types",
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// テストケースフィールド取得
	server.tool("getTestCaseFields", getTestCaseFieldsSchema, async () => {
		try {
			const caseFields = await testRailClient.getCaseFields();
			const successResponse = createSuccessResponse(
				"Test case fields retrieved successfully",
				{
					caseFields,
				},
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				"Error fetching test case fields",
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// テストケースをセクションにコピー
	server.tool(
		"copyTestCasesToSection",
		copyTestCasesToSectionSchema,
		async ({ sectionId, caseIds }) => {
			try {
				// TestRail APIでは配列をカンマ区切りの文字列として送信
				const cases = await testRailClient.copyCasesToSection(
					sectionId,
					caseIds,
				);
				const successResponse = createSuccessResponse(
					"Test cases copied successfully",
					{
						cases,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error copying test cases to section ${sectionId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// テストケースをセクションに移動
	server.tool(
		"moveTestCasesToSection",
		moveTestCasesToSectionSchema,
		async ({ sectionId, caseIds }) => {
			try {
				const cases = await testRailClient.moveCasesToSection(
					sectionId,
					caseIds,
				);
				const successResponse = createSuccessResponse(
					"Test cases moved successfully",
					{
						cases,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error moving test cases to section ${sectionId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// テストケース履歴取得
	server.tool(
		"getTestCaseHistory",
		getTestCaseHistorySchema,
		async ({ caseId }) => {
			try {
				const history = await testRailClient.getCaseHistory(caseId);
				const successResponse = createSuccessResponse(
					"Test case history retrieved successfully",
					{
						history,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching history for test case ${caseId}`,
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
