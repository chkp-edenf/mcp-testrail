import { z } from "zod";

// Schema for retrieving all milestones in a project
export const getMilestonesSchema = {
	projectId: z.number().describe("TestRail Project ID"),
};

// Schema for retrieving a specific milestone
export const getMilestoneSchema = {
	milestoneId: z.number().describe("TestRail Milestone ID"),
};

// Schema for adding a milestone
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

// Schema for updating a milestone
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

// Schema for deleting a milestone
export const deleteMilestoneSchema = {
	milestoneId: z.number().describe("TestRail Milestone ID"),
};

// Create Zod objects from each schema
export const GetMilestonesInput = z.object(getMilestonesSchema);
export const GetMilestoneInput = z.object(getMilestoneSchema);
export const AddMilestoneInput = z.object(addMilestoneSchema);
export const UpdateMilestoneInput = z.object(updateMilestoneSchema);
export const DeleteMilestoneInput = z.object(deleteMilestoneSchema);

// Extract input types
export type GetMilestonesInputType = z.infer<typeof GetMilestonesInput>;
export type GetMilestoneInputType = z.infer<typeof GetMilestoneInput>;
export type AddMilestoneInputType = z.infer<typeof AddMilestoneInput>;
export type UpdateMilestoneInputType = z.infer<typeof UpdateMilestoneInput>;
export type DeleteMilestoneInputType = z.infer<typeof DeleteMilestoneInput>;

// -----------------------------------------------
// Response schema definitions - migrated from types.ts
// -----------------------------------------------

/**
 * TestRail API Response for Milestone
 */
export const TestRailMilestoneSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().optional(),
	due_on: z.number().optional(),
	start_on: z.number().optional(),
	started_on: z.number().optional(),
	completed_on: z.number().nullable().optional(),
	project_id: z.number(),
	is_completed: z.boolean(),
	is_started: z.boolean().optional(),
	parent_id: z.number().nullable().optional(),
	refs: z.string().optional(),
	url: z.string(),
});
export type TestRailMilestone = z.infer<typeof TestRailMilestoneSchema>;
