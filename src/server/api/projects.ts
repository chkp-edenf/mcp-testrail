import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/api/index.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";
import {
	getProjectsSchema,
	getProjectSchema,
	addProjectSchema,
	updateProjectSchema,
	deleteProjectSchema,
} from "../../shared/schemas/projects.js";

/**
 * Function to register project-related API tools
 * @param server McpServer instance
 * @param testRailClient TestRail client instance
 */
export function registerProjectTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// Get all projects
	server.tool(
		"getProjects",
		"Retrieves all TestRail projects / すべてのTestRailプロジェクトを取得します",
		{},
		async (args, extra) => {
			try {
				const projects = await testRailClient.projects.getProjects();
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
		},
	);

	// Get a specific project by ID
	server.tool(
		"getProject",
		"Retrieves details of a specific TestRail project by ID / 特定のTestRailプロジェクトの詳細をIDで取得します",
		{
			projectId: getProjectSchema.shape.projectId.describe(
				"TestRail Project ID to retrieve / 取得するTestRailプロジェクトID",
			),
		},
		async (args, extra) => {
			try {
				const { projectId } = args;
				const project = await testRailClient.projects.getProject(projectId);
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
					`Error fetching project ${args.projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Create a new project
	server.tool(
		"addProject",
		"Creates a new TestRail project / 新しいTestRailプロジェクトを作成します",
		{
			name: addProjectSchema.shape.name.describe(
				"Name of the project / プロジェクトの名前",
			),
			announcement: addProjectSchema.shape.announcement.describe(
				"Project announcement text (optional) / プロジェクトのお知らせテキスト（任意）",
			),
			show_announcement: addProjectSchema.shape.show_announcement.describe(
				"Whether to display the announcement (optional) / お知らせを表示するかどうか（任意）",
			),
			suite_mode: addProjectSchema.shape.suite_mode.describe(
				"Suite mode: 1 for single suite, 2 for baseline, 3 for multiple suites / スイートモード: 1=シングルスイート、2=ベースライン、3=マルチスイート",
			),
		},
		async (args, extra) => {
			try {
				const { name, announcement, show_announcement, suite_mode } = args;
				const project = await testRailClient.projects.addProject({
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

	// Update a project
	server.tool(
		"updateProject",
		"Updates an existing TestRail project / 既存のTestRailプロジェクトを更新します",
		{
			projectId: updateProjectSchema.shape.projectId.describe(
				"TestRail Project ID to update / 更新するTestRailプロジェクトID",
			),
			name: updateProjectSchema.shape.name.describe(
				"New name for the project (optional) / プロジェクトの新しい名前（任意）",
			),
			announcement: updateProjectSchema.shape.announcement.describe(
				"New announcement text (optional) / 新しいお知らせテキスト（任意）",
			),
			show_announcement: updateProjectSchema.shape.show_announcement.describe(
				"Whether to display the announcement (optional) / お知らせを表示するかどうか（任意）",
			),
			is_completed: updateProjectSchema.shape.is_completed.describe(
				"Whether the project is completed (optional) / プロジェクトが完了したかどうか（任意）",
			),
		},
		async (args, extra) => {
			try {
				const {
					projectId,
					name,
					announcement,
					show_announcement,
					is_completed,
				} = args;
				const project = await testRailClient.projects.updateProject(projectId, {
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
					`Error updating project ${args.projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Delete a project
	server.tool(
		"deleteProject",
		"Deletes a TestRail project / TestRailプロジェクトを削除します",
		{
			projectId: deleteProjectSchema.shape.projectId.describe(
				"TestRail Project ID to delete / 削除するTestRailプロジェクトID",
			),
		},
		async (args, extra) => {
			try {
				const { projectId } = args;
				await testRailClient.projects.deleteProject(projectId);
				const successResponse = createSuccessResponse(
					`Project ${projectId} deleted successfully`,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error deleting project ${args.projectId}`,
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
