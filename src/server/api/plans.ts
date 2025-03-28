import { z } from "zod";
import { FastMCP } from "fastmcp";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * Function to register test plan-related API tools
 * @param server FastMCP server instance
 * @param testRailClient TestRail client instance
 */
export function registerPlanTools(
	server: FastMCP,
	testRailClient: TestRailClient,
): void {
	// Get all test plans for a project
	server.addTool({
		name: "getPlans",
		description: "Get all test plans for a project from TestRail",
		parameters: z.object({
			projectId: z.number().describe("TestRail Project ID"),
		}),
		execute: async ({ projectId }) => {
			try {
				const plans = await testRailClient.getPlans(projectId);
				return createSuccessResponse("Test plans retrieved successfully", {
					plans,
				});
			} catch (error) {
				return createErrorResponse(
					`Error fetching test plans for project ${projectId}`,
					error,
				);
			}
		},
	});

	// Get a specific test plan
	server.addTool({
		name: "getPlan",
		description: "Get a specific test plan from TestRail",
		parameters: z.object({
			planId: z.number().describe("TestRail Plan ID"),
		}),
		execute: async ({ planId }) => {
			try {
				const plan = await testRailClient.getPlan(planId);
				return createSuccessResponse("Test plan retrieved successfully", {
					plan,
				});
			} catch (error) {
				return createErrorResponse(`Error fetching test plan ${planId}`, error);
			}
		},
	});

	// Create a new test plan
	server.addTool({
		name: "addPlan",
		description: "Create a new test plan in TestRail",
		parameters: z.object({
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
		}),
		execute: async ({
			projectId,
			name,
			description,
			milestone_id,
			entries,
		}) => {
			try {
				const planData: Record<string, unknown> = {
					name,
				};

				if (description) planData.description = description;
				if (milestone_id !== undefined) planData.milestone_id = milestone_id;
				if (entries) planData.entries = entries;

				const plan = await testRailClient.addPlan(projectId, planData);
				return createSuccessResponse("Test plan created successfully", {
					plan,
				});
			} catch (error) {
				return createErrorResponse(
					`Error creating test plan for project ${projectId}`,
					error,
				);
			}
		},
	});

	// Add an entry to a test plan
	server.addTool({
		name: "addPlanEntry",
		description: "Add an entry to an existing test plan in TestRail",
		parameters: z.object({
			planId: z.number().describe("TestRail Plan ID"),
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
		execute: async ({
			planId,
			suite_id,
			name,
			description,
			include_all,
			case_ids,
			config_ids,
			refs,
		}) => {
			try {
				const entryData: Record<string, unknown> = {
					suite_id,
				};

				if (name) entryData.name = name;
				if (description) entryData.description = description;
				if (include_all !== undefined) entryData.include_all = include_all;
				if (case_ids) entryData.case_ids = case_ids;
				if (config_ids) entryData.config_ids = config_ids;
				if (refs) entryData.refs = refs;

				const entry = await testRailClient.addPlanEntry(planId, entryData);
				return createSuccessResponse("Plan entry added successfully", {
					entry,
				});
			} catch (error) {
				return createErrorResponse(
					`Error adding entry to test plan ${planId}`,
					error,
				);
			}
		},
	});

	// Update an existing test plan
	server.addTool({
		name: "updatePlan",
		description: "Update an existing test plan in TestRail",
		parameters: z.object({
			planId: z.number().describe("TestRail Plan ID"),
			name: z.string().optional().describe("Test plan name"),
			description: z.string().optional().describe("Test plan description"),
			milestone_id: z
				.number()
				.optional()
				.describe("Milestone ID to associate with"),
		}),
		execute: async ({ planId, name, description, milestone_id }) => {
			try {
				const planData: Record<string, unknown> = {};

				if (name) planData.name = name;
				if (description !== undefined) planData.description = description;
				if (milestone_id !== undefined) planData.milestone_id = milestone_id;

				const plan = await testRailClient.updatePlan(planId, planData);
				return createSuccessResponse("Test plan updated successfully", {
					plan,
				});
			} catch (error) {
				return createErrorResponse(`Error updating test plan ${planId}`, error);
			}
		},
	});

	// Update an entry in a test plan
	server.addTool({
		name: "updatePlanEntry",
		description: "Update an entry in an existing test plan in TestRail",
		parameters: z.object({
			planId: z.number().describe("TestRail Plan ID"),
			entryId: z.string().describe("TestRail Plan Entry ID"),
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
		}),
		execute: async ({
			planId,
			entryId,
			name,
			description,
			include_all,
			case_ids,
		}) => {
			try {
				const entryData: Record<string, unknown> = {};

				if (name) entryData.name = name;
				if (description !== undefined) entryData.description = description;
				if (include_all !== undefined) entryData.include_all = include_all;
				if (case_ids) entryData.case_ids = case_ids;

				const entry = await testRailClient.updatePlanEntry(
					planId,
					entryId,
					entryData,
				);
				return createSuccessResponse("Plan entry updated successfully", {
					entry,
				});
			} catch (error) {
				return createErrorResponse(
					`Error updating entry in test plan ${planId}`,
					error,
				);
			}
		},
	});

	// Delete an entry from a test plan
	server.addTool({
		name: "deletePlanEntry",
		description: "Delete an entry from a test plan in TestRail",
		parameters: z.object({
			planId: z.number().describe("TestRail Plan ID"),
			entryId: z.string().describe("TestRail Plan Entry ID"),
		}),
		execute: async ({ planId, entryId }) => {
			try {
				await testRailClient.deletePlanEntry(planId, entryId);
				return createSuccessResponse(
					`Entry ${entryId} deleted from test plan ${planId} successfully`,
				);
			} catch (error) {
				return createErrorResponse(
					`Error deleting entry from test plan ${planId}`,
					error,
				);
			}
		},
	});

	// Close a test plan
	server.addTool({
		name: "closePlan",
		description: "Close a test plan in TestRail",
		parameters: z.object({
			planId: z.number().describe("TestRail Plan ID"),
		}),
		execute: async ({ planId }) => {
			try {
				await testRailClient.closePlan(planId);
				return createSuccessResponse(`Test plan ${planId} closed successfully`);
			} catch (error) {
				return createErrorResponse(`Error closing test plan ${planId}`, error);
			}
		},
	});

	// Delete a test plan
	server.addTool({
		name: "deletePlan",
		description: "Delete a test plan from TestRail",
		parameters: z.object({
			planId: z.number().describe("TestRail Plan ID"),
		}),
		execute: async ({ planId }) => {
			try {
				await testRailClient.deletePlan(planId);
				return createSuccessResponse(
					`Test plan ${planId} deleted successfully`,
				);
			} catch (error) {
				return createErrorResponse(`Error deleting test plan ${planId}`, error);
			}
		},
	});
}
