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
	server.tool("getProjects", {}, async (args, extra) => {
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
	});

	// Get a specific project by ID
	server.tool(
		"getProject",
		{
			projectId: getProjectSchema.shape.projectId,
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
		{
			name: addProjectSchema.shape.name,
			announcement: addProjectSchema.shape.announcement,
			show_announcement: addProjectSchema.shape.show_announcement,
			suite_mode: addProjectSchema.shape.suite_mode,
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
		{
			projectId: updateProjectSchema.shape.projectId,
			name: updateProjectSchema.shape.name,
			announcement: updateProjectSchema.shape.announcement,
			show_announcement: updateProjectSchema.shape.show_announcement,
			is_completed: updateProjectSchema.shape.is_completed,
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
		{
			projectId: deleteProjectSchema.shape.projectId,
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
