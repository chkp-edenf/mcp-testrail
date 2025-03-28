import { FastMCP } from "fastmcp";
import { TestRailClient } from "../../client/testRailApi.js";
import { registerProjectTools } from "./projects.js";
import { registerCaseTools } from "./cases.js";
import { registerSectionTools } from "./sections.js";
import { registerSharedStepTools } from "./sharedSteps.js";
import { registerMilestoneTools } from "./milestones.js";

/**
 * すべてのAPIツールをサーバーに登録する関数
 * @param server FastMCPサーバーインスタンス
 * @param testRailClient TestRailクライアントインスタンス
 */
export function registerAllTools(
	server: FastMCP,
	testRailClient: TestRailClient,
): void {
	// 各リソース別のツールを登録
	registerProjectTools(server, testRailClient);
	registerCaseTools(server, testRailClient);
	registerSectionTools(server, testRailClient);
	registerSharedStepTools(server, testRailClient);
	registerMilestoneTools(server, testRailClient);

	// 今後、他のリソース（テストスイート、テスト計画、実行結果など）の
	// ツールを追加する場合は、ここに追加登録します
}

// すべてのツールモジュールをエクスポート
export * from "./projects.js";
export * from "./cases.js";
export * from "./sections.js";
export * from "./sharedSteps.js";
export * from "./milestones.js";
