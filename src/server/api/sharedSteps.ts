import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * 共有ステップ関連のAPIツールを登録する関数
 * @param server McpServerインスタンス
 * @param testRailClient TestRailクライアントインスタンス
 */
export function registerSharedStepTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// 共有ステップ取得
	server.tool(
		"getSharedStep",
		{
			sharedStepId: z.number().describe("TestRail Shared Step ID"),
		},
		async ({ sharedStepId }) => {
			try {
				const sharedStep = await testRailClient.getSharedStep(sharedStepId);
				const successResponse = createSuccessResponse(
					"Shared step retrieved successfully",
					{
						sharedStep,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching shared step ${sharedStepId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// プロジェクトの共有ステップ一覧取得
	server.tool(
		"getSharedSteps",
		{
			projectId: z.number().describe("TestRail Project ID"),
			createdAfter: z
				.number()
				.optional()
				.describe("Only return shared steps created after this timestamp"),
			createdBefore: z
				.number()
				.optional()
				.describe("Only return shared steps created before this timestamp"),
			createdBy: z
				.number()
				.optional()
				.describe("Only return shared steps created by this user ID"),
			updatedAfter: z
				.number()
				.optional()
				.describe("Only return shared steps updated after this timestamp"),
			updatedBefore: z
				.number()
				.optional()
				.describe("Only return shared steps updated before this timestamp"),
			updatedBy: z
				.number()
				.optional()
				.describe("Only return shared steps last updated by this user ID"),
			limit: z
				.number()
				.optional()
				.describe("The number of shared steps to return per page"),
			offset: z
				.number()
				.optional()
				.describe("The offset to start returning shared steps"),
		},
		async ({ projectId, ...filters }) => {
			try {
				const sharedSteps = await testRailClient.getSharedSteps(
					projectId,
					filters,
				);
				const successResponse = createSuccessResponse(
					"Shared steps retrieved successfully",
					{
						sharedSteps,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching shared steps for project ${projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// 共有ステップ作成
	server.tool(
		"addSharedStep",
		{
			projectId: z.number().describe("TestRail Project ID"),
			title: z.string().describe("Shared step title"),
			steps: z
				.array(
					z.object({
						content: z.string().describe("Step content"),
						expected: z.string().optional().describe("Expected result"),
						additionalInfo: z
							.string()
							.optional()
							.describe("Additional information"),
						refs: z.string().optional().describe("References"),
					}),
				)
				.describe("Shared step items"),
		},
		async ({ projectId, title, steps }) => {
			try {
				const custom_steps_separated = steps.map((step) => ({
					content: step.content,
					expected: step.expected || null,
					additional_info: step.additionalInfo || null,
					refs: step.refs || null,
				}));

				const sharedStep = await testRailClient.addSharedStep(projectId, {
					title,
					custom_steps_separated,
				});

				const successResponse = createSuccessResponse(
					"Shared step added successfully",
					{
						sharedStep,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error adding shared step to project ${projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// 共有ステップ更新
	server.tool(
		"updateSharedStep",
		{
			sharedStepId: z.number().describe("TestRail Shared Step ID"),
			title: z.string().optional().describe("Shared step title"),
			steps: z
				.array(
					z.object({
						content: z.string().describe("Step content"),
						expected: z.string().optional().describe("Expected result"),
						additionalInfo: z
							.string()
							.optional()
							.describe("Additional information"),
						refs: z.string().optional().describe("References"),
					}),
				)
				.optional()
				.describe("Shared step items"),
		},
		async ({ sharedStepId, title, steps }) => {
			try {
				const data: Record<string, unknown> = {};

				if (title) {
					data.title = title;
				}

				if (steps) {
					const custom_steps_separated = steps.map((step) => ({
						content: step.content,
						expected: step.expected || null,
						additional_info: step.additionalInfo || null,
						refs: step.refs || null,
					}));
					data.custom_steps_separated = custom_steps_separated;
				}

				const sharedStep = await testRailClient.updateSharedStep(
					sharedStepId,
					data,
				);

				const successResponse = createSuccessResponse(
					"Shared step updated successfully",
					{
						sharedStep,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error updating shared step ${sharedStepId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// 共有ステップ削除
	server.tool(
		"deleteSharedStep",
		{
			sharedStepId: z.number().describe("TestRail Shared Step ID"),
			keepInCases: z
				.boolean()
				.optional()
				.describe("Whether to keep the steps in cases that use them"),
		},
		async ({ sharedStepId, keepInCases = true }) => {
			try {
				await testRailClient.deleteSharedStep(sharedStepId, keepInCases);
				const successResponse = createSuccessResponse(
					"Shared step deleted successfully",
					{
						sharedStepId,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error deleting shared step ${sharedStepId}`,
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
