import "dotenv/config";
import {
	McpServer,
	ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TestRailClient, TestRailClientConfig } from "./client/testRailApi.js";
import * as fs from "node:fs";
import { z } from "zod";

// TestRail type definitions
interface TestRailProject {
	id: number;
	name: string;
	[key: string]: unknown;
}

interface TestRailCase {
	id: number;
	title: string;
	[key: string]: unknown;
}

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

// TestRail client configuration
const testRailConfig: TestRailClientConfig = {
	baseURL: baseURL,
	auth: {
		username: process.env.TESTRAIL_USERNAME,
		password: process.env.TESTRAIL_API_KEY,
	},
};

// Log configuration for debugging (without sensitive information)
console.error(`TestRail URL: ${testRailConfig.baseURL}`);
console.error(`TestRail Username: ${testRailConfig.auth.username}`);

const testRailClient = new TestRailClient(testRailConfig);

// Create MCP server
const server = new McpServer({
	name: "TestRail MCP Server",
	version: "1.0.0",
});

// Tool to get all TestRail projects
server.tool("getProjects", {}, async () => {
	try {
		const projects = await testRailClient.getProjects();
		return {
			content: [
				{
					type: "text",
					text: `TestRail Projects: ${JSON.stringify(projects, null, 2)}`,
				},
			],
		};
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return {
			content: [
				{ type: "text", text: `Error fetching projects: ${errorMessage}` },
			],
		};
	}
});

// Tool to get test cases for a specific project
server.tool(
	"getTestCases",
	{ projectId: z.number() },
	async ({ projectId }) => {
		try {
			const cases = await testRailClient.getCases(projectId);
			return {
				content: [
					{
						type: "text",
						text: `Test cases for project ${projectId}: ${JSON.stringify(cases, null, 2)}`,
					},
				],
			};
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return {
				content: [
					{
						type: "text",
						text: `Error fetching test cases for project ${projectId}: ${errorMessage}`,
					},
				],
			};
		}
	},
);

// Tool to add a test result
server.tool(
	"addTestResult",
	{
		testId: z.number(),
		statusId: z.number(),
		comment: z.string().optional(),
	},
	async ({ testId, statusId, comment = "" }) => {
		try {
			await testRailClient.addResult(testId, {
				status_id: statusId,
				comment: comment,
			});

			return {
				content: [
					{
						type: "text",
						text: `Successfully added result for test ${testId} with status ${statusId}`,
					},
				],
			};
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return {
				content: [
					{ type: "text", text: `Error adding test result: ${errorMessage}` },
				],
			};
		}
	},
);

// Tool to upload an attachment to a test case
server.tool(
	"uploadAttachment",
	{
		caseId: z.number(),
		filePath: z.string(),
	},
	async ({ caseId, filePath }) => {
		try {
			if (!fs.existsSync(filePath)) {
				return {
					content: [{ type: "text", text: `File not found: ${filePath}` }],
				};
			}

			const result = await testRailClient.addAttachmentToCase(caseId, filePath);

			return {
				content: [
					{
						type: "text",
						text: `Successfully uploaded attachment to case ${caseId}, attachment ID: ${result.attachment_id}`,
					},
				],
			};
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return {
				content: [
					{ type: "text", text: `Error uploading attachment: ${errorMessage}` },
				],
			};
		}
	},
);

// Resource template for test case details
server.resource(
	"testcase",
	new ResourceTemplate("testcase://{caseId}", { list: undefined }),
	async (uri, { caseId }) => {
		try {
			const numericCaseId = Number.parseInt(String(caseId), 10);
			const testCase = await testRailClient.getCase(numericCaseId);

			return {
				contents: [
					{
						uri: uri.href,
						text:
							`# Test Case: ${testCase.title} (ID: ${testCase.id})\n\n` +
							`**Type**: ${testCase.type_id}\n` +
							`**Priority**: ${testCase.priority_id}\n` +
							`**Section**: ${testCase.section_id}\n\n` +
							`## Preconditions\n${testCase.custom_preconds || "None"}\n\n` +
							`## Steps\n${testCase.custom_steps || "None"}\n\n` +
							`## Expected Result\n${testCase.custom_expected || "None"}`,
					},
				],
			};
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return {
				contents: [
					{
						uri: uri.href,
						text: `Error fetching test case ${caseId}: ${errorMessage}`,
					},
				],
			};
		}
	},
);

// Start the server with StdioServerTransport
const transport = new StdioServerTransport();

console.error("Starting TestRail MCP Server...");
await server.connect(transport);
console.error("Server started successfully.");
