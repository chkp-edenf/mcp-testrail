import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/api/index.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";
import { getPlansSchema } from "../../shared/schemas/plans.js";

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
		"Retrieves all test plans for a specified TestRail project / 指定されたTestRailプロジェクトの全テストプランを取得します",
		getPlansSchema,
		async ({ projectId }) => {
			try {
				const plans = await testRailClient.plans.getPlans(projectId);
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
}
