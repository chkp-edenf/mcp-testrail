import { z } from "zod";
import { FastMCP } from "fastmcp";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * テストケース関連のAPIツールを登録する関数
 * @param server FastMCPサーバーインスタンス
 * @param testRailClient TestRailクライアントインスタンス
 */
export function registerCaseTools(
	server: FastMCP,
	testRailClient: TestRailClient,
): void {
	// テストケース取得
	server.addTool({
		name: "getTestCase",
		description: "Get details of a specific test case from TestRail",
		parameters: z.object({
			caseId: z.number().describe("TestRail Test Case ID"),
		}),
		execute: async ({ caseId }) => {
			try {
				const testCase = await testRailClient.getCase(caseId);
				return createSuccessResponse("Test case retrieved successfully", {
					testCase,
				});
			} catch (error) {
				return createErrorResponse(`Error fetching test case ${caseId}`, error);
			}
		},
	});

	// プロジェクトのテストケース一覧取得
	server.addTool({
		name: "getTestCases",
		description: "Get test cases for a specified project",
		parameters: z.object({
			projectId: z.number().describe("TestRail Project ID"),
		}),
		execute: async ({ projectId }) => {
			try {
				const testCases = await testRailClient.getCases(projectId);
				return createSuccessResponse("Test cases retrieved successfully", {
					offset: 0,
					limit: 250,
					size: testCases.length,
					_links: {
						next: null,
						prev: null,
					},
					testCases,
				});
			} catch (error) {
				return createErrorResponse(
					`Error fetching test cases for project ${projectId}`,
					error,
				);
			}
		},
	});

	// テストケース作成
	server.addTool({
		name: "addTestCase",
		description: "Add a new test case to a section in TestRail",
		parameters: z.object({
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
		}),
		execute: async ({
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
				return createSuccessResponse("Test case added successfully", {
					testCase,
				});
			} catch (error) {
				return createErrorResponse(
					`Error adding test case to section ${sectionId}`,
					error,
				);
			}
		},
	});

	// テストケース更新
	server.addTool({
		name: "updateTestCase",
		description: "Update an existing test case in TestRail",
		parameters: z.object({
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
		}),
		execute: async ({
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
				return createSuccessResponse("Test case updated successfully", {
					testCase,
				});
			} catch (error) {
				return createErrorResponse(`Error updating test case ${caseId}`, error);
			}
		},
	});

	// テストケース削除
	server.addTool({
		name: "deleteTestCase",
		description: "Delete an existing test case in TestRail",
		parameters: z.object({
			caseId: z.number().describe("TestRail Test Case ID"),
		}),
		execute: async ({ caseId }) => {
			try {
				await testRailClient.deleteCase(caseId);
				return createSuccessResponse("Test case deleted successfully");
			} catch (error) {
				return createErrorResponse(`Error deleting test case ${caseId}`, error);
			}
		},
	});

	// テストケースタイプ取得
	server.addTool({
		name: "getTestCaseTypes",
		description: "Get a list of available test case types from TestRail",
		parameters: z.object({}),
		execute: async () => {
			try {
				const caseTypes = await testRailClient.getCaseTypes();
				return createSuccessResponse("Test case types retrieved successfully", {
					caseTypes,
				});
			} catch (error) {
				return createErrorResponse("Error fetching test case types", error);
			}
		},
	});

	// テストケースフィールド取得
	server.addTool({
		name: "getTestCaseFields",
		description: "Get a list of available test case fields from TestRail",
		parameters: z.object({}),
		execute: async () => {
			try {
				const caseFields = await testRailClient.getCaseFields();
				return createSuccessResponse(
					"Test case fields retrieved successfully",
					{ caseFields },
				);
			} catch (error) {
				return createErrorResponse("Error fetching test case fields", error);
			}
		},
	});

	// テストケース履歴取得
	server.addTool({
		name: "getTestCaseHistory",
		description: "Get the history of changes for a specific test case",
		parameters: z.object({
			caseId: z.number().describe("TestRail Test Case ID"),
		}),
		execute: async ({ caseId }) => {
			try {
				const caseHistory = await testRailClient.getCaseHistory(caseId);
				return createSuccessResponse(
					`Test case ${caseId} history retrieved successfully`,
					{ caseHistory },
				);
			} catch (error) {
				return createErrorResponse(
					`Error fetching test case ${caseId} history`,
					error,
				);
			}
		},
	});

	// テストケースをセクションにコピー
	server.addTool({
		name: "copyTestCasesToSection",
		description: "Copy test cases to a different section in TestRail",
		parameters: z.object({
			sectionId: z.number().describe("Target TestRail Section ID"),
			caseIds: z.array(z.number()).describe("Array of Test Case IDs to copy"),
		}),
		execute: async ({ sectionId, caseIds }) => {
			try {
				const copiedCases = await testRailClient.cases.copyToSection(
					caseIds,
					sectionId,
				);
				return createSuccessResponse(
					`${Array.isArray(copiedCases) ? copiedCases.length : 0} test cases copied to section ${sectionId} successfully`,
					{ copiedCases },
				);
			} catch (error) {
				return createErrorResponse(
					`Error copying test cases to section ${sectionId}`,
					error,
				);
			}
		},
	});

	// テストケースをセクションに移動
	server.addTool({
		name: "moveTestCasesToSection",
		description: "Move test cases to a different section in TestRail",
		parameters: z.object({
			sectionId: z.number().describe("Target TestRail Section ID"),
			caseIds: z.array(z.number()).describe("Array of Test Case IDs to move"),
		}),
		execute: async ({ sectionId, caseIds }) => {
			try {
				await testRailClient.cases.moveToSection(caseIds, sectionId);
				return createSuccessResponse(
					`${caseIds.length} test cases moved to section ${sectionId} successfully`,
					{
						movedCaseIds: caseIds,
					},
				);
			} catch (error) {
				return createErrorResponse(
					`Error moving test cases to section ${sectionId}`,
					error,
				);
			}
		},
	});

	// 複数テストケースを一括更新
	server.addTool({
		name: "updateMultipleTestCases",
		description: "Update multiple test cases with the same values in TestRail",
		parameters: z.object({
			projectId: z.number().describe("TestRail Project ID"),
			suiteId: z.number().optional().describe("TestRail Suite ID (optional)"),
			caseIds: z
				.array(z.number())
				.optional()
				.describe("Array of Test Case IDs to update (optional)"),
			typeId: z.number().optional().describe("Test case type ID"),
			priorityId: z.number().optional().describe("Test case priority ID"),
			milestoneId: z.number().optional().describe("Milestone ID"),
			refs: z.string().optional().describe("Reference/requirement IDs"),
		}),
		execute: async ({
			projectId,
			suiteId,
			caseIds,
			typeId,
			priorityId,
			milestoneId,
			refs,
		}) => {
			try {
				const data: Record<string, unknown> = {};

				if (typeId !== undefined) data.type_id = typeId;
				if (priorityId !== undefined) data.priority_id = priorityId;
				if (milestoneId !== undefined) data.milestone_id = milestoneId;
				if (refs) data.refs = refs;

				await testRailClient.updateCases(
					projectId,
					suiteId || null,
					data,
					caseIds || [],
				);

				return createSuccessResponse("Test cases updated successfully", {
					updatedFields: Object.keys(data),
					projectId,
					suiteId,
					caseIds,
				});
			} catch (error) {
				return createErrorResponse("Error updating multiple test cases", error);
			}
		},
	});

	// 複数テストケースを一括削除
	server.addTool({
		name: "deleteMultipleTestCases",
		description: "Delete multiple test cases in TestRail",
		parameters: z.object({
			projectId: z.number().describe("TestRail Project ID"),
			suiteId: z.number().optional().describe("TestRail Suite ID (optional)"),
			caseIds: z.array(z.number()).describe("Array of Test Case IDs to delete"),
		}),
		execute: async ({ projectId, suiteId, caseIds }) => {
			try {
				await testRailClient.deleteCases(projectId, suiteId || null, caseIds);
				return createSuccessResponse("Test cases deleted successfully", {
					deletedCount: caseIds.length,
					projectId,
					suiteId,
				});
			} catch (error) {
				return createErrorResponse("Error deleting test cases", error);
			}
		},
	});
}
