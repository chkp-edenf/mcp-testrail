import { FastMCP } from "fastmcp";
import { z } from "zod";
import "dotenv/config";
import { TestRailClient, TestRailClientConfig } from "./client/testRailApi.js";

// Validate TestRail settings
if (
	!process.env.TESTRAIL_URL ||
	!process.env.TESTRAIL_USERNAME ||
	!process.env.TESTRAIL_API_KEY
) {
	throw new Error(
		"TESTRAIL_URL, TESTRAIL_USERNAME, and TESTRAIL_API_KEY must be set",
	);
}

// Fix URL format: https://example.testrail.com/index.php?/
const url = process.env.TESTRAIL_URL;
const baseURL = url.endsWith("/index.php?/")
	? url
	: url.endsWith("/")
		? `${url}index.php?`
		: `${url}/index.php?`;

const testRailConfig: TestRailClientConfig = {
	baseURL: baseURL,
	auth: {
		username: process.env.TESTRAIL_USERNAME,
		password: process.env.TESTRAIL_API_KEY,
	},
};

// Initialize TestRail client
const testRailClient = new TestRailClient(testRailConfig);

// Create FastMCP server
const server = new FastMCP({
	name: "TestRail MCP Server",
	version: "1.0.0",
});

// Tool to get all projects
server.addTool({
	name: "getProjects",
	description: "Get a list of projects from TestRail",
	parameters: z.object({}),
	execute: async () => {
		try {
			const projects = await testRailClient.getProjects();

			// Return TestRail API response directly with minimal wrapping
			return {
				type: "text",
				text: JSON.stringify(
					{
						message: "Projects retrieved successfully",
						data: projects,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Error fetching projects: ${errorMessage}`);
		}
	},
});

// Tool to get test cases for a project
server.addTool({
	name: "getTestCases",
	description: "Get test cases for a specified project",
	parameters: z.object({
		projectId: z.number().describe("TestRail Project ID"),
	}),
	execute: async ({ projectId }) => {
		try {
			const testCases = await testRailClient.getCases(projectId);
			return {
				type: "text",
				text: JSON.stringify(
					{
						offset: 0,
						limit: 250,
						size: testCases.length,
						_links: {
							next: null,
							prev: null,
						},
						testCases: testCases,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(
				`Error fetching test cases for project ${projectId}: ${errorMessage}`,
			);
		}
	},
});

// Tool to get a single test case
server.addTool({
	name: "getTestCase",
	description: "Get details of a specific test case from TestRail",
	parameters: z.object({
		caseId: z.number().describe("TestRail Test Case ID"),
	}),
	execute: async ({ caseId }) => {
		try {
			const testCase = await testRailClient.getCase(caseId);
			return {
				type: "text",
				text: JSON.stringify(
					{
						message: "Test case retrieved successfully",
						testCase: testCase,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Error fetching test case ${caseId}: ${errorMessage}`);
		}
	},
});

// Tool to add a test case
server.addTool({
	name: "addTestCase",
	description: "Add a new test case to a section in TestRail",
	parameters: z.object({
		sectionId: z.number().describe("TestRail Section ID"),
		title: z.string().describe("Test case title"),
		typeId: z.number().optional().describe("Test case type ID"),
		priorityId: z.number().optional().describe("Test case priority ID"),
		estimate: z
			.string()
			.optional()
			.describe("Time estimate (e.g., '30s', '1m 45s', '3h')"),
		milestoneId: z.number().optional().describe("Milestone ID"),
		refs: z.string().optional().describe("Reference/requirement IDs"),
		customSteps: z.string().optional().describe("Test case steps"),
		customExpected: z.string().optional().describe("Expected results"),
		customPrerequisites: z.string().optional().describe("Prerequisites"),
	}),
	execute: async ({
		sectionId,
		title,
		typeId,
		priorityId,
		estimate,
		milestoneId,
		refs,
		customSteps,
		customExpected,
		customPrerequisites,
	}) => {
		try {
			const data: Record<string, unknown> = { title };

			if (typeId !== undefined) data.type_id = typeId;
			if (priorityId !== undefined) data.priority_id = priorityId;
			if (estimate) data.estimate = estimate;
			if (milestoneId !== undefined) data.milestone_id = milestoneId;
			if (refs) data.refs = refs;
			if (customSteps) data.custom_steps = customSteps;
			if (customExpected) data.custom_expected = customExpected;
			if (customPrerequisites) data.custom_preconds = customPrerequisites;

			const testCase = await testRailClient.addCase(sectionId, data);

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: "Test case added successfully",
						testCase: testCase,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(
				`Error adding test case to section ${sectionId}: ${errorMessage}`,
			);
		}
	},
});

// Tool to update a test case
server.addTool({
	name: "updateTestCase",
	description: "Update an existing test case in TestRail",
	parameters: z.object({
		caseId: z.number().describe("TestRail Test Case ID"),
		title: z.string().optional().describe("Test case title"),
		typeId: z.number().optional().describe("Test case type ID"),
		priorityId: z.number().optional().describe("Test case priority ID"),
		estimate: z
			.string()
			.optional()
			.describe("Time estimate (e.g., '30s', '1m 45s', '3h')"),
		milestoneId: z.number().optional().describe("Milestone ID"),
		refs: z.string().optional().describe("Reference/requirement IDs"),
		customSteps: z.string().optional().describe("Test case steps"),
		customExpected: z.string().optional().describe("Expected results"),
		customPrerequisites: z.string().optional().describe("Prerequisites"),
	}),
	execute: async ({
		caseId,
		title,
		typeId,
		priorityId,
		estimate,
		milestoneId,
		refs,
		customSteps,
		customExpected,
		customPrerequisites,
	}) => {
		try {
			const data: Record<string, unknown> = {};

			if (title) data.title = title;
			if (typeId !== undefined) data.type_id = typeId;
			if (priorityId !== undefined) data.priority_id = priorityId;
			if (estimate) data.estimate = estimate;
			if (milestoneId !== undefined) data.milestone_id = milestoneId;
			if (refs) data.refs = refs;
			if (customSteps) data.custom_steps = customSteps;
			if (customExpected) data.custom_expected = customExpected;
			if (customPrerequisites) data.custom_preconds = customPrerequisites;

			const testCase = await testRailClient.updateCase(caseId, data);

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: "Test case updated successfully",
						testCase: testCase,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Error updating test case ${caseId}: ${errorMessage}`);
		}
	},
});

// Tool to delete a test case
server.addTool({
	name: "deleteTestCase",
	description: "Delete an existing test case in TestRail",
	parameters: z.object({
		caseId: z.number().describe("TestRail Test Case ID"),
	}),
	execute: async ({ caseId }) => {
		try {
			await testRailClient.deleteCase(caseId);

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: "Test case deleted successfully",
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Error deleting test case ${caseId}: ${errorMessage}`);
		}
	},
});

// Tool to get test case types
server.addTool({
	name: "getTestCaseTypes",
	description: "Get a list of available test case types from TestRail",
	parameters: z.object({}),
	execute: async () => {
		try {
			const caseTypes = await testRailClient.getCaseTypes();

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: "Test case types retrieved successfully",
						caseTypes: caseTypes,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Error fetching test case types: ${errorMessage}`);
		}
	},
});

// Tool to get test case fields
server.addTool({
	name: "getTestCaseFields",
	description: "Get a list of available test case fields from TestRail",
	parameters: z.object({}),
	execute: async () => {
		try {
			const caseFields = await testRailClient.getCaseFields();

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: "Test case fields retrieved successfully",
						caseFields: caseFields,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Error fetching test case fields: ${errorMessage}`);
		}
	},
});

