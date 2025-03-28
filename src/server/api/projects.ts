import { z } from "zod";
import { FastMCP } from "fastmcp";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * プロジェクト関連のAPIツールを登録する関数
 * @param server FastMCPサーバーインスタンス
 * @param testRailClient TestRailクライアントインスタンス
 */
export function registerProjectTools(
	server: FastMCP,
	testRailClient: TestRailClient,
): void {
	// プロジェクト一覧取得
	server.addTool({
		name: "getProjects",
		description: "Get a list of projects from TestRail",
		parameters: z.object({}),
		execute: async () => {
			try {
				const projects = await testRailClient.getProjects();
				return createSuccessResponse("Projects retrieved successfully", {
					data: projects,
				});
			} catch (error) {
				return createErrorResponse("Error fetching projects", error);
			}
		},
	});

	// 特定のプロジェクトの詳細取得
	server.addTool({
		name: "getProject",
		description: "Get details of a specific project from TestRail",
		parameters: z.object({
			projectId: z.number().describe("TestRail Project ID"),
		}),
		execute: async ({ projectId }) => {
			try {
				const project = await testRailClient.getProject(projectId);
				return createSuccessResponse("Project retrieved successfully", {
					project,
				});
			} catch (error) {
				return createErrorResponse(
					`Error fetching project ${projectId}`,
					error,
				);
			}
		},
	});

	// 新規プロジェクト作成
	server.addTool({
		name: "addProject",
		description: "Create a new project in TestRail",
		parameters: z.object({
			name: z.string().describe("Project name (required)"),
			announcement: z
				.string()
				.optional()
				.describe("Project description/announcement"),
			show_announcement: z
				.boolean()
				.optional()
				.describe("Show announcement on project overview page"),
			suite_mode: z
				.number()
				.optional()
				.describe(
					"Suite mode (1: single suite, 2: single + baselines, 3: multiple suites)",
				),
		}),
		execute: async ({ name, announcement, show_announcement, suite_mode }) => {
			try {
				const project = await testRailClient.addProject({
					name,
					announcement,
					show_announcement,
					suite_mode,
				});
				return createSuccessResponse("Project created successfully", {
					project,
				});
			} catch (error) {
				return createErrorResponse("Error creating project", error);
			}
		},
	});

	// プロジェクト更新
	server.addTool({
		name: "updateProject",
		description: "Update an existing project in TestRail",
		parameters: z.object({
			projectId: z.number().describe("TestRail Project ID"),
			name: z.string().optional().describe("Project name"),
			announcement: z
				.string()
				.optional()
				.describe("Project description/announcement"),
			show_announcement: z
				.boolean()
				.optional()
				.describe("Show announcement on project overview page"),
			is_completed: z
				.boolean()
				.optional()
				.describe("Mark project as completed"),
		}),
		execute: async ({
			projectId,
			name,
			announcement,
			show_announcement,
			is_completed,
		}) => {
			try {
				const project = await testRailClient.updateProject(projectId, {
					name,
					announcement,
					show_announcement,
					is_completed,
				});
				return createSuccessResponse("Project updated successfully", {
					project,
				});
			} catch (error) {
				return createErrorResponse(
					`Error updating project ${projectId}`,
					error,
				);
			}
		},
	});

	// プロジェクト削除
	server.addTool({
		name: "deleteProject",
		description: "Delete an existing project in TestRail (cannot be undone)",
		parameters: z.object({
			projectId: z.number().describe("TestRail Project ID"),
		}),
		execute: async ({ projectId }) => {
			try {
				await testRailClient.deleteProject(projectId);
				return createSuccessResponse(
					`Project ${projectId} deleted successfully`,
				);
			} catch (error) {
				return createErrorResponse(
					`Error deleting project ${projectId}`,
					error,
				);
			}
		},
	});
}
