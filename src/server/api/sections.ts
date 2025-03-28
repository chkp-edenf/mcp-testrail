import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/testRailApi.js";
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
 * セクション関連のAPIツールを登録する関数
 * @param server McpServerインスタンス
 * @param testRailClient TestRailクライアントインスタンス
 */
export function registerSectionTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// セクション取得
	server.tool("getSection", getSectionSchema, async ({ sectionId }) => {
		try {
			const section = await testRailClient.getSection(sectionId);
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
				`Error getting section ${sectionId}`,
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// プロジェクトのセクション一覧取得
	server.tool(
		"getSections",
		getSectionsSchema,
		async ({ projectId, suiteId }) => {
			try {
				const sections = await testRailClient.getSections(projectId, suiteId);
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
					`Error getting sections for project ${projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// セクション作成
	server.tool(
		"addSection",
		addSectionSchema,
		async ({ projectId, name, description, suiteId, parentId }) => {
			try {
				const sectionData = {
					name: name,
					description: description,
					suite_id: suiteId,
					parent_id: parentId,
				};

				const section = await testRailClient.addSection(projectId, sectionData);
				const successResponse = createSuccessResponse(
					"Section added successfully",
					{ section },
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error adding section to project ${projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// セクション移動
	server.tool(
		"moveSection",
		moveSectionSchema,
		async ({ sectionId, parentId, afterId }) => {
			try {
				const data: Record<string, unknown> = {};
				if (parentId !== undefined) data.parent_id = parentId;
				if (afterId !== undefined) data.after_id = afterId;

				const section = await testRailClient.moveSection(sectionId, data);
				const successResponse = createSuccessResponse(
					"Section moved successfully",
					{ section },
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

	// セクション更新
	server.tool(
		"updateSection",
		updateSectionSchema,
		async ({ sectionId, name, description }) => {
			try {
				const data: Record<string, unknown> = {};
				if (name) data.name = name;
				if (description !== undefined) data.description = description;

				const section = await testRailClient.updateSection(sectionId, data);
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

	// セクション削除
	server.tool(
		"deleteSection",
		deleteSectionSchema,
		async ({ sectionId, soft }) => {
			try {
				await testRailClient.deleteSection(sectionId, soft);
				const successResponse = createSuccessResponse(
					"Section deleted successfully",
					{
						sectionId,
					},
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
