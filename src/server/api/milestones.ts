import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";
import {
	getMilestonesSchema,
	getMilestoneSchema,
	addMilestoneSchema,
	updateMilestoneSchema,
	deleteMilestoneSchema,
} from "../../shared/schemas/milestones.js";

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
	server.tool("getMilestones", getMilestonesSchema, async ({ projectId }) => {
		try {
			const milestones = await testRailClient.getMilestones(projectId);
			const successResponse = createSuccessResponse(
				"Milestones retrieved successfully",
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
	});

	// マイルストーン取得
	server.tool("getMilestone", getMilestoneSchema, async ({ milestoneId }) => {
		try {
			const milestone = await testRailClient.getMilestone(milestoneId);
			const successResponse = createSuccessResponse(
				"Milestone retrieved successfully",
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
	});

	// マイルストーン作成
	server.tool("addMilestone", addMilestoneSchema, async (params) => {
		try {
			const { projectId, ...milestoneData } = params;
			const milestone = await testRailClient.addMilestone(
				projectId,
				milestoneData,
			);
			const successResponse = createSuccessResponse(
				"Milestone created successfully",
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
	});

	// マイルストーン更新
	server.tool("updateMilestone", updateMilestoneSchema, async (params) => {
		try {
			const { milestoneId, ...milestoneData } = params;
			const milestone = await testRailClient.updateMilestone(
				milestoneId,
				milestoneData,
			);
			const successResponse = createSuccessResponse(
				"Milestone updated successfully",
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
	});

	// マイルストーン削除
	server.tool(
		"deleteMilestone",
		deleteMilestoneSchema,
		async ({ milestoneId }) => {
			try {
				await testRailClient.deleteMilestone(milestoneId);
				const successResponse = createSuccessResponse(
					"Milestone deleted successfully",
					{ milestoneId },
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
