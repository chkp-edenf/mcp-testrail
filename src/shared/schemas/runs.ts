import { z } from "zod";

// テスト実行一覧取得のためのスキーマ
export const getRunsSchema = {
	projectId: z.number().describe("TestRail Project ID"),
	createdAfter: z
		.number()
		.optional()
		.describe("Only return runs created after this timestamp"),
	createdBefore: z
		.number()
		.optional()
		.describe("Only return runs created before this timestamp"),
	createdBy: z
		.array(z.number())
		.optional()
		.describe("Only return runs created by these user IDs"),
	milestoneId: z
		.number()
		.optional()
		.describe("Only return runs for this milestone"),
	suiteId: z
		.number()
		.optional()
		.describe("Only return runs for this test suite"),
	limit: z
		.number()
		.optional()
		.describe("The number of runs to return per page"),
	offset: z.number().optional().describe("The offset to start returning runs"),
};

// 特定のテスト実行取得のためのスキーマ
export const getRunSchema = {
	runId: z.number().describe("TestRail Run ID"),
};

// テスト実行追加のためのスキーマ
export const addRunSchema = {
	projectId: z.number().describe("TestRail Project ID"),
	name: z.string().describe("Test run name"),
	suiteId: z
		.number()
		.optional()
		.describe("Suite ID (required for multi-suite projects)"),
	description: z.string().optional().describe("Test run description"),
	milestoneId: z.number().optional().describe("Milestone ID"),
	assignedtoId: z.number().optional().describe("User ID to assign to"),
	includeAll: z
		.boolean()
		.optional()
		.describe("Include all test cases from the suite"),
	caseIds: z
		.array(z.number())
		.optional()
		.describe("Specific case IDs to include"),
	configIds: z
		.array(z.number())
		.optional()
		.describe("Configuration IDs to use"),
	refs: z.string().optional().describe("Reference/requirement IDs"),
};

// テスト実行更新のためのスキーマ
export const updateRunSchema = {
	runId: z.number().describe("TestRail Run ID"),
	name: z.string().optional().describe("Test run name"),
	description: z.string().optional().describe("Test run description"),
	milestoneId: z.number().optional().describe("Milestone ID"),
	assignedtoId: z.number().optional().describe("User ID to assign to"),
	includeAll: z
		.boolean()
		.optional()
		.describe("Include all test cases from the suite"),
	caseIds: z
		.array(z.number())
		.optional()
		.describe("Specific case IDs to include"),
	refs: z.string().optional().describe("Reference/requirement IDs"),
};

// テスト実行クローズのためのスキーマ
export const closeRunSchema = {
	runId: z.number().describe("TestRail Run ID"),
};

// テスト実行削除のためのスキーマ
export const deleteRunSchema = {
	runId: z.number().describe("TestRail Run ID"),
};

// 各スキーマからZodオブジェクトを作成
export const GetRunsInput = z.object(getRunsSchema);
export const GetRunInput = z.object(getRunSchema);
export const AddRunInput = z.object(addRunSchema);
export const UpdateRunInput = z.object(updateRunSchema);
export const CloseRunInput = z.object(closeRunSchema);
export const DeleteRunInput = z.object(deleteRunSchema);

// 入力型を抽出
export type GetRunsInputType = z.infer<typeof GetRunsInput>;
export type GetRunInputType = z.infer<typeof GetRunInput>;
export type AddRunInputType = z.infer<typeof AddRunInput>;
export type UpdateRunInputType = z.infer<typeof UpdateRunInput>;
export type CloseRunInputType = z.infer<typeof CloseRunInput>;
export type DeleteRunInputType = z.infer<typeof DeleteRunInput>;

// -----------------------------------------------
// レスポンススキーマ定義 - types.tsからの移行
// -----------------------------------------------

/**
 * TestRail API Response for Test
 */
export const TestRailTestSchema = z.object({
	id: z.number(),
	case_id: z.number(),
	status_id: z.number(),
	assignedto_id: z.number(),
	run_id: z.number(),
	title: z.string(),
	template_id: z.number(),
	type_id: z.number(),
	priority_id: z.number(),
	milestone_id: z.number(),
	refs: z.string(),
	estimate: z.string(),
	estimate_forecast: z.string(),
	custom_preconds: z.string(),
	custom_steps: z.string(),
	custom_expected: z.string(),
});
export type TestRailTest = z.infer<typeof TestRailTestSchema>;

/**
 * TestRail API Response for Run
 */
export const TestRailRunSchema = z.object({
	id: z.number(),
	suite_id: z.number(),
	name: z.string(),
	description: z.string(),
	milestone_id: z.number().nullable(),
	assignedto_id: z.number().nullable(),
	include_all: z.boolean(),
	is_completed: z.boolean(),
	completed_on: z.number().nullable(),
	config: z.string().nullable(),
	config_ids: z.array(z.number()),
	passed_count: z.number(),
	blocked_count: z.number(),
	untested_count: z.number(),
	retest_count: z.number(),
	failed_count: z.number(),
	custom_status_count: z.record(z.number()),
	created_on: z.number(),
	created_by: z.number(),
	plan_id: z.number(),
	url: z.string(),
	refs: z.string(),
});
export type TestRailRun = z.infer<typeof TestRailRunSchema>;
