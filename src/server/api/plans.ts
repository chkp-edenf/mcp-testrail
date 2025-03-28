import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/testRailApi.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";

/**
 * Function to register test plan-related API tools
 * @param server McpServer instance
 * @param testRailClient TestRail client instance
 */
export function registerPlanTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// Get all test plans for a project
	server.tool(
		"getPlans",
		{
			projectId: z.number().describe("TestRail Project ID"),
		},
		async ({ projectId }) => {
			try {
				const plans = await testRailClient.getPlans(projectId);
				const successResponse = createSuccessResponse(
					"Test plans retrieved successfully",
					{
						plans,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching test plans for project ${projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Get a specific test plan
	server.tool(
		"getPlan",
		{
			planId: z.number().describe("TestRail Plan ID"),
		},
		async ({ planId }) => {
			try {
				const plan = await testRailClient.getPlan(planId);
				const successResponse = createSuccessResponse(
					"Test plan retrieved successfully",
					{
						plan,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching test plan ${planId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Create a new test plan
	server.tool(
		"addPlan",
		{
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
		},
		async ({ projectId, name, description, milestone_id, entries }) => {
			try {
				const planData: Record<string, unknown> = {
					name,
				};

				if (description) planData.description = description;
				if (milestone_id !== undefined) planData.milestone_id = milestone_id;
				if (entries) planData.entries = entries;

				const plan = await testRailClient.addPlan(projectId, planData);
				const successResponse = createSuccessResponse(
					"Test plan created successfully",
					{
						plan,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating test plan for project ${projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Add an entry to a test plan
	server.tool(
		"addPlanEntry",
		{
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
		},
		async ({
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
				const successResponse = createSuccessResponse(
					"Plan entry added successfully",
					{
						entry,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error adding entry to test plan ${planId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Update an existing test plan
	server.tool(
		"updatePlan",
		{
			planId: z.number().describe("TestRail Plan ID"),
			name: z.string().optional().describe("Test plan name"),
			description: z.string().optional().describe("Test plan description"),
			milestone_id: z
				.number()
				.optional()
				.describe("Milestone ID to associate with"),
		},
		async ({ planId, name, description, milestone_id }) => {
			try {
				const planData: Record<string, unknown> = {};

				if (name) planData.name = name;
				if (description !== undefined) planData.description = description;
				if (milestone_id !== undefined) planData.milestone_id = milestone_id;

				const plan = await testRailClient.updatePlan(planId, planData);
				const successResponse = createSuccessResponse(
					"Test plan updated successfully",
					{
						plan,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error updating test plan ${planId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Update an entry in a test plan
	server.tool(
		"updatePlanEntry",
		{
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
		},
		async ({ planId, entryId, name, description, include_all, case_ids }) => {
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
				const successResponse = createSuccessResponse(
					"Plan entry updated successfully",
					{
						entry,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error updating entry in test plan ${planId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Delete an entry from a test plan
	server.tool(
		"deletePlanEntry",
		{
			planId: z.number().describe("TestRail Plan ID"),
			entryId: z.string().describe("TestRail Plan Entry ID"),
		},
		async ({ planId, entryId }) => {
			try {
				await testRailClient.deletePlanEntry(planId, entryId);
				const successResponse = createSuccessResponse(
					`Entry ${entryId} deleted from test plan ${planId} successfully`,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error deleting entry from test plan ${planId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Close a test plan
	server.tool(
		"closePlan",
		{
			planId: z.number().describe("TestRail Plan ID"),
		},
		async ({ planId }) => {
			try {
				await testRailClient.closePlan(planId);
				const successResponse = createSuccessResponse(
					`Test plan ${planId} closed successfully`,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error closing test plan ${planId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Delete a test plan
	server.tool(
		"deletePlan",
		{
			planId: z.number().describe("TestRail Plan ID"),
		},
		async ({ planId }) => {
			try {
				await testRailClient.deletePlan(planId);
				const successResponse = createSuccessResponse(
					`Test plan ${planId} deleted successfully`,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error deleting test plan ${planId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);
}
