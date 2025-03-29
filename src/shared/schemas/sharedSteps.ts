import { z } from "zod";

// 共有ステップのステップアイテムのスキーマ
export const sharedStepItemSchema = z.object({
	content: z.string().describe("Step content"),
	expected: z.string().optional().describe("Expected result"),
	additionalInfo: z.string().optional().describe("Additional information"),
	refs: z.string().optional().describe("References"),
});

// 特定の共有ステップ取得のためのスキーマ
export const getSharedStepSchema = {
	sharedStepId: z.number().describe("TestRail Shared Step ID"),
};

// 共有ステップ一覧取得のためのスキーマ
export const getSharedStepsSchema = {
	projectId: z.number().describe("TestRail Project ID"),
	createdAfter: z
		.number()
		.optional()
		.describe("Only return shared steps created after this timestamp"),
	createdBefore: z
		.number()
		.optional()
		.describe("Only return shared steps created before this timestamp"),
	createdBy: z
		.number()
		.optional()
		.describe("Only return shared steps created by this user ID"),
	updatedAfter: z
		.number()
		.optional()
		.describe("Only return shared steps updated after this timestamp"),
	updatedBefore: z
		.number()
		.optional()
		.describe("Only return shared steps updated before this timestamp"),
	updatedBy: z
		.number()
		.optional()
		.describe("Only return shared steps last updated by this user ID"),
	limit: z
		.number()
		.optional()
		.describe("The number of shared steps to return per page"),
	offset: z
		.number()
		.optional()
		.describe("The offset to start returning shared steps"),
};

// 共有ステップ追加のためのスキーマ
export const addSharedStepSchema = {
	projectId: z.number().describe("TestRail Project ID"),
	title: z.string().describe("Shared step title"),
	steps: z.array(sharedStepItemSchema).describe("Shared step items"),
};

// 共有ステップ更新のためのスキーマ
export const updateSharedStepSchema = {
	sharedStepId: z.number().describe("TestRail Shared Step ID"),
	title: z.string().optional().describe("Shared step title"),
	steps: z.array(sharedStepItemSchema).optional().describe("Shared step items"),
};

// 共有ステップ削除のためのスキーマ
export const deleteSharedStepSchema = {
	sharedStepId: z.number().describe("TestRail Shared Step ID"),
	keepInCases: z
		.boolean()
		.optional()
		.describe("Whether to keep the steps in cases that use them"),
};

// 各スキーマからZodオブジェクトを作成
export const GetSharedStepInput = z.object(getSharedStepSchema);
export const GetSharedStepsInput = z.object(getSharedStepsSchema);
export const AddSharedStepInput = z.object(addSharedStepSchema);
export const UpdateSharedStepInput = z.object(updateSharedStepSchema);
export const DeleteSharedStepInput = z.object(deleteSharedStepSchema);

// 入力型を抽出
export type GetSharedStepInputType = z.infer<typeof GetSharedStepInput>;
export type GetSharedStepsInputType = z.infer<typeof GetSharedStepsInput>;
export type AddSharedStepInputType = z.infer<typeof AddSharedStepInput>;
export type UpdateSharedStepInputType = z.infer<typeof UpdateSharedStepInput>;
export type DeleteSharedStepInputType = z.infer<typeof DeleteSharedStepInput>;
export type SharedStepItemType = z.infer<typeof sharedStepItemSchema>;

// -----------------------------------------------
// レスポンススキーマ定義 - types.tsからの移行
// -----------------------------------------------

/**
 * TestRail Shared Step Item
 */
export const TestRailSharedStepItemSchema = z.object({
	content: z.string(),
	additional_info: z.string().nullable().optional(),
	expected: z.string().nullable().optional(),
	refs: z.string().nullable().optional(),
});
export type TestRailSharedStepItem = z.infer<typeof TestRailSharedStepItemSchema>;

/**
 * TestRail API Response for Shared Step
 */
export const TestRailSharedStepSchema = z.object({
	id: z.number(),
	title: z.string(),
	project_id: z.number(),
	created_by: z.number(),
	created_on: z.number(),
	updated_by: z.number(),
	updated_on: z.number(),
	custom_steps_separated: z.array(TestRailSharedStepItemSchema),
	case_ids: z.array(z.number()),
});
export type TestRailSharedStep = z.infer<typeof TestRailSharedStepSchema>;
