import { z } from "zod";

// プロジェクト内のテストプラン一覧取得のためのスキーマ
export const getPlansSchema = {
	projectId: z.number().describe("TestRail Project ID"),
};

// 特定のテストプラン取得のためのスキーマ
export const getPlanSchema = {
	planId: z.number().describe("TestRail Plan ID"),
};

// テストプラン追加のためのスキーマ
export const addPlanSchema = {
	projectId: z.number().describe("TestRail Project ID"),
	name: z.string().describe("Test plan name (required)"),
	description: z.string().optional().describe("Test plan description"),
	milestone_id: z
		.number()
		.optional()
		.describe("Milestone ID to associate with"),
	entries: z
		.array(
			z.object({
				suite_id: z.number().describe("Test suite ID"),
				name: z.string().optional().describe("Name of the test run"),
				description: z
					.string()
					.optional()
					.describe("Description of the test run"),
				include_all: z
					.boolean()
					.optional()
					.describe("Include all test cases from the suite"),
				case_ids: z
					.array(z.number())
					.optional()
					.describe("Specific test case IDs to include"),
				config_ids: z
					.array(z.number())
					.optional()
					.describe("Configuration IDs to use"),
				refs: z.string().optional().describe("Reference/requirement IDs"),
			}),
		)
		.optional()
		.describe("Test suite entries to include in the plan"),
};

// テストプランエントリー追加のためのスキーマ
export const addPlanEntrySchema = {
	planId: z.number().describe("TestRail Plan ID"),
	suite_id: z.number().describe("Test suite ID"),
	name: z.string().optional().describe("Name of the test run"),
	description: z.string().optional().describe("Description of the test run"),
	include_all: z
		.boolean()
		.optional()
		.describe("Include all test cases from the suite"),
	case_ids: z
		.array(z.number())
		.optional()
		.describe("Specific test case IDs to include"),
	config_ids: z
		.array(z.number())
		.optional()
		.describe("Configuration IDs to use"),
	refs: z.string().optional().describe("Reference/requirement IDs"),
};

// テストプラン更新のためのスキーマ
export const updatePlanSchema = {
	planId: z.number().describe("TestRail Plan ID"),
	name: z.string().optional().describe("Test plan name"),
	description: z.string().optional().describe("Test plan description"),
	milestone_id: z
		.number()
		.optional()
		.describe("Milestone ID to associate with"),
};

// テストプランエントリー更新のためのスキーマ
export const updatePlanEntrySchema = {
	planId: z.number().describe("TestRail Plan ID"),
	entryId: z.string().describe("TestRail Plan Entry ID"),
	name: z.string().optional().describe("Name of the test run"),
	description: z.string().optional().describe("Description of the test run"),
	include_all: z
		.boolean()
		.optional()
		.describe("Include all test cases from the suite"),
	case_ids: z
		.array(z.number())
		.optional()
		.describe("Specific test case IDs to include"),
	config_ids: z
		.array(z.number())
		.optional()
		.describe("Configuration IDs to use"),
	refs: z.string().optional().describe("Reference/requirement IDs"),
};

// テストプラン終了のためのスキーマ
export const closePlanSchema = {
	planId: z.number().describe("TestRail Plan ID"),
};

// テストプラン削除のためのスキーマ
export const deletePlanSchema = {
	planId: z.number().describe("TestRail Plan ID"),
};

// テストプランエントリー削除のためのスキーマ
export const deletePlanEntrySchema = {
	planId: z.number().describe("TestRail Plan ID"),
	entryId: z.string().describe("TestRail Plan Entry ID"),
};

// 各スキーマからZodオブジェクトを作成
export const GetPlansInput = z.object(getPlansSchema);
export const GetPlanInput = z.object(getPlanSchema);
export const AddPlanInput = z.object(addPlanSchema);
export const AddPlanEntryInput = z.object(addPlanEntrySchema);
export const UpdatePlanInput = z.object(updatePlanSchema);
export const UpdatePlanEntryInput = z.object(updatePlanEntrySchema);
export const ClosePlanInput = z.object(closePlanSchema);
export const DeletePlanInput = z.object(deletePlanSchema);
export const DeletePlanEntryInput = z.object(deletePlanEntrySchema);

// 入力型を抽出
export type GetPlansInputType = z.infer<typeof GetPlansInput>;
export type GetPlanInputType = z.infer<typeof GetPlanInput>;
export type AddPlanInputType = z.infer<typeof AddPlanInput>;
export type AddPlanEntryInputType = z.infer<typeof AddPlanEntryInput>;
export type UpdatePlanInputType = z.infer<typeof UpdatePlanInput>;
export type UpdatePlanEntryInputType = z.infer<typeof UpdatePlanEntryInput>;
export type ClosePlanInputType = z.infer<typeof ClosePlanInput>;
export type DeletePlanInputType = z.infer<typeof DeletePlanInput>;
export type DeletePlanEntryInputType = z.infer<typeof DeletePlanEntryInput>;
