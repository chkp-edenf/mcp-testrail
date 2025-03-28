import { z } from "zod";
import { FastMCP } from "fastmcp";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * セクション関連のAPIツールを登録する関数
 * @param server FastMCPサーバーインスタンス
 * @param testRailClient TestRailクライアントインスタンス
 */
export function registerSectionTools(
	server: FastMCP,
	testRailClient: TestRailClient,
): void {
	// セクション取得
	server.addTool({
		name: "getSection",
		description: "Get details of a specific section from TestRail",
		parameters: z.object({
			sectionId: z.number().describe("TestRail Section ID"),
		}),
		execute: async ({ sectionId }) => {
			try {
				const section = await testRailClient.getSection(sectionId);
				return createSuccessResponse("Section retrieved successfully", {
					section,
				});
			} catch (error) {
				return createErrorResponse(`Error getting section ${sectionId}`, error);
			}
		},
	});

	// プロジェクトのセクション一覧取得
	server.addTool({
		name: "getSections",
		description: "Get all sections for a project from TestRail",
		parameters: z.object({
			projectId: z.number().describe("TestRail Project ID"),
			suiteId: z
				.number()
				.optional()
				.describe("TestRail Suite ID (optional for single suite projects)"),
		}),
		execute: async ({ projectId, suiteId }) => {
			try {
				const sections = await testRailClient.getSections(projectId, suiteId);
				return createSuccessResponse("Sections retrieved successfully", {
					sections,
				});
			} catch (error) {
				return createErrorResponse(
					`Error getting sections for project ${projectId}`,
					error,
				);
			}
		},
	});

	// セクション作成
	server.addTool({
		name: "addSection",
		description: "Add a new section to TestRail",
		parameters: z.object({
			projectId: z.number().describe("TestRail Project ID"),
			name: z.string().describe("Section name (required)"),
			description: z.string().optional().describe("Section description"),
			suiteId: z
				.number()
				.optional()
				.describe("Test Suite ID (required for multi-suite projects)"),
			parentId: z.number().optional().describe("Parent section ID"),
		}),
		execute: async ({ projectId, name, description, suiteId, parentId }) => {
			try {
				const sectionData = {
					name: name,
					description: description,
					suite_id: suiteId,
					parent_id: parentId,
				};

				const section = await testRailClient.addSection(projectId, sectionData);
				return createSuccessResponse("Section added successfully", { section });
			} catch (error) {
				return createErrorResponse(
					`Error adding section to project ${projectId}`,
					error,
				);
			}
		},
	});

	// セクション移動
	server.addTool({
		name: "moveSection",
		description: "Move a section to a different parent or position in TestRail",
		parameters: z.object({
			sectionId: z.number().describe("TestRail Section ID"),
			parentId: z
				.number()
				.nullable()
				.optional()
				.describe("Parent section ID (null for root)"),
			afterId: z
				.number()
				.nullable()
				.optional()
				.describe("ID of the section to position after"),
		}),
		execute: async ({ sectionId, parentId, afterId }) => {
			try {
				const data: Record<string, unknown> = {};
				if (parentId !== undefined) data.parent_id = parentId;
				if (afterId !== undefined) data.after_id = afterId;

				const section = await testRailClient.moveSection(sectionId, data);
				return createSuccessResponse("Section moved successfully", { section });
			} catch (error) {
				return createErrorResponse(`Error moving section ${sectionId}`, error);
			}
		},
	});

	// セクション更新
	server.addTool({
		name: "updateSection",
		description: "Update an existing section in TestRail",
		parameters: z.object({
			sectionId: z.number().describe("TestRail Section ID"),
			name: z.string().optional().describe("Section name"),
			description: z.string().optional().describe("Section description"),
		}),
		execute: async ({ sectionId, name, description }) => {
			try {
				const data: Record<string, unknown> = {};
				if (name) data.name = name;
				if (description !== undefined) data.description = description;

				const section = await testRailClient.updateSection(sectionId, data);
				return createSuccessResponse("Section updated successfully", {
					section,
				});
			} catch (error) {
				return createErrorResponse(
					`Error updating section ${sectionId}`,
					error,
				);
			}
		},
	});

	// セクション削除
	server.addTool({
		name: "deleteSection",
		description: "Delete an existing section in TestRail",
		parameters: z.object({
			sectionId: z.number().describe("TestRail Section ID"),
			soft: z
				.boolean()
				.optional()
				.describe("True for soft delete (preview only)"),
		}),
		execute: async ({ sectionId, soft }) => {
			try {
				await testRailClient.deleteSection(sectionId, soft);
				return createSuccessResponse("Section deleted successfully", {
					sectionId,
				});
			} catch (error) {
				return createErrorResponse(
					`Error deleting section ${sectionId}`,
					error,
				);
			}
		},
	});
}
