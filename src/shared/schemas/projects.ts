import { z } from "zod";

// プロジェクト一覧取得のためのスキーマ
export const getProjectsSchema = {
	// 特にパラメータの必要がないため空オブジェクト
};

// 特定のプロジェクト取得のためのスキーマ
export const getProjectSchema = {
	projectId: z.number().describe("TestRail Project ID"),
};

// プロジェクト追加のためのスキーマ
export const addProjectSchema = {
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
};

// プロジェクト更新のためのスキーマ
export const updateProjectSchema = {
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
	is_completed: z.boolean().optional().describe("Mark project as completed"),
};

// プロジェクト削除のためのスキーマ
export const deleteProjectSchema = {
	projectId: z.number().describe("TestRail Project ID"),
};

// 各スキーマからZodオブジェクトを作成
export const GetProjectsInput = z.object(getProjectsSchema);
export const GetProjectInput = z.object(getProjectSchema);
export const AddProjectInput = z.object(addProjectSchema);
export const UpdateProjectInput = z.object(updateProjectSchema);
export const DeleteProjectInput = z.object(deleteProjectSchema);

// 入力型を抽出
export type GetProjectsInputType = z.infer<typeof GetProjectsInput>;
export type GetProjectInputType = z.infer<typeof GetProjectInput>;
export type AddProjectInputType = z.infer<typeof AddProjectInput>;
export type UpdateProjectInputType = z.infer<typeof UpdateProjectInput>;
export type DeleteProjectInputType = z.infer<typeof DeleteProjectInput>;

// -----------------------------------------------
// レスポンススキーマ定義 - types.tsからの移行
// -----------------------------------------------

/**
 * TestRail API Response for Project
 */
export const TestRailProjectSchema = z.object({
	id: z.number(),
	name: z.string(),
	announcement: z.string(),
	show_announcement: z.boolean(),
	is_completed: z.boolean(),
	completed_on: z.number(),
	suite_mode: z.number(),
	url: z.string(),
});
export type TestRailProject = z.infer<typeof TestRailProjectSchema>;
