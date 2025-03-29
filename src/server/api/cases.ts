import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../../client/api/index.js";
import { createSuccessResponse, createErrorResponse } from "./utils.js";
import {
	getTestCaseSchema,
	getTestCasesSchema,
	addTestCaseSchema,
	updateTestCaseSchema,
	deleteTestCaseSchema,
	getTestCaseTypesSchema,
	getTestCaseFieldsSchema,
	copyTestCasesToSectionSchema,
	moveTestCasesToSectionSchema,
	getTestCaseHistorySchema,
} from "../../shared/schemas/cases.js";

/**
 * Function to register test case-related API tools
 * @param server McpServer instance
 * @param testRailClient TestRail client instance
 */
export function registerCaseTools(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// Get a specific test case
	server.tool(
		"getCase",
		{ caseId: getTestCaseSchema.shape.caseId },
		async (args, extra) => {
			try {
				const { caseId } = args;
				const testCase = await testRailClient.cases.getCase(caseId);
				const successResponse = createSuccessResponse(
					"Test case retrieved successfully",
					{
						case: testCase,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching test case ${args.caseId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Get all test cases for a project
	server.tool(
		"getCases",
		{ projectId: getTestCasesSchema.shape.projectId },
		async (args, extra) => {
			try {
				const { projectId } = args;
				const testCases = await testRailClient.cases.getCases(projectId, {});
				const successResponse = createSuccessResponse(
					"Test cases retrieved successfully",
					{
						cases: testCases,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching test cases for project ${args.projectId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Add a new test case
	server.tool(
		"addCase",
		{
			sectionId: addTestCaseSchema.shape.sectionId,
			title: addTestCaseSchema.shape.title,
			typeId: addTestCaseSchema.shape.typeId,
			priorityId: addTestCaseSchema.shape.priorityId,
			estimate: addTestCaseSchema.shape.estimate,
			milestoneId: addTestCaseSchema.shape.milestoneId,
			refs: addTestCaseSchema.shape.refs,
			customPrerequisites: addTestCaseSchema.shape.customPrerequisites,
			customSteps: addTestCaseSchema.shape.customSteps,
			customExpected: addTestCaseSchema.shape.customExpected,
		},
		async (args, extra) => {
			try {
				const {
					sectionId,
					title,
					typeId,
					priorityId,
					estimate,
					milestoneId,
					refs,
					customPrerequisites,
					customSteps,
					customExpected,
				} = args;
				// Build test case data
				const data: Record<string, unknown> = {};

				// Add title if specified
				if (title) {
					data.title = title;
				}

				// Add type ID if specified
				if (typeId) {
					data.type_id = typeId;
				}

				// Add priority ID if specified
				if (priorityId) {
					data.priority_id = priorityId;
				}

				// Add estimate if specified
				if (estimate) {
					data.estimate = estimate;
				}

				// Add milestone ID if specified
				if (milestoneId) {
					data.milestone_id = milestoneId;
				}

				// Add references if specified
				if (refs) {
					data.refs = refs;
				}

				// Remove empty or undefined fields
				for (const key of Object.keys(data)) {
					const value = data[key];
					if (value === undefined || value === null || value === "") {
						delete data[key];
					}
				}

				const testCase = await testRailClient.cases.addCase(sectionId, data);
				const successResponse = createSuccessResponse(
					"Test case created successfully",
					{
						case: testCase,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error creating test case in section ${args.sectionId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Update an existing test case
	server.tool(
		"updateCase",
		{
			caseId: updateTestCaseSchema.shape.caseId,
			title: updateTestCaseSchema.shape.title,
			typeId: updateTestCaseSchema.shape.typeId,
			priorityId: updateTestCaseSchema.shape.priorityId,
			estimate: updateTestCaseSchema.shape.estimate,
			milestoneId: updateTestCaseSchema.shape.milestoneId,
			refs: updateTestCaseSchema.shape.refs,
			customPrerequisites: updateTestCaseSchema.shape.customPrerequisites,
			customSteps: updateTestCaseSchema.shape.customSteps,
			customExpected: updateTestCaseSchema.shape.customExpected,
		},
		async (args, extra) => {
			try {
				const {
					caseId,
					title,
					typeId,
					priorityId,
					estimate,
					milestoneId,
					refs,
					customPrerequisites,
					customSteps,
					customExpected,
				} = args;
				// Build update data
				const data: Record<string, unknown> = {};

				// Add title if specified
				if (title) {
					data.title = title;
				}

				// Add type ID if specified
				if (typeId) {
					data.type_id = typeId;
				}

				// Add priority ID if specified
				if (priorityId) {
					data.priority_id = priorityId;
				}

				// Add estimate if specified
				if (estimate) {
					data.estimate = estimate;
				}

				// Add milestone ID if specified
				if (milestoneId) {
					data.milestone_id = milestoneId;
				}

				// Add references if specified
				if (refs) {
					data.refs = refs;
				}

				const testCase = await testRailClient.cases.updateCase(caseId, data);
				const successResponse = createSuccessResponse(
					"Test case updated successfully",
					{
						case: testCase,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error updating test case ${args.caseId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Delete a test case
	server.tool(
		"deleteCase",
		{ caseId: deleteTestCaseSchema.shape.caseId },
		async (args, extra) => {
			try {
				const { caseId } = args;
				await testRailClient.cases.deleteCase(caseId);
				const successResponse = createSuccessResponse(
					`Test case ${caseId} deleted successfully`,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error deleting test case ${args.caseId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Get all test case types
	server.tool("getCaseTypes", {}, async (args, extra) => {
		try {
			const caseTypes = await testRailClient.cases.getCaseTypes();
			const successResponse = createSuccessResponse(
				"Test case types retrieved successfully",
				{
					caseTypes,
				},
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				"Error fetching test case types",
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// Get all test case fields
	server.tool("getCaseFields", {}, async (args, extra) => {
		try {
			const caseFields = await testRailClient.cases.getCaseFields();
			const successResponse = createSuccessResponse(
				"Test case fields retrieved successfully",
				{
					caseFields,
				},
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				"Error fetching test case fields",
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// Copy test cases to section
	server.tool(
		"copyToSection",
		{
			caseIds: copyTestCasesToSectionSchema.shape.caseIds,
			sectionId: copyTestCasesToSectionSchema.shape.sectionId,
		},
		async (args, extra) => {
			try {
				const { caseIds, sectionId } = args;
				const result = await testRailClient.cases.copyToSection(
					caseIds,
					sectionId,
				);
				const successResponse = createSuccessResponse(
					"Test cases copied successfully",
					{
						result,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error copying test cases to section ${args.sectionId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Move test cases to section
	server.tool(
		"moveToSection",
		{
			caseIds: moveTestCasesToSectionSchema.shape.caseIds,
			sectionId: moveTestCasesToSectionSchema.shape.sectionId,
		},
		async (args, extra) => {
			try {
				const { caseIds, sectionId } = args;
				const result = await testRailClient.cases.moveToSection(
					caseIds,
					sectionId,
				);
				const successResponse = createSuccessResponse(
					"Test cases moved successfully",
					{
						result,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error moving test cases to section ${args.sectionId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Get test case history
	server.tool(
		"getCaseHistory",
		{ caseId: getTestCaseHistorySchema.shape.caseId },
		async (args, extra) => {
			try {
				const { caseId } = args;
				const history = await testRailClient.cases.getCaseHistory(caseId);
				const successResponse = createSuccessResponse(
					"Test case history retrieved successfully",
					{
						history,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error fetching history for test case ${args.caseId}`,
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
