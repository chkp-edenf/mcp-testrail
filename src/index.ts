// TestRail MCP Serverのエントリーポイント
import { startServer } from "./server/server.js";

// MCPツールのパラメータ型変換問題に対処するための設定
// パラメータが文字列として渡されても適切に処理できるようにする
process.env.MCP_NUMERIC_STRING_HANDLING = "convert";

// サーバー起動
startServer();
