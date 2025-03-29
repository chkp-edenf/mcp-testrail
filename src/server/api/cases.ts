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
	server.tool("getCase", getTestCaseSchema, async ({ caseId }) => {
		try {
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
				`Error fetching test case ${caseId}`,
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// Get all test cases for a project
	server.tool(
		"getCases",
		getTestCasesSchema,
		async ({ projectId, ...filters }) => {
			try {
				const testCases = await testRailClient.cases.getCases(
					projectId,
					filters,
				);
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
					`Error fetching test cases for project ${projectId}`,
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
		addTestCaseSchema,
		async ({ sectionId, ...caseData }) => {
			try {
				// Build test case data
				const data: Record<string, unknown> = {};

				// Add title if specified
				if (caseData.title) {
					data.title = caseData.title;
				}

				// Add type ID if specified
				if (caseData.typeId) {
					data.type_id = caseData.typeId;
				}

				// Add priority ID if specified
				if (caseData.priorityId) {
					data.priority_id = caseData.priorityId;
				}

				// Add estimate if specified
				if (caseData.estimate) {
					data.estimate = caseData.estimate;
				}

				// Add milestone ID if specified
				if (caseData.milestoneId) {
					data.milestone_id = caseData.milestoneId;
				}

				// Add references if specified
				if (caseData.refs) {
					data.refs = caseData.refs;
				}

				// Remove empty or undefined fields
				Object.keys(data).forEach((key) => {
					const value = data[key];
					if (value === undefined || value === null || value === "") {
						delete data[key];
					}
				});

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
					`Error adding test case to section ${sectionId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Update a test case
	server.tool(
		"updateCase",
		updateTestCaseSchema,
		async ({ caseId, ...caseData }) => {
			try {
				// Build update data
				const data: Record<string, unknown> = {};

				// Add title if specified
				if (caseData.title) {
					data.title = caseData.title;
				}

				// Add type ID if specified
				if (caseData.typeId) {
					data.type_id = caseData.typeId;
				}

				// Add priority ID if specified
				if (caseData.priorityId) {
					data.priority_id = caseData.priorityId;
				}

				// Add estimate if specified
				if (caseData.estimate) {
					data.estimate = caseData.estimate;
				}

				// Add milestone ID if specified
				if (caseData.milestoneId) {
					data.milestone_id = caseData.milestoneId;
				}

				// Add references if specified
				if (caseData.refs) {
					data.refs = caseData.refs;
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
					`Error updating test case ${caseId}`,
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
	server.tool("deleteCase", deleteTestCaseSchema, async ({ caseId }) => {
		try {
			await testRailClient.cases.deleteCase(caseId);
			const successResponse = createSuccessResponse(
				"Test case deleted successfully",
				{},
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				`Error deleting test case ${caseId}`,
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// Get all test case types
	server.tool("getCaseTypes", getTestCaseTypesSchema, async () => {
		try {
			const caseTypes = await testRailClient.cases.getCaseTypes();
			const successResponse = createSuccessResponse(
				"Case types retrieved successfully",
				{
					types: caseTypes,
				},
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				"Error fetching case types",
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// Get all test case fields
	server.tool("getCaseFields", getTestCaseFieldsSchema, async () => {
		try {
			const caseFields = await testRailClient.cases.getCaseFields();
			const successResponse = createSuccessResponse(
				"Case fields retrieved successfully",
				{
					fields: caseFields,
				},
			);
			return {
				content: [{ type: "text", text: JSON.stringify(successResponse) }],
			};
		} catch (error) {
			const errorResponse = createErrorResponse(
				"Error fetching case fields",
				error,
			);
			return {
				content: [{ type: "text", text: JSON.stringify(errorResponse) }],
				isError: true,
			};
		}
	});

	// Copy test cases to a section
	server.tool(
		"copyToSection",
		copyTestCasesToSectionSchema,
		async ({ caseIds, sectionId }) => {
			try {
				const result = await testRailClient.cases.copyToSection(
					caseIds,
					sectionId,
				);
				const successResponse = createSuccessResponse(
					"Test cases copied successfully",
					{
						status: result.status,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error copying test cases to section ${sectionId}`,
					error,
				);
				return {
					content: [{ type: "text", text: JSON.stringify(errorResponse) }],
					isError: true,
				};
			}
		},
	);

	// Move test cases to a section
	server.tool(
		"moveToSection",
		moveTestCasesToSectionSchema,
		async ({ caseIds, sectionId }) => {
			try {
				const result = await testRailClient.cases.moveToSection(
					caseIds,
					sectionId,
				);
				const successResponse = createSuccessResponse(
					"Test cases moved successfully",
					{
						status: result.status,
					},
				);
				return {
					content: [{ type: "text", text: JSON.stringify(successResponse) }],
				};
			} catch (error) {
				const errorResponse = createErrorResponse(
					`Error moving test cases to section ${sectionId}`,
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
		getTestCaseHistorySchema,
		async ({ caseId }) => {
			try {
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
					`Error fetching history for test case ${caseId}`,
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
