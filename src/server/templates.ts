import { FastMCP } from "fastmcp";
import { TestRailClient } from "../client/testRailApi.js";

/**
 * リソーステンプレートを登録する関数
 * @param server FastMCPサーバーインスタンス
 * @param testRailClient TestRailクライアントインスタンス
 */
export function registerResourceTemplates(
	server: FastMCP,
	testRailClient: TestRailClient,
): void {
	// テストケース詳細テンプレート
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

	// 今後、他のリソーステンプレート（プロジェクト、セクション、マイルストーンなど）を
	// 追加する場合は、ここに追加します
}
