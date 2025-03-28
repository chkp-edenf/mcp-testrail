import { z } from "zod";

// プロジェクト内のスイート一覧取得のためのスキーマ
export const getSuitesSchema = {
	projectId: z.number().describe("TestRail Project ID"),
};

// 特定のスイート取得のためのスキーマ
export const getSuiteSchema = {
	suiteId: z.number().describe("TestRail Suite ID"),
};

// スイート追加のためのスキーマ
export const addSuiteSchema = {
	projectId: z.number().describe("TestRail Project ID"),
	name: z.string().describe("Test suite name (required)"),
	description: z.string().optional().describe("Test suite description"),
};

// スイート更新のためのスキーマ
export const updateSuiteSchema = {
	suiteId: z.number().describe("TestRail Suite ID"),
	name: z.string().optional().describe("Test suite name"),
	description: z.string().optional().describe("Test suite description"),
};

// スイート削除のためのスキーマ
export const deleteSuiteSchema = {
	suiteId: z.number().describe("TestRail Suite ID"),
};

// 各スキーマからZodオブジェクトを作成
export const GetSuitesInput = z.object(getSuitesSchema);
export const GetSuiteInput = z.object(getSuiteSchema);
export const AddSuiteInput = z.object(addSuiteSchema);
export const UpdateSuiteInput = z.object(updateSuiteSchema);
export const DeleteSuiteInput = z.object(deleteSuiteSchema);

// 入力型を抽出
export type GetSuitesInputType = z.infer<typeof GetSuitesInput>;
export type GetSuiteInputType = z.infer<typeof GetSuiteInput>;
export type AddSuiteInputType = z.infer<typeof AddSuiteInput>;
export type UpdateSuiteInputType = z.infer<typeof UpdateSuiteInput>;
export type DeleteSuiteInputType = z.infer<typeof DeleteSuiteInput>;
