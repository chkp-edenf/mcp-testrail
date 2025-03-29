import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/api/index.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";
import {
	getSectionSchema,
	getSectionsSchema,
	addSectionSchema,
	moveSectionSchema,
	updateSectionSchema,
	deleteSectionSchema,
} from "../../shared/schemas/sections.js";

/**
 * Function to register section-related API tools
 * @param server McpServer instance
 * @param testRailClient TestRail client instance
 */
export function registerSectionTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// Get a specific section
	server.tool("getSection", getSectionSchema, async ({ sectionId }) => {
		try {
			const section = await testRailClient.sections.getSection(sectionId);
			const successResponse = createSuccessResponse(
				"Section retrieved successfully",
				{
					section,
				},
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				`Error fetching section ${sectionId}`,
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// Get all sections for a project or suite
	server.tool(
		"getSections",
		getSectionsSchema,
		async ({ projectId, suiteId }) => {
			try {
				const sections = await testRailClient.sections.getSections(
					projectId,
					suiteId,
				);
				const successResponse = createSuccessResponse(
					"Sections retrieved successfully",
					{
						sections,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching sections for project ${projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Create a new section
	server.tool(
		"addSection",
		addSectionSchema,
		async ({ projectId, name, description, suiteId, parentId }) => {
			try {
				const data = {
					name,
					description,
					suite_id: suiteId,
					parent_id: parentId,
				};

				const section = await testRailClient.sections.addSection(
					projectId,
					data,
				);
				const successResponse = createSuccessResponse(
					"Section created successfully",
					{
						section,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					"Error creating section",
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Move a section
	server.tool(
		"moveSection",
		moveSectionSchema,
		async ({ sectionId, parentId, afterId }) => {
			try {
				const moveData: {
					parent_id?: number | null;
					after_id?: number | null;
				} = {};

				if (parentId !== undefined) moveData.parent_id = parentId;
				if (afterId !== undefined) moveData.after_id = afterId;

				const section = await testRailClient.sections.moveSection(
					sectionId,
					moveData,
				);
				const successResponse = createSuccessResponse(
					"Section moved successfully",
					{
						section,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error moving section ${sectionId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Update a section
	server.tool(
		"updateSection",
		updateSectionSchema,
		async ({ sectionId, name, description }) => {
			try {
				const updateData: { name?: string; description?: string } = {};
				if (name) updateData.name = name;
				if (description) updateData.description = description;

				const section = await testRailClient.sections.updateSection(
					sectionId,
					updateData,
				);
				const successResponse = createSuccessResponse(
					"Section updated successfully",
					{
						section,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error updating section ${sectionId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Delete a section
	server.tool(
		"deleteSection",
		deleteSectionSchema,
		async ({ sectionId, soft }) => {
			try {
				await testRailClient.sections.deleteSection(sectionId, soft);
				const successResponse = createSuccessResponse(
					`Section ${sectionId} deleted successfully`,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error deleting section ${sectionId}`,
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
