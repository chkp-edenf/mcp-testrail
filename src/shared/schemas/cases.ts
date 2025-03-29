import { z } from "zod";

// 特定のテストケース取得のためのスキーマ
export const getTestCaseSchema = {
	caseId: z.number().describe("TestRail Test Case ID"),
};

// プロジェクト内のテストケース一覧取得のためのスキーマ
export const getTestCasesSchema = {
	projectId: z.number().describe("TestRail Project ID"),
};

// テストケース追加のためのスキーマ
export const addTestCaseSchema = {
	sectionId: z.number().describe("TestRail Section ID"),
	title: z.string().describe("Test case title"),
	typeId: z.number().optional().describe("Test case type ID"),
	priorityId: z.number().optional().describe("Test case priority ID"),
	estimate: z
		.string()
		.optional()
		.describe("Time estimate (e.g., '30s', '1m 45s', '3h')"),
	milestoneId: z.number().optional().describe("Milestone ID"),
	refs: z.string().optional().describe("Reference/requirement IDs"),
	customPrerequisites: z.string().optional().describe("Prerequisites"),
	customSteps: z.string().optional().describe("Test case steps"),
	customExpected: z.string().optional().describe("Expected results"),
};

// テストケース更新のためのスキーマ
export const updateTestCaseSchema = {
	caseId: z.number().describe("TestRail Test Case ID"),
	title: z.string().optional().describe("Test case title"),
	typeId: z.number().optional().describe("Test case type ID"),
	priorityId: z.number().optional().describe("Test case priority ID"),
	estimate: z
		.string()
		.optional()
		.describe("Time estimate (e.g., '30s', '1m 45s', '3h')"),
	milestoneId: z.number().optional().describe("Milestone ID"),
	refs: z.string().optional().describe("Reference/requirement IDs"),
	customPrerequisites: z.string().optional().describe("Prerequisites"),
	customSteps: z.string().optional().describe("Test case steps"),
	customExpected: z.string().optional().describe("Expected results"),
};

// テストケース削除のためのスキーマ
export const deleteTestCaseSchema = {
	caseId: z.number().describe("TestRail Test Case ID"),
};

// テストケースタイプ取得のためのスキーマ
export const getTestCaseTypesSchema = {
	// 特にパラメータの必要がないため空オブジェクト
};

// テストケースフィールド取得のためのスキーマ
export const getTestCaseFieldsSchema = {
	// 特にパラメータの必要がないため空オブジェクト
};

// テストケースをセクションにコピーするためのスキーマ
export const copyTestCasesToSectionSchema = {
	sectionId: z.number().describe("Target TestRail Section ID"),
	caseIds: z.array(z.number()).describe("Array of Test Case IDs to copy"),
};

// テストケースをセクションに移動するためのスキーマ
export const moveTestCasesToSectionSchema = {
	sectionId: z.number().describe("Target TestRail Section ID"),
	caseIds: z.array(z.number()).describe("Array of Test Case IDs to move"),
};

// テストケース履歴取得のためのスキーマ
export const getTestCaseHistorySchema = {
	caseId: z.number().describe("TestRail Test Case ID"),
};

// 各スキーマからZodオブジェクトを作成
export const GetTestCaseInput = z.object(getTestCaseSchema);
export const GetTestCasesInput = z.object(getTestCasesSchema);
export const AddTestCaseInput = z.object(addTestCaseSchema);
export const UpdateTestCaseInput = z.object(updateTestCaseSchema);
export const DeleteTestCaseInput = z.object(deleteTestCaseSchema);
export const GetTestCaseTypesInput = z.object(getTestCaseTypesSchema);
export const GetTestCaseFieldsInput = z.object(getTestCaseFieldsSchema);
export const CopyTestCasesToSectionInput = z.object(
	copyTestCasesToSectionSchema,
);
export const MoveTestCasesToSectionInput = z.object(
	moveTestCasesToSectionSchema,
);
export const GetTestCaseHistoryInput = z.object(getTestCaseHistorySchema);

