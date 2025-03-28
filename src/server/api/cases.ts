import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/api/index.js";
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
	// テストケース詳細取得
	server.tool("getTestCase", getTestCaseSchema, async ({ caseId }) => {
		try {
			const testCase = await testRailClient.cases.getCase(caseId);
			const successResponse = createSuccessResponse(
				`Test case ${caseId} retrieved successfully`,
				{ testCase },
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
			const testCases = await testRailClient.cases.getCases(projectId);
			const successResponse = createSuccessResponse(
				`Test cases for project ${projectId} retrieved successfully`,
				{ testCases },
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

	// テストケース追加
	server.tool(
		"addTestCase",
		addTestCaseSchema,
		async ({
			sectionId,
			title,
			customPrerequisites,
			customSteps,
			customExpected,
			typeId,
			priorityId,
			estimate,
			milestoneId,
			refs,
		}) => {
			try {
				// テストケースのデータを構築
				const caseData: Record<string, unknown> = {
					title,
					custom_preconds: customPrerequisites,
					custom_steps: customSteps,
					custom_expected: customExpected,
					type_id: typeId,
					priority_id: priorityId,
					estimate,
					milestone_id: milestoneId,
					refs,
				};

				// 空または未定義のフィールドを削除
				for (const key of Object.keys(caseData)) {
					if (
						caseData[key] === undefined ||
						caseData[key] === null ||
						caseData[key] === ""
					) {
						delete caseData[key];
					}
				}

				const testCase = await testRailClient.cases.addCase(
					sectionId,
					caseData,
				);
				const successResponse = createSuccessResponse(
					"Test case created successfully",
					{ testCase },
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					"Error creating test case",
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
			customPrerequisites,
			customSteps,
			customExpected,
			typeId,
			priorityId,
			estimate,
			milestoneId,
			refs,
		}) => {
			try {
				// 更新データの構築
				const caseData: Record<string, unknown> = {};

				if (title !== undefined) caseData.title = title;
				if (customPrerequisites !== undefined)
					caseData.custom_preconds = customPrerequisites;
				if (customSteps !== undefined) caseData.custom_steps = customSteps;
				if (customExpected !== undefined)
					caseData.custom_expected = customExpected;
				if (typeId !== undefined) caseData.type_id = typeId;
				if (priorityId !== undefined) caseData.priority_id = priorityId;
				if (estimate !== undefined) caseData.estimate = estimate;
				if (milestoneId !== undefined) caseData.milestone_id = milestoneId;
				if (refs !== undefined) caseData.refs = refs;

				const testCase = await testRailClient.cases.updateCase(
					caseId,
					caseData,
				);
				const successResponse = createSuccessResponse(
					`Test case ${caseId} updated successfully`,
					{ testCase },
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
			await testRailClient.cases.deleteCase(caseId);
			const successResponse = createSuccessResponse(
				`Test case ${caseId} deleted successfully`,
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

	// テストケースタイプ一覧取得
	server.tool("getTestCaseTypes", getTestCaseTypesSchema, async () => {
		try {
			const caseTypes = await testRailClient.cases.getCaseTypes();
			const successResponse = createSuccessResponse(
				"Test case types retrieved successfully",
				{ caseTypes },
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

	// テストケースフィールド一覧取得
	server.tool("getTestCaseFields", getTestCaseFieldsSchema, async () => {
		try {
			const caseFields = await testRailClient.cases.getCaseFields();
			const successResponse = createSuccessResponse(
				"Test case fields retrieved successfully",
				{ caseFields },
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
				if (!Array.isArray(caseIds) || caseIds.length === 0) {
					throw new Error("caseIds must be a non-empty array");
				}

				const result = await testRailClient.cases.copyToSection(
					caseIds,
					sectionId,
				);
				const successResponse = createSuccessResponse(
					`Test cases copied to section ${sectionId} successfully`,
					{ result },
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
				if (!Array.isArray(caseIds) || caseIds.length === 0) {
					throw new Error("caseIds must be a non-empty array");
				}

				const result = await testRailClient.cases.moveToSection(
					caseIds,
					sectionId,
				);
				const successResponse = createSuccessResponse(
					`Test cases moved to section ${sectionId} successfully`,
					{ result },
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
				const history = await testRailClient.cases.getCaseHistory(caseId);
				const successResponse = createSuccessResponse(
					`Test case ${caseId} history retrieved successfully`,
					{ history },
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching test case ${caseId} history`,
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
