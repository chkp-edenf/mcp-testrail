import { z } from "zod";

// プロジェクト内のマイルストーン一覧取得のためのスキーマ
export const getMilestonesSchema = {
	projectId: z.number().describe("TestRail Project ID"),
};

// 特定のマイルストーン取得のためのスキーマ
export const getMilestoneSchema = {
	milestoneId: z.number().describe("TestRail Milestone ID"),
};

// マイルストーン追加のためのスキーマ
export const addMilestoneSchema = {
	projectId: z.number().describe("TestRail Project ID"),
	name: z.string().describe("Milestone name (required)"),
	description: z.string().optional().describe("Milestone description"),
	due_on: z.number().optional().describe("Due date (timestamp)"),
	start_on: z.number().optional().describe("Start date (timestamp)"),
	parent_id: z
		.number()
		.optional()
		.describe("Parent milestone ID (for sub-milestones)"),
	refs: z.string().optional().describe("Reference information or issue keys"),
	is_completed: z
		.boolean()
		.optional()
		.describe("Completion status of the milestone"),
	is_started: z
		.boolean()
		.optional()
		.describe("Started status of the milestone"),
};

// マイルストーン更新のためのスキーマ
export const updateMilestoneSchema = {
	milestoneId: z.number().describe("TestRail Milestone ID"),
	name: z.string().optional().describe("Milestone name"),
	description: z.string().optional().describe("Milestone description"),
	due_on: z.number().optional().describe("Due date (timestamp)"),
	start_on: z.number().optional().describe("Start date (timestamp)"),
	parent_id: z
		.number()
		.optional()
		.describe("Parent milestone ID (for sub-milestones)"),
	refs: z.string().optional().describe("Reference information or issue keys"),
	is_completed: z
		.boolean()
		.optional()
		.describe("Completion status of the milestone"),
	is_started: z
		.boolean()
		.optional()
		.describe("Started status of the milestone"),
};

// マイルストーン削除のためのスキーマ
export const deleteMilestoneSchema = {
	milestoneId: z.number().describe("TestRail Milestone ID"),
};

// 各スキーマからZodオブジェクトを作成
export const GetMilestonesInput = z.object(getMilestonesSchema);
export const GetMilestoneInput = z.object(getMilestoneSchema);
export const AddMilestoneInput = z.object(addMilestoneSchema);
export const UpdateMilestoneInput = z.object(updateMilestoneSchema);
export const DeleteMilestoneInput = z.object(deleteMilestoneSchema);

// 入力型を抽出
export type GetMilestonesInputType = z.infer<typeof GetMilestonesInput>;
export type GetMilestoneInputType = z.infer<typeof GetMilestoneInput>;
export type AddMilestoneInputType = z.infer<typeof AddMilestoneInput>;
export type UpdateMilestoneInputType = z.infer<typeof UpdateMilestoneInput>;
export type DeleteMilestoneInputType = z.infer<typeof DeleteMilestoneInput>;
