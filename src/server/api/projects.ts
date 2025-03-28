import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";
import {
	getProjectsSchema,
	getProjectSchema,
	addProjectSchema,
	updateProjectSchema,
	deleteProjectSchema,
} from "../../shared/schemas/projects.js";

/**
 * プロジェクト関連のAPIツールを登録する関数
 * @param server McpServerインスタンス
 * @param testRailClient TestRailクライアントインスタンス
 */
export function registerProjectTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// プロジェクト一覧取得
	server.tool("getProjects", getProjectsSchema, async () => {
		try {
			const projects = await testRailClient.getProjects();
			const successResponse = createSuccessResponse(
				"Projects retrieved successfully",
				{
					data: projects,
				},
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				"Error fetching projects",
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// 特定のプロジェクトの詳細取得
	server.tool("getProject", getProjectSchema, async ({ projectId }) => {
		try {
			const project = await testRailClient.getProject(projectId);
			const successResponse = createSuccessResponse(
				"Project retrieved successfully",
				{
					project,
				},
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				`Error fetching project ${projectId}`,
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// 新規プロジェクト作成
	server.tool(
		"addProject",
		addProjectSchema,
		async ({ name, announcement, show_announcement, suite_mode }) => {
			try {
				const project = await testRailClient.addProject({
					name,
					announcement,
					show_announcement,
					suite_mode,
				});
				const successResponse = createSuccessResponse(
					"Project created successfully",
					{
						project,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					"Error creating project",
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// プロジェクト更新
	server.tool(
		"updateProject",
		updateProjectSchema,
		async ({
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
				const successResponse = createSuccessResponse(
					"Project updated successfully",
					{
						project,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error updating project ${projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// プロジェクト削除
	server.tool("deleteProject", deleteProjectSchema, async ({ projectId }) => {
		try {
			await testRailClient.deleteProject(projectId);
			const successResponse = createSuccessResponse(
				`Project ${projectId} deleted successfully`,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				`Error deleting project ${projectId}`,
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});
}