// 入力型を抽出
export type GetTestCaseInputType = z.infer<typeof GetTestCaseInput>;
export type GetTestCasesInputType = z.infer<typeof GetTestCasesInput>;
export type AddTestCaseInputType = z.infer<typeof AddTestCaseInput>;
export type UpdateTestCaseInputType = z.infer<typeof UpdateTestCaseInput>;
export type DeleteTestCaseInputType = z.infer<typeof DeleteTestCaseInput>;
export type GetTestCaseTypesInputType = z.infer<typeof GetTestCaseTypesInput>;
export type GetTestCaseFieldsInputType = z.infer<typeof GetTestCaseFieldsInput>;
export type CopyTestCasesToSectionInputType = z.infer<
	typeof CopyTestCasesToSectionInput
>;
export type MoveTestCasesToSectionInputType = z.infer<
	typeof MoveTestCasesToSectionInput
>;
export type GetTestCaseHistoryInputType = z.infer<
	typeof GetTestCaseHistoryInput
>;

// -----------------------------------------------
// レスポンススキーマ定義 - types.tsからの移行
// -----------------------------------------------

/**
 * TestRail API Response for Step
 */
export const TestRailStepSchema = z.object({
	content: z.string(),
	expected: z.string(),
});
export type TestRailStep = z.infer<typeof TestRailStepSchema>;

/**
 * TestRail API Response for Case
 */
export const TestRailCaseSchema = z.object({
	id: z.number(),
	title: z.string(),
	section_id: z.number(),
	template_id: z.number(),
	type_id: z.number(),
	priority_id: z.number(),
	milestone_id: z.number().optional(),
	refs: z.string().optional(),
	created_by: z.number(),
	created_on: z.number(),
	updated_by: z.number(),
	updated_on: z.number(),
	estimate: z.string().optional(),
	estimate_forecast: z.string().optional(),
	suite_id: z.number(),
	custom_preconds: z.string().optional(),
	custom_steps: z.string().optional(),
	custom_expected: z.string().optional(),
	custom_steps_separated: z.array(TestRailStepSchema).optional(),
	custom_mission: z.string().optional(),
	custom_goals: z.string().optional(),
});
export type TestRailCase = z.infer<typeof TestRailCaseSchema>;

/**
 * TestRail API Response for Case Type
 */
export const TestRailCaseTypeSchema = z.object({
	id: z.number(),
	name: z.string(),
	is_default: z.boolean(),
});
export type TestRailCaseType = z.infer<typeof TestRailCaseTypeSchema>;

/**
 * TestRail API Response for Case Field Config
 */
export const TestRailCaseFieldConfigSchema = z.object({
	id: z.string(),
	context: z.object({
		is_global: z.boolean(),
		project_ids: z.array(z.number()),
	}),
	options: z.object({
		default_value: z.string(),
		format: z.string(),
		is_required: z.boolean(),
		rows: z.string(),
		items: z.string(),
	}),
});
export type TestRailCaseFieldConfig = z.infer<typeof TestRailCaseFieldConfigSchema>;

/**
 * TestRail API Response for Case Field
 */
export const TestRailCaseFieldSchema = z.object({
	id: z.number(),
	type_id: z.number(),
	name: z.string(),
	system_name: z.string(),
	label: z.string(),
	description: z.string(),
	configs: z.array(TestRailCaseFieldConfigSchema),
	display_order: z.number(),
	include_all: z.boolean(),
	template_ids: z.array(z.number()),
	is_active: z.boolean(),
	status_id: z.number(),
});
export type TestRailCaseField = z.infer<typeof TestRailCaseFieldSchema>;

/**
 * TestRail API Response for Case History
 */
export const TestRailCaseHistorySchema = z.object({
	id: z.number(),
	case_id: z.number(),
	user_id: z.number(),
	timestamp: z.number(),
	changes: z.array(z.object({
		field: z.string(),
		old_value: z.string().nullable(),
		new_value: z.string().nullable(),
	})),
});
export type TestRailCaseHistory = z.infer<typeof TestRailCaseHistorySchema>;
