import { z } from "zod";

// 特定のセクション取得のためのスキーマ
export const getSectionSchema = {
	sectionId: z.number().describe("TestRail Section ID"),
};

// プロジェクト内のセクション一覧取得のためのスキーマ
export const getSectionsSchema = {
	projectId: z.number().describe("TestRail Project ID"),
	suiteId: z
		.number()
		.optional()
		.describe("TestRail Suite ID (optional for single suite projects)"),
};

// セクション追加のためのスキーマ
export const addSectionSchema = {
	projectId: z.number().describe("TestRail Project ID"),
	name: z.string().describe("Section name (required)"),
	description: z.string().optional().describe("Section description"),
	parentId: z.number().optional().describe("Parent section ID"),
	suiteId: z
		.number()
		.optional()
		.describe("Test Suite ID (required for multi-suite projects)"),
};

// セクション移動のためのスキーマ
export const moveSectionSchema = {
	sectionId: z.number().describe("TestRail Section ID"),
	parentId: z.number().nullable().describe("Parent section ID (null for root)"),
	afterId: z
		.number()
		.nullable()
		.optional()
		.describe("ID of the section to position after"),
};

// セクション更新のためのスキーマ
export const updateSectionSchema = {
	sectionId: z.number().describe("TestRail Section ID"),
	name: z.string().optional().describe("Section name"),
	description: z.string().optional().describe("Section description"),
};

// セクション削除のためのスキーマ
export const deleteSectionSchema = {
	sectionId: z.number().describe("TestRail Section ID"),
	soft: z.boolean().optional().describe("True for soft delete (preview only)"),
};

// 各スキーマからZodオブジェクトを作成
export const GetSectionInput = z.object(getSectionSchema);
export const GetSectionsInput = z.object(getSectionsSchema);
export const AddSectionInput = z.object(addSectionSchema);
export const MoveSectionInput = z.object(moveSectionSchema);
export const UpdateSectionInput = z.object(updateSectionSchema);
export const DeleteSectionInput = z.object(deleteSectionSchema);

// 入力型を抽出
export type GetSectionInputType = z.infer<typeof GetSectionInput>;
export type GetSectionsInputType = z.infer<typeof GetSectionsInput>;
export type AddSectionInputType = z.infer<typeof AddSectionInput>;
export type MoveSectionInputType = z.infer<typeof MoveSectionInput>;
export type UpdateSectionInputType = z.infer<typeof UpdateSectionInput>;
export type DeleteSectionInputType = z.infer<typeof DeleteSectionInput>;

// -----------------------------------------------
// レスポンススキーマ定義 - types.tsからの移行
// -----------------------------------------------

/**
 * TestRail API Response for Section
 */
export const TestRailSectionSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().nullable().optional(),
	suite_id: z.number(),
	parent_id: z.number().nullable().optional(),
	depth: z.number(),
	display_order: z.number(),
});
export type TestRailSection = z.infer<typeof TestRailSectionSchema>;
