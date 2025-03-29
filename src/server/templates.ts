import {
	McpServer,
	ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailClient } from "../client/api/index.js";
import { TestRailCase } from "../shared/schemas/cases.js";
import { TestRailProject } from "../shared/schemas/projects.js";
import { TestRailSection } from "../shared/schemas/sections.js";
import { TestRailSuite } from "../shared/schemas/suites.js";
import { TestRailMilestone } from "../shared/schemas/milestones.js";
import { TestRailRun } from "../shared/schemas/runs.js";
import { TestRailResult } from "../shared/schemas/results.js";
import { TestStatusEnum } from "../shared/schemas/common.js";
import { TestRailUser } from "../shared/schemas/users.js";
import { TestRailPlan } from "../shared/schemas/plans.js";
import { TestRailSharedStep } from "../shared/schemas/sharedSteps.js";

/**
 * Function to register resource templates
 * @param server McpServer instance
 * @param testRailClient TestRail client instance
 */
export function registerResourceTemplates(
	server: McpServer,
	testRailClient: TestRailClient,
): void {
	// Test case detail template
	server.resource(
		"testcase",
		new ResourceTemplate("testcase://{caseId}", { list: undefined }),
		async (uri, { caseId }) => {
			try {
				const numericCaseId = Number.parseInt(String(caseId), 10);
				const testCase = await testRailClient.cases.getCase(numericCaseId);

				const content =
					`# Test Case: ${testCase.title} (ID: ${testCase.id})\n\n` +
					`**Type**: ${testCase.type_id}\n` +
					`**Priority**: ${testCase.priority_id}\n` +
					`**Section**: ${testCase.section_id}\n\n` +
					`## Preconditions\n${testCase.custom_preconds || "None"}\n\n` +
					`## Steps\n${testCase.custom_steps || "None"}\n\n` +
					`## Expected Result\n${testCase.custom_expected || "None"}`;

				return {
					contents: [
						{
							uri: uri.href,
							text: content,
						},
					],
				};
			} catch (error) {
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

	// Additional resource templates (projects, sections, milestones, etc.) can be added here as needed
}

/**
 * Returns a formatted HTML template for rendering a test case
 * @param testCase The test case object
 * @param project The project object
 * @param statuses The test statuses
 * @param users The users list
 * @returns Formatted HTML template
 */
export function getTestCaseTemplate(
	testCase: TestRailCase,
	project?: TestRailProject,
	statuses?: Record<number, { label: string; color: string }>,
	users?: TestRailUser[],
): string {
	// Find user information
	const createdByUser = users?.find((user) => user.id === testCase.created_by);
	const updatedByUser = testCase.updated_by
		? users?.find((user) => user.id === testCase.updated_by)
		: undefined;

	// Format dates
	const createdDate = new Date(testCase.created_on * 1000).toLocaleString();
	const updatedDate = testCase.updated_on
		? new Date(testCase.updated_on * 1000).toLocaleString()
		: undefined;

	// Get status information
	const statusInfo =
		testCase.status_id && statuses ? statuses[testCase.status_id] : undefined;

	return `
  <div class="testrail-case">
    <h2>${testCase.title}</h2>
    ${project ? `<p><strong>Project:</strong> ${project.name}</p>` : ""}
    ${
			statusInfo
				? `<p><strong>Status:</strong> <span style="color: ${statusInfo.color};">${statusInfo.label}</span></p>`
				: ""
		}
    <p><strong>Created by:</strong> ${
			createdByUser?.name || testCase.created_by
		} on ${createdDate}</p>
    ${
			updatedByUser
				? `<p><strong>Updated by:</strong> ${updatedByUser.name} on ${updatedDate}</p>`
				: ""
		}
    ${
			testCase.estimate
				? `<p><strong>Estimate:</strong> ${testCase.estimate}</p>`
				: ""
		}
    ${
			testCase.custom_preconds
				? `<div><strong>Preconditions:</strong><div>${testCase.custom_preconds}</div></div>`
				: ""
		}
    ${
			testCase.custom_steps
				? `<div><strong>Steps:</strong><div>${testCase.custom_steps}</div></div>`
				: ""
		}
    ${
			testCase.custom_expected
				? `<div><strong>Expected Results:</strong><div>${testCase.custom_expected}</div></div>`
				: ""
		}
  </div>`;
}

// Additional resource templates (projects, sections, milestones, etc.) can be added here as needed
