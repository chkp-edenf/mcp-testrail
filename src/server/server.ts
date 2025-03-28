import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
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

// McpServerの作成
const server = new McpServer({
	name: "TestRail MCP Server",
	version: "1.0.0",
});

// トランスポート管理用のマップ
const transports: { [sessionId: string]: SSEServerTransport } = {};

// サーバーの起動関数
export const startServer = async () => {
	console.log("Starting TestRail MCP Server...");

	// Expressアプリの作成
	const app = express();

	// すべてのAPIツールを登録
	registerAllTools(server, testRailClient);

	// リソーステンプレートを登録
	registerResourceTemplates(server, testRailClient);

	// SSEエンドポイントの設定
	app.get("/sse", async (_, res) => {
		const transport = new SSEServerTransport("/messages", res);
		transports[transport.sessionId] = transport;

		res.on("close", () => {
			delete transports[transport.sessionId];
		});

		await server.connect(transport);
	});

	// メッセージ処理エンドポイントの設定
	app.post("/messages", async (req, res) => {
		const sessionId = req.query.sessionId as string;
		const transport = transports[sessionId];

		if (transport) {
			await transport.handlePostMessage(req, res);
		} else {
			res
				.status(400)
				.send("セッションIDに対応するトランスポートが見つかりません");
		}
	});

	// サーバーの起動
	app.listen(3000, () => {
		console.log("Server started successfully.");
		console.log("server is running on SSE at http://localhost:3000/sse");
	});
};
