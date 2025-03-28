import { z } from "zod";
import { FastMCP } from "fastmcp";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * マイルストーン関連のAPIツールを登録する関数
 * @param server FastMCPサーバーインスタンス
 * @param testRailClient TestRailクライアントインスタンス
 */
export function registerMilestoneTools(
	server: FastMCP,
	testRailClient: TestRailClient,
): void {
	// プロジェクトのマイルストーン一覧取得
	server.addTool({
		name: "getMilestones",
		description: "Get all milestones for a project from TestRail",
		parameters: z.object({
			projectId: z.number().describe("TestRail Project ID"),
		}),
		execute: async ({ projectId }) => {
			try {
				const milestones = await testRailClient.getMilestones(projectId);
				return createSuccessResponse(
					`Milestones for project ${projectId} retrieved successfully`,
					{ milestones },
				);
			} catch (error) {
				return createErrorResponse("Error fetching milestones", error);
			}
		},
	});

	// マイルストーン取得
	server.addTool({
		name: "getMilestone",
		description: "Get a specific milestone from TestRail",
		parameters: z.object({
			milestoneId: z.number().describe("TestRail Milestone ID"),
		}),
		execute: async ({ milestoneId }) => {
			try {
				const milestone = await testRailClient.getMilestone(milestoneId);
				return createSuccessResponse(
					`Milestone ${milestoneId} retrieved successfully`,
					{ milestone },
				);
			} catch (error) {
				return createErrorResponse("Error fetching milestone", error);
			}
		},
	});

	// マイルストーン作成
	server.addTool({
		name: "addMilestone",
		description: "Create a new milestone in TestRail",
		parameters: z.object({
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
		}),
		execute: async (params) => {
			try {
				const { projectId, ...milestoneData } = params;
				const milestone = await testRailClient.addMilestone(
					projectId,
					milestoneData,
				);
				return createSuccessResponse(
					`Milestone '${milestoneData.name}' created successfully`,
					{ milestone },
				);
			} catch (error) {
				return createErrorResponse("Error creating milestone", error);
			}
		},
	});

	// マイルストーン更新
	server.addTool({
		name: "updateMilestone",
		description: "Update an existing milestone in TestRail",
		parameters: z.object({
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
		}),
		execute: async (params) => {
			try {
				const { milestoneId, ...milestoneData } = params;
				const milestone = await testRailClient.updateMilestone(
					milestoneId,
					milestoneData,
				);
				return createSuccessResponse(
					`Milestone ${milestoneId} updated successfully`,
					{ milestone },
				);
			} catch (error) {
				return createErrorResponse("Error updating milestone", error);
			}
		},
	});

	// マイルストーン削除
	server.addTool({
		name: "deleteMilestone",
		description: "Delete a milestone from TestRail",
		parameters: z.object({
			milestoneId: z.number().describe("TestRail Milestone ID"),
		}),
		execute: async ({ milestoneId }) => {
			try {
				await testRailClient.deleteMilestone(milestoneId);
				return createSuccessResponse(
					`Milestone ${milestoneId} deleted successfully`,
				);
			} catch (error) {
				return createErrorResponse("Error deleting milestone", error);
			}
		},
	});
}