// Tool to get test case history
server.addTool({
	name: "getTestCaseHistory",
	description: "Get the history of changes for a specific test case",
	parameters: z.object({
		caseId: z.number().describe("TestRail Test Case ID"),
	}),
	execute: async ({ caseId }) => {
		try {
			const caseHistory = await testRailClient.getCaseHistory(caseId);

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: `Test case ${caseId} history retrieved successfully`,
						caseHistory: caseHistory,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(
				`Error fetching test case ${caseId} history: ${errorMessage}`,
			);
		}
	},
});

// Tool to copy test cases to a different section
server.addTool({
	name: "copyTestCasesToSection",
	description: "Copy test cases to a different section in TestRail",
	parameters: z.object({
		sectionId: z.number().describe("Target TestRail Section ID"),
		caseIds: z.array(z.number()).describe("Array of Test Case IDs to copy"),
	}),
	execute: async ({ sectionId, caseIds }) => {
		try {
			const copiedCases = await testRailClient.copyCasesToSection(
				sectionId,
				caseIds,
			);

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: `${copiedCases.length} test cases copied to section ${sectionId} successfully`,
						copiedCases: copiedCases,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(
				`Error copying test cases to section ${sectionId}: ${errorMessage}`,
			);
		}
	},
});

// Tool to move test cases to a different section
server.addTool({
	name: "moveTestCasesToSection",
	description: "Move test cases to a different section in TestRail",
	parameters: z.object({
		sectionId: z.number().describe("Target TestRail Section ID"),
		caseIds: z.array(z.number()).describe("Array of Test Case IDs to move"),
	}),
	execute: async ({ sectionId, caseIds }) => {
		try {
			await testRailClient.moveCasesToSection(sectionId, caseIds);

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: `${caseIds.length} test cases moved to section ${sectionId} successfully`,
						movedCaseIds: caseIds,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(
				`Error moving test cases to section ${sectionId}: ${errorMessage}`,
			);
		}
	},
});

