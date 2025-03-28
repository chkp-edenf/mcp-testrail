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
