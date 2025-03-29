import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import "dotenv/config";
import { TestRailClient, TestRailClientConfig } from "../client/api/index.js";
import { registerAllTools } from "./api/index.js";

// Validate TestRail configuration
if (
	!process.env.TESTRAIL_URL ||
	!process.env.TESTRAIL_USERNAME ||
	!process.env.TESTRAIL_API_KEY
) {
	throw new Error(
		"TESTRAIL_URL, TESTRAIL_USERNAME, and TESTRAIL_API_KEY must be set",
	);
}

// Correct URL format: https://example.testrail.com/index.php?/
const url = process.env.TESTRAIL_URL;
const baseURL = url.endsWith("/index.php?/")
	? url
	: url.endsWith("/")
		? `${url}index.php?/`
		: `${url}/index.php?/`;

// TestRail client configuration
const testRailConfig: TestRailClientConfig = {
	baseURL: baseURL,
	auth: {
		username: process.env.TESTRAIL_USERNAME,
		password: process.env.TESTRAIL_API_KEY,
	},
};

// Initialize TestRail client
const testRailClient = new TestRailClient(testRailConfig);

// Create McpServer
const server = new McpServer({
	name: "TestRail MCP Server",
	version: "1.0.0",
});

// Map for transport management
const transports: { [sessionId: string]: SSEServerTransport } = {};

// Server startup function
export const startServer = async () => {
	console.log("Starting TestRail MCP Server...");

	// Create Express app
	const app = express();

	// Register all API tools
	registerAllTools(server, testRailClient);

	// SSE endpoint configuration
	app.get("/sse", async (_, res) => {
		const transport = new SSEServerTransport("/messages", res);
		transports[transport.sessionId] = transport;

		res.on("close", () => {
			delete transports[transport.sessionId];
		});

		await server.connect(transport);
	});

	// Message handling endpoint configuration
	app.post("/messages", async (req, res) => {
		const sessionId = req.query.sessionId as string;
		const transport = transports[sessionId];

		if (transport) {
			await transport.handlePostMessage(req, res);
		} else {
			res.status(400).send("No transport found for the session ID");
		}
	});

	// Start the server
	app.listen(3000, () => {
		console.log("Server started successfully.");
		console.log("Server is running on SSE at http://localhost:3000/sse");
	});
};
