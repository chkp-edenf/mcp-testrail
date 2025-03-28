import { FastMCP } from "fastmcp";
import "dotenv/config";
import { TestRailClient, TestRailClientConfig } from "../client/testRailApi.js";
import { registerAllTools } from "./api/index.js";
import { registerResourceTemplates } from "./templates.js";

// TestRail設定の検証
if (
	!process.env.TESTRAIL_URL ||
	!process.env.TESTRAIL_USERNAME ||
	!process.env.TESTRAIL_API_KEY
) {
	throw new Error(
		"TESTRAIL_URL, TESTRAIL_USERNAME, and TESTRAIL_API_KEY must be set",
	);
}

// URL形式の修正: https://example.testrail.com/index.php?/
const url = process.env.TESTRAIL_URL;
const baseURL = url.endsWith("/index.php?/")
	? url
	: url.endsWith("/")
		? `${url}index.php?/`
		: `${url}/index.php?/`;

// TestRailクライアント設定
const testRailConfig: TestRailClientConfig = {
	baseURL: baseURL,
	auth: {
		username: process.env.TESTRAIL_USERNAME,
		password: process.env.TESTRAIL_API_KEY,
	},
};

// TestRailクライアントの初期化
const testRailClient = new TestRailClient(testRailConfig);

// FastMCPサーバーの作成
const server = new FastMCP({
	name: "TestRail MCP Server",
	version: "1.0.0",
});

// すべてのAPIツールを登録
registerAllTools(server, testRailClient);

// リソーステンプレートを登録
registerResourceTemplates(server, testRailClient);

// サーバーの起動関数
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
