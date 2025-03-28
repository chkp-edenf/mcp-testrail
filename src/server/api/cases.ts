import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

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
	server.tool(
		"getTestCase",
		{
			caseId: z.number().describe("TestRail Test Case ID"),
		},
		async ({ caseId }) => {
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
		},
	);

	// プロジェクトのテストケース一覧取得
	server.tool(
		"getTestCases",
		{
			projectId: z.number().describe("TestRail Project ID"),
		},
		async ({ projectId }) => {
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
		},
	);

	// テストケース作成
	server.tool(
		"addTestCase",
		{
			sectionId: z.number().describe("TestRail Section ID"),
			title: z.string().describe("Test case title"),
			typeId: z.number().optional().describe("Test case type ID"),
			priorityId: z.number().optional().describe("Test case priority ID"),
			estimate: z
				.string()
				.optional()
				.describe("Time estimate (e.g., '30s', '1m 45s', '3h')"),
			milestoneId: z.number().optional().describe("Milestone ID"),
			refs: z.string().optional().describe("Reference/requirement IDs"),
			customSteps: z.string().optional().describe("Test case steps"),
			customExpected: z.string().optional().describe("Expected results"),
			customPrerequisites: z.string().optional().describe("Prerequisites"),
		},
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
		{
			caseId: z.number().describe("TestRail Test Case ID"),
			title: z.string().optional().describe("Test case title"),
			typeId: z.number().optional().describe("Test case type ID"),
			priorityId: z.number().optional().describe("Test case priority ID"),
			estimate: z
				.string()
				.optional()
				.describe("Time estimate (e.g., '30s', '1m 45s', '3h')"),
			milestoneId: z.number().optional().describe("Milestone ID"),
			refs: z.string().optional().describe("Reference/requirement IDs"),
			customSteps: z.string().optional().describe("Test case steps"),
			customExpected: z.string().optional().describe("Expected results"),
			customPrerequisites: z.string().optional().describe("Prerequisites"),
		},
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
	server.tool(
		"deleteTestCase",
		{
			caseId: z.number().describe("TestRail Test Case ID"),
		},
		async ({ caseId }) => {
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
		},
	);

	// テストケースタイプ取得
	server.tool("getTestCaseTypes", {}, async () => {
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
	server.tool("getTestCaseFields", {}, async () => {
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

	// テストケースコピー
	server.tool(
		"copyTestCasesToSection",
		{
			sectionId: z.number().describe("Target TestRail Section ID"),
			caseIds: z.array(z.number()).describe("Array of Test Case IDs to copy"),
		},
		async ({ sectionId, caseIds }) => {
			try {
				const result = await testRailClient.copyCasesToSection(
					sectionId,
					caseIds,
				);
				const successResponse = createSuccessResponse(
					"Test cases copied successfully",
					{
						result,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					"Error copying test cases",
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// テストケース移動
	server.tool(
		"moveTestCasesToSection",
		{
			sectionId: z.number().describe("Target TestRail Section ID"),
			caseIds: z.array(z.number()).describe("Array of Test Case IDs to move"),
		},
		async ({ sectionId, caseIds }) => {
			try {
				const result = await testRailClient.moveCasesToSection(
					sectionId,
					caseIds,
				);
				const successResponse = createSuccessResponse(
					"Test cases moved successfully",
					{
						result,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					"Error moving test cases",
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
		{
			caseId: z.number().describe("TestRail Test Case ID"),
		},
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
					`Error fetching test case history for ${caseId}`,
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