// Tool to update multiple test cases
server.addTool({
	name: "updateMultipleTestCases",
	description: "Update multiple test cases with the same values in TestRail",
	parameters: z.object({
		projectId: z.number().describe("TestRail Project ID"),
		suiteId: z.number().optional().describe("TestRail Suite ID (optional)"),
		caseIds: z
			.array(z.number())
			.optional()
			.describe("Array of Test Case IDs to update (optional)"),
		typeId: z.number().optional().describe("Test case type ID"),
		priorityId: z.number().optional().describe("Test case priority ID"),
		milestoneId: z.number().optional().describe("Milestone ID"),
		refs: z.string().optional().describe("Reference/requirement IDs"),
	}),
	execute: async ({
		projectId,
		suiteId,
		caseIds,
		typeId,
		priorityId,
		milestoneId,
		refs,
	}) => {
		try {
			const data: Record<string, unknown> = {};

			if (typeId !== undefined) data.type_id = typeId;
			if (priorityId !== undefined) data.priority_id = priorityId;
			if (milestoneId !== undefined) data.milestone_id = milestoneId;
			if (refs) data.refs = refs;

			await testRailClient.updateCases(
				projectId,
				suiteId || null,
				data,
				caseIds,
			);

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: "Test cases updated successfully",
						updatedFields: Object.keys(data),
						projectId,
						suiteId,
						caseIds,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Error updating multiple test cases: ${errorMessage}`);
		}
	},
});

// Tool to delete multiple test cases
server.addTool({
	name: "deleteMultipleTestCases",
	description: "Delete multiple test cases in TestRail",
	parameters: z.object({
		projectId: z.number().describe("TestRail Project ID"),
		suiteId: z.number().optional().describe("TestRail Suite ID (optional)"),
		caseIds: z.array(z.number()).describe("Array of Test Case IDs to delete"),
	}),
	execute: async ({ projectId, suiteId, caseIds }) => {
		try {
			await testRailClient.deleteCases(projectId, suiteId || null, caseIds);

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: `${caseIds.length} test cases deleted successfully`,
						deletedCaseIds: caseIds,
						projectId,
						suiteId,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Error deleting multiple test cases: ${errorMessage}`);
		}
	},
});

