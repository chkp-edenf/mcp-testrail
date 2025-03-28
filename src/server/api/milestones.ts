import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * マイルストーン関連のAPIツールを登録する関数
 * @param server McpServerインスタンス
 * @param testRailClient TestRailクライアントインスタンス
 */
export function registerMilestoneTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// プロジェクトのマイルストーン一覧取得
	server.tool(
		"getMilestones",
		{
			projectId: z.number().describe("TestRail Project ID"),
		},
		async ({ projectId }) => {
			try {
				const milestones = await testRailClient.getMilestones(projectId);
				const successResponse = createSuccessResponse(
					`Milestones for project ${projectId} retrieved successfully`,
					{ milestones },
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					"Error fetching milestones",
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// マイルストーン取得
	server.tool(
		"getMilestone",
		{
			milestoneId: z.number().describe("TestRail Milestone ID"),
		},
		async ({ milestoneId }) => {
			try {
				const milestone = await testRailClient.getMilestone(milestoneId);
				const successResponse = createSuccessResponse(
					`Milestone ${milestoneId} retrieved successfully`,
					{ milestone },
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					"Error fetching milestone",
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// マイルストーン作成
	server.tool(
		"addMilestone",
		{
			projectId: z.number().describe("TestRail Project ID"),
			name: z.string().describe("Milestone name (required)"),
			description: z.string().optional().describe("Milestone description"),
			due_on: z.number().optional().describe("Due date (timestamp)"),
			start_on: z.number().optional().describe("Start date (timestamp)"),
			parent_id: z
				.number()
				.optional()
				.describe("Parent milestone ID (for sub-milestones)"),
			refs: z
				.string()
				.optional()
				.describe("Reference information or issue keys"),
			is_completed: z
				.boolean()
				.optional()
				.describe("Completion status of the milestone"),
			is_started: z
				.boolean()
				.optional()
				.describe("Started status of the milestone"),
		},
		async (params) => {
			try {
				const { projectId, ...milestoneData } = params;
				const milestone = await testRailClient.addMilestone(
					projectId,
					milestoneData,
				);
				const successResponse = createSuccessResponse(
					`Milestone '${milestoneData.name}' created successfully`,
					{ milestone },
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					"Error creating milestone",
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// マイルストーン更新
	server.tool(
		"updateMilestone",
		{
			milestoneId: z.number().describe("TestRail Milestone ID"),
			name: z.string().optional().describe("Milestone name"),
			description: z.string().optional().describe("Milestone description"),
			due_on: z.number().optional().describe("Due date (timestamp)"),
			start_on: z.number().optional().describe("Start date (timestamp)"),
			parent_id: z
				.number()
				.optional()
				.describe("Parent milestone ID (for sub-milestones)"),
			refs: z
				.string()
				.optional()
				.describe("Reference information or issue keys"),
			is_completed: z
				.boolean()
				.optional()
				.describe("Completion status of the milestone"),
			is_started: z
				.boolean()
				.optional()
				.describe("Started status of the milestone"),
		},
		async (params) => {
			try {
				const { milestoneId, ...milestoneData } = params;
				const milestone = await testRailClient.updateMilestone(
					milestoneId,
					milestoneData,
				);
				const successResponse = createSuccessResponse(
					`Milestone ${milestoneId} updated successfully`,
					{ milestone },
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					"Error updating milestone",
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// マイルストーン削除
	server.tool(
		"deleteMilestone",
		{
			milestoneId: z.number().describe("TestRail Milestone ID"),
		},
		async ({ milestoneId }) => {
			try {
				await testRailClient.deleteMilestone(milestoneId);
				const successResponse = createSuccessResponse(
					`Milestone ${milestoneId} deleted successfully`,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					"Error deleting milestone",
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
