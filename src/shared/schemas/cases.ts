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