// Tool to add a test result
server.addTool({
	name: "addTestResult",
	description: "Add a test result",
	parameters: z.object({
		testId: z.number().describe("TestRail Test ID"),
		statusId: z
			.number()
			.describe("Status ID (1:Pass, 2:Blocked, 3:Untested, 4:Retest, 5:Fail)"),
		comment: z.string().optional().describe("Comment for the test result"),
	}),
	execute: async ({ testId, statusId, comment = "" }) => {
		try {
			const result = await testRailClient.addResult(testId, {
				status_id: statusId,
				comment: comment,
			});

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: "Test result added successfully",
						result: result,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Error adding test result: ${errorMessage}`);
		}
	},
});

// Tool to create a new project
server.addTool({
	name: "addProject",
	description: "Create a new project in TestRail",
	parameters: z.object({
		name: z.string().describe("Project name (required)"),
		announcement: z
			.string()
			.optional()
			.describe("Project description/announcement"),
		show_announcement: z
			.boolean()
			.optional()
			.describe("Show announcement on project overview page"),
		suite_mode: z
			.number()
			.optional()
			.describe(
				"Suite mode (1: single suite, 2: single + baselines, 3: multiple suites)",
			),
	}),
	execute: async ({ name, announcement, show_announcement, suite_mode }) => {
		try {
			const project = await testRailClient.addProject({
				name,
				announcement,
				show_announcement,
				suite_mode,
			});

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: "Project created successfully",
						project: project,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Error creating project: ${errorMessage}`);
		}
	},
});

// Tool to update an existing project
server.addTool({
	name: "updateProject",
	description: "Update an existing project in TestRail",
	parameters: z.object({
		projectId: z.number().describe("TestRail Project ID"),
		name: z.string().optional().describe("Project name"),
		announcement: z
			.string()
			.optional()
			.describe("Project description/announcement"),
		show_announcement: z
			.boolean()
			.optional()
			.describe("Show announcement on project overview page"),
		is_completed: z.boolean().optional().describe("Mark project as completed"),
	}),
	execute: async ({
		projectId,
		name,
		announcement,
		show_announcement,
		is_completed,
	}) => {
		try {
			const project = await testRailClient.updateProject(projectId, {
				name,
				announcement,
				show_announcement,
				is_completed,
			});

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: "Project updated successfully",
						project: project,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Error updating project ${projectId}: ${errorMessage}`);
		}
	},
});

// Tool to get a specific project
server.addTool({
	name: "getProject",
	description: "Get details of a specific project from TestRail",
	parameters: z.object({
		projectId: z.number().describe("TestRail Project ID"),
	}),
	execute: async ({ projectId }) => {
		try {
			const project = await testRailClient.getProject(projectId);

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: "Project retrieved successfully",
						project: project,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Error fetching project ${projectId}: ${errorMessage}`);
		}
	},
});

