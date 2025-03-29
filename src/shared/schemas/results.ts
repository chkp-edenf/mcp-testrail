import { z } from "zod";

// テスト結果取得のためのスキーマ
export const getResultsSchema = {
	testId: z.number().describe("TestRail Test ID"),
	limit: z
		.number()
		.optional()
		.describe("The number of results to return per page"),
	offset: z
		.number()
		.optional()
		.describe("The offset to start returning results"),
	statusId: z
		.string()
		.optional()
		.describe("Filter by status IDs (comma-separated)"),
	defectsFilter: z.string().optional().describe("Filter by defect ID"),
};

// ケース別テスト結果取得のためのスキーマ
export const getResultsForCaseSchema = {
	runId: z.number().describe("TestRail Run ID"),
	caseId: z.number().describe("TestRail Case ID"),
	limit: z
		.number()
		.optional()
		.describe("The number of results to return per page"),
	offset: z
		.number()
		.optional()
		.describe("The offset to start returning results"),
	statusId: z
		.string()
		.optional()
		.describe("Filter by status IDs (comma-separated)"),
	defectsFilter: z.string().optional().describe("Filter by defect ID"),
};

// テスト実行別結果取得のためのスキーマ
export const getResultsForRunSchema = {
	runId: z.number().describe("TestRail Run ID"),
	limit: z
		.number()
		.optional()
		.describe("The number of results to return per page"),
	offset: z
		.number()
		.optional()
		.describe("The offset to start returning results"),
	statusId: z
		.string()
		.optional()
		.describe("Filter by status IDs (comma-separated)"),
	defectsFilter: z.string().optional().describe("Filter by defect ID"),
};

// 単一テスト結果追加のためのスキーマ
export const addResultSchema = {
	testId: z.number().describe("TestRail Test ID"),
	statusId: z
		.number()
		.optional()
		.describe("Status ID (1:Pass, 2:Blocked, 3:Untested, 4:Retest, 5:Fail)"),
	comment: z.string().optional().describe("Comment for the test result"),
	defects: z.string().optional().describe("Defects linked to the test result"),
	assignedtoId: z.number().optional().describe("User to assign the test to"),
	version: z.string().optional().describe("Version or build tested"),
	elapsed: z
		.string()
		.optional()
		.describe("Time spent testing (e.g., '30s', '2m 30s')"),
};

// テスト結果追加のためのスキーマ
export const addResultForCaseSchema = {
	runId: z.number().describe("TestRail Run ID"),
	caseId: z.number().describe("TestRail Case ID"),
	statusId: z
		.number()
		.optional()
		.describe("Status ID (1:Pass, 2:Blocked, 3:Untested, 4:Retest, 5:Fail)"),
	comment: z.string().optional().describe("Comment for the test result"),
	defects: z.string().optional().describe("Defects linked to the test result"),
	assignedtoId: z.number().optional().describe("User to assign the test to"),
	version: z.string().optional().describe("Version or build tested"),
	elapsed: z
		.string()
		.optional()
		.describe("Time spent testing (e.g., '30s', '2m 30s')"),
};

// 複数テスト結果追加のためのスキーマ
export const addResultsSchema = {
	runId: z.number().describe("TestRail Run ID"),
	results: z
		.array(
			z.object({
				testId: z.number().describe("TestRail Test ID"),
				statusId: z
					.number()
					.optional()
					.describe(
						"Status ID (1:Pass, 2:Blocked, 3:Untested, 4:Retest, 5:Fail)",
					),
				comment: z.string().optional().describe("Comment for the test result"),
				defects: z
					.string()
					.optional()
					.describe("Defects linked to the test result"),
				assignedtoId: z
					.number()
					.optional()
					.describe("User to assign the test to"),
				version: z.string().optional().describe("Version or build tested"),
				elapsed: z
					.string()
					.optional()
					.describe("Time spent testing (e.g., '30s', '2m 30s')"),
			}),
		)
		.describe("Array of test results to add"),
};

// 複数テストケース結果追加のためのスキーマ
export const addResultsForCasesSchema = {
	runId: z.number().describe("TestRail Run ID"),
	results: z
		.array(
			z.object({
				caseId: z.number().describe("TestRail Case ID"),
				statusId: z
					.number()
					.optional()
					.describe(
						"Status ID (1:Pass, 2:Blocked, 3:Untested, 4:Retest, 5:Fail)",
					),
				comment: z.string().optional().describe("Comment for the test result"),
				defects: z
					.string()
					.optional()
					.describe("Defects linked to the test result"),
				assignedtoId: z
					.number()
					.optional()
					.describe("User to assign the test to"),
				version: z.string().optional().describe("Version or build tested"),
				elapsed: z
					.string()
					.optional()
					.describe("Time spent testing (e.g., '30s', '2m 30s')"),
			}),
		)
		.describe("Array of test case results to add"),
};

// 各スキーマからZodオブジェクトを作成
export const GetResultsInput = z.object(getResultsSchema);
export const GetResultsForCaseInput = z.object(getResultsForCaseSchema);
export const GetResultsForRunInput = z.object(getResultsForRunSchema);
export const AddResultInput = z.object(addResultSchema);
export const AddResultForCaseInput = z.object(addResultForCaseSchema);
export const AddResultsInput = z.object(addResultsSchema);
export const AddResultsForCasesInput = z.object(addResultsForCasesSchema);

// 入力型を抽出
export type GetResultsInputType = z.infer<typeof GetResultsInput>;
export type GetResultsForCaseInputType = z.infer<typeof GetResultsForCaseInput>;
export type GetResultsForRunInputType = z.infer<typeof GetResultsForRunInput>;
export type AddResultInputType = z.infer<typeof AddResultInput>;
export type AddResultForCaseInputType = z.infer<typeof AddResultForCaseInput>;
export type AddResultsInputType = z.infer<typeof AddResultsInput>;
export type AddResultsForCasesInputType = z.infer<
	typeof AddResultsForCasesInput
>;

// -----------------------------------------------
// レスポンススキーマ定義 - types.tsからの移行
// -----------------------------------------------

/**
 * TestRail API Response for Step Result
 */
export const TestRailStepResultSchema = z.object({
	status_id: z.number(),
	content: z.string(),
	expected: z.string(),
	actual: z.string(),
});
export type TestRailStepResult = z.infer<typeof TestRailStepResultSchema>;

/**
 * TestRail API Response for Result
 */
export const TestRailResultSchema = z.object({
	id: z.number(),
	test_id: z.number(),
	status_id: z.number(),
	created_by: z.number(),
	created_on: z.number(),
	assignedto_id: z.number(),
	comment: z.string(),
	version: z.string(),
	elapsed: z.string(),
	defects: z.string(),
	custom_step_results: z.array(TestRailStepResultSchema).optional(),
	custom_fields: z.record(z.unknown()).optional(),
});
export type TestRailResult = z.infer<typeof TestRailResultSchema>;
