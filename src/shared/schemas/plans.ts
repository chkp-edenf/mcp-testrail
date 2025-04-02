import { z } from "zod";
import { TestRailRunSchema } from "./runs.js";

// Schema for retrieving all test plans for a project
export const getPlansSchema = {
	projectId: z.number().describe("TestRail Project ID"),
};

// Create Zod objects from each schema
export const GetPlansInput = z.object(getPlansSchema);

// Extract input types
export type GetPlansInputType = z.infer<typeof GetPlansInput>;

/**
 * TestRail API Response for Plan Entry
 */
export const TestRailPlanEntrySchema = z.object({
	id: z.string(),
	suite_id: z.number(),
	name: z.string(),
	description: z.string().nullable().optional(),
	include_all: z.boolean(),
	runs: z.array(TestRailRunSchema),
	refs: z.string().optional(),
});
export type TestRailPlanEntry = z.infer<typeof TestRailPlanEntrySchema>;

/**
 * TestRail API Response for Plan
 */
export const TestRailPlanSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().optional(),
	milestone_id: z.number().nullable().optional(),
	assignedto_id: z.number().nullable().optional(),
	project_id: z.number(),
	created_on: z.number(),
	created_by: z.number(),
	completed_on: z.number().nullable().optional(),
	is_completed: z.boolean(),
	passed_count: z.number(),
	blocked_count: z.number(),
	untested_count: z.number(),
	retest_count: z.number(),
	failed_count: z.number(),
	entries: z.array(TestRailPlanEntrySchema),
	url: z.string(),
});
export type TestRailPlan = z.infer<typeof TestRailPlanSchema>;