// Tool to delete a project
server.addTool({
	name: "deleteProject",
	description: "Delete an existing project in TestRail (cannot be undone)",
	parameters: z.object({
		projectId: z.number().describe("TestRail Project ID"),
	}),
	execute: async ({ projectId }) => {
		try {
			await testRailClient.deleteProject(projectId);

			return {
				type: "text",
				text: JSON.stringify(
					{
						message: `Project ${projectId} deleted successfully`,
					},
					null,
					2,
				),
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Error deleting project ${projectId}: ${errorMessage}`);
		}
	},
});

// Resource template for test case details
server.addResourceTemplate({
	uriTemplate: "testcase://{caseId}",
	name: "Test Case Details",
	mimeType: "text/markdown",
	arguments: [
		{
			name: "caseId",
			description: "TestRail Case ID",
			required: true,
		},
	],
	async load({ caseId }) {
		try {
			const numericCaseId = Number.parseInt(String(caseId), 10);
			const testCase = await testRailClient.getCase(numericCaseId);

			const content =
				`# Test Case: ${testCase.title} (ID: ${testCase.id})\n\n` +
				`**Type**: ${testCase.type_id}\n` +
				`**Priority**: ${testCase.priority_id}\n` +
				`**Section**: ${testCase.section_id}\n\n` +
				`## Preconditions\n${testCase.custom_preconds || "None"}\n\n` +
				`## Steps\n${testCase.custom_steps || "None"}\n\n` +
				`## Expected Result\n${testCase.custom_expected || "None"}`;

			return {
				text: content,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return {
				text: `Error fetching test case ${caseId}: ${errorMessage}`,
			};
		}
	},
});

// Add project management tools
// ... existing code ...

// Add milestone management tools
server.addTool({
	name: "getMilestones",
	description: "Get all milestones for a project from TestRail",
	parameters: z.object({
		projectId: z.number().describe("TestRail Project ID"),
	}),
	execute: async ({ projectId }: { projectId: number }) => {
		try {
			console.log(`Fetching milestones for project ${projectId}...`);
			const milestones = await testRailClient.getMilestones(projectId);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Milestones for project ${projectId} retrieved successfully`,
						milestones,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error fetching milestones:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to fetch milestones: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

server.addTool({
	name: "getMilestone",
	description: "Get a specific milestone from TestRail",
	parameters: z.object({
		milestoneId: z.number().describe("TestRail Milestone ID"),
	}),
	execute: async ({ milestoneId }: { milestoneId: number }) => {
		try {
			console.log(`Fetching milestone ${milestoneId}...`);
			const milestone = await testRailClient.getMilestone(milestoneId);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Milestone ${milestoneId} retrieved successfully`,
						milestone,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error fetching milestone:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to fetch milestone: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

server.addTool({
	name: "addMilestone",
	description: "Create a new milestone in TestRail",
	parameters: z.object({
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
	}),
	execute: async (params: {
		projectId: number;
		name: string;
		description?: string;
		due_on?: number;
		start_on?: number;
		parent_id?: number;
		refs?: string;
		is_completed?: boolean;
		is_started?: boolean;
	}) => {
		try {
			const { projectId, ...milestoneData } = params;
			console.log(
				`Creating milestone '${milestoneData.name}' for project ${projectId}...`,
			);
			const milestone = await testRailClient.addMilestone(
				projectId,
				milestoneData,
			);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Milestone '${milestoneData.name}' created successfully`,
						milestone,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error creating milestone:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to create milestone: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

server.addTool({
	name: "updateMilestone",
	description: "Update an existing milestone in TestRail",
	parameters: z.object({
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
	}),
	execute: async (params: {
		milestoneId: number;
		name?: string;
		description?: string;
		due_on?: number;
		start_on?: number;
		parent_id?: number;
		refs?: string;
		is_completed?: boolean;
		is_started?: boolean;
	}) => {
		try {
			const { milestoneId, ...milestoneData } = params;
			console.log(`Updating milestone ${milestoneId}...`);
			const milestone = await testRailClient.updateMilestone(
				milestoneId,
				milestoneData,
			);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Milestone ${milestoneId} updated successfully`,
						milestone,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error updating milestone:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to update milestone: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

server.addTool({
	name: "deleteMilestone",
	description: "Delete a milestone from TestRail",
	parameters: z.object({
		milestoneId: z.number().describe("TestRail Milestone ID"),
	}),
	execute: async ({ milestoneId }: { milestoneId: number }) => {
		try {
			console.log(`Deleting milestone ${milestoneId}...`);
			await testRailClient.deleteMilestone(milestoneId);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Milestone ${milestoneId} deleted successfully`,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error deleting milestone:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to delete milestone: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

// Add test suite management tools
server.addTool({
	name: "getSuites",
	description: "Get all test suites for a project from TestRail",
	parameters: z.object({
		projectId: z.number().describe("TestRail Project ID"),
	}),
	execute: async ({ projectId }: { projectId: number }) => {
		try {
			console.log(`Fetching test suites for project ${projectId}...`);
			const suites = await testRailClient.getSuites(projectId);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Test suites for project ${projectId} retrieved successfully`,
						suites,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error fetching test suites:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to fetch test suites: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

server.addTool({
	name: "getSuite",
	description: "Get a specific test suite from TestRail",
	parameters: z.object({
		suiteId: z.number().describe("TestRail Suite ID"),
	}),
	execute: async ({ suiteId }: { suiteId: number }) => {
		try {
			console.log(`Fetching test suite ${suiteId}...`);
			const suite = await testRailClient.getSuite(suiteId);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Test suite ${suiteId} retrieved successfully`,
						suite,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error fetching test suite:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to fetch test suite: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

server.addTool({
	name: "addSuite",
	description: "Create a new test suite in TestRail",
	parameters: z.object({
		projectId: z.number().describe("TestRail Project ID"),
		name: z.string().describe("Test suite name (required)"),
		description: z.string().optional().describe("Test suite description"),
	}),
	execute: async (params: {
		projectId: number;
		name: string;
		description?: string;
	}) => {
		try {
			const { projectId, ...suiteData } = params;
			console.log(
				`Creating test suite '${suiteData.name}' for project ${projectId}...`,
			);
			const suite = await testRailClient.addSuite(projectId, suiteData);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Test suite '${suiteData.name}' created successfully`,
						suite,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error creating test suite:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to create test suite: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

server.addTool({
	name: "updateSuite",
	description: "Update an existing test suite in TestRail",
	parameters: z.object({
		suiteId: z.number().describe("TestRail Suite ID"),
		name: z.string().optional().describe("Test suite name"),
		description: z.string().optional().describe("Test suite description"),
	}),
	execute: async (params: {
		suiteId: number;
		name?: string;
		description?: string;
	}) => {
		try {
			const { suiteId, ...suiteData } = params;
			console.log(`Updating test suite ${suiteId}...`);
			const suite = await testRailClient.updateSuite(suiteId, suiteData);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Test suite ${suiteId} updated successfully`,
						suite,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error updating test suite:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to update test suite: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

server.addTool({
	name: "deleteSuite",
	description: "Delete a test suite from TestRail",
	parameters: z.object({
		suiteId: z.number().describe("TestRail Suite ID"),
	}),
	execute: async ({ suiteId }: { suiteId: number }) => {
		try {
			console.log(`Deleting test suite ${suiteId}...`);
			await testRailClient.deleteSuite(suiteId);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Test suite ${suiteId} deleted successfully`,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error deleting test suite:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to delete test suite: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

// Add test plan management tools
server.addTool({
	name: "getPlans",
	description: "Get all test plans for a project from TestRail",
	parameters: z.object({
		projectId: z.number().describe("TestRail Project ID"),
	}),
	execute: async ({ projectId }: { projectId: number }) => {
		try {
			console.log(`Fetching test plans for project ${projectId}...`);
			const plans = await testRailClient.getPlans(projectId);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Test plans for project ${projectId} retrieved successfully`,
						plans,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error fetching test plans:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to fetch test plans: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

server.addTool({
	name: "getPlan",
	description: "Get a specific test plan from TestRail",
	parameters: z.object({
		planId: z.number().describe("TestRail Plan ID"),
	}),
	execute: async ({ planId }: { planId: number }) => {
		try {
			console.log(`Fetching test plan ${planId}...`);
			const plan = await testRailClient.getPlan(planId);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Test plan ${planId} retrieved successfully`,
						plan,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error fetching test plan:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to fetch test plan: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

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
	execute: async (params: {
		projectId: number;
		name: string;
		description?: string;
		milestone_id?: number;
		entries?: Array<{
			suite_id: number;
			name?: string;
			description?: string;
			include_all?: boolean;
			case_ids?: number[];
			config_ids?: number[];
			refs?: string;
		}>;
	}) => {
		try {
			const { projectId, ...planData } = params;
			console.log(
				`Creating test plan '${planData.name}' for project ${projectId}...`,
			);
			const plan = await testRailClient.addPlan(projectId, planData);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Test plan '${planData.name}' created successfully`,
						plan,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error creating test plan:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to create test plan: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

server.addTool({
	name: "addPlanEntry",
	description: "Add an entry to an existing test plan in TestRail",
	parameters: z.object({
		planId: z.number().describe("TestRail Plan ID"),
		suite_id: z.number().describe("Test suite ID"),
		name: z.string().optional().describe("Name of the test run"),
		description: z.string().optional().describe("Description of the test run"),
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
	execute: async (params: {
		planId: number;
		suite_id: number;
		name?: string;
		description?: string;
		include_all?: boolean;
		case_ids?: number[];
		config_ids?: number[];
		refs?: string;
	}) => {
		try {
			const { planId, ...entryData } = params;
			console.log(`Adding entry to test plan ${planId}...`);
			const entry = await testRailClient.addPlanEntry(planId, entryData);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Entry added to test plan ${planId} successfully`,
						entry,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error adding plan entry:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to add plan entry: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

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
	execute: async (params: {
		planId: number;
		name?: string;
		description?: string;
		milestone_id?: number;
	}) => {
		try {
			const { planId, ...planData } = params;
			console.log(`Updating test plan ${planId}...`);
			const plan = await testRailClient.updatePlan(planId, planData);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Test plan ${planId} updated successfully`,
						plan,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error updating test plan:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to update test plan: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

server.addTool({
	name: "updatePlanEntry",
	description: "Update an entry in an existing test plan in TestRail",
	parameters: z.object({
		planId: z.number().describe("TestRail Plan ID"),
		entryId: z.string().describe("TestRail Plan Entry ID"),
		name: z.string().optional().describe("Name of the test run"),
		description: z.string().optional().describe("Description of the test run"),
		include_all: z
			.boolean()
			.optional()
			.describe("Include all test cases from the suite"),
		case_ids: z
			.array(z.number())
			.optional()
			.describe("Specific test case IDs to include"),
	}),
	execute: async (params: {
		planId: number;
		entryId: string;
		name?: string;
		description?: string;
		include_all?: boolean;
		case_ids?: number[];
	}) => {
		try {
			const { planId, entryId, ...entryData } = params;
			console.log(`Updating entry ${entryId} in test plan ${planId}...`);
			const entry = await testRailClient.updatePlanEntry(
				planId,
				entryId,
				entryData,
			);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Entry ${entryId} in test plan ${planId} updated successfully`,
						entry,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error updating plan entry:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to update plan entry: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

server.addTool({
	name: "closePlan",
	description: "Close a test plan in TestRail",
	parameters: z.object({
		planId: z.number().describe("TestRail Plan ID"),
	}),
	execute: async ({ planId }: { planId: number }) => {
		try {
			console.log(`Closing test plan ${planId}...`);
			const plan = await testRailClient.closePlan(planId);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Test plan ${planId} closed successfully`,
						plan,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error closing test plan:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to close test plan: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

server.addTool({
	name: "deletePlan",
	description: "Delete a test plan from TestRail",
	parameters: z.object({
		planId: z.number().describe("TestRail Plan ID"),
	}),
	execute: async ({ planId }: { planId: number }) => {
		try {
			console.log(`Deleting test plan ${planId}...`);
			await testRailClient.deletePlan(planId);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Test plan ${planId} deleted successfully`,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error deleting test plan:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to delete test plan: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

server.addTool({
	name: "deletePlanEntry",
	description: "Delete an entry from a test plan in TestRail",
	parameters: z.object({
		planId: z.number().describe("TestRail Plan ID"),
		entryId: z.string().describe("TestRail Plan Entry ID"),
	}),
	execute: async (params: { planId: number; entryId: string }) => {
		try {
			const { planId, entryId } = params;
			console.log(`Deleting entry ${entryId} from test plan ${planId}...`);
			await testRailClient.deletePlanEntry(planId, entryId);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						message: `Entry ${entryId} deleted from test plan ${planId} successfully`,
					},
					null,
					2,
				),
			};
		} catch (error) {
			console.error("Error deleting plan entry:", error);
			return {
				type: "text" as const,
				text: JSON.stringify(
					{
						error: `Failed to delete plan entry: ${error instanceof Error ? error.message : String(error)}`,
					},
					null,
					2,
				),
			};
		}
	},
});

// Server startup configuration
export const startServer = async () => {
	console.error("Starting TestRail MCP Server...");

	server.start({
		transportType: "sse",
		sse: {
			endpoint: "/sse",
			port: 3000,
		},
	});

	console.error("Server started successfully.");
};
