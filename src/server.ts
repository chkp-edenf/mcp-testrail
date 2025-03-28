import { FastMCP } from "fastmcp";
import { z } from "zod";
import "dotenv/config";
import { TestRailClient, TestRailClientConfig } from "./client/testRailApi.js";
import * as fs from "node:fs";

// TestRail設定の検証
if (!process.env.TESTRAIL_URL || !process.env.TESTRAIL_USERNAME || !process.env.TESTRAIL_API_KEY) {
  throw new Error("TESTRAIL_URL, TESTRAIL_USERNAME, and TESTRAIL_API_KEY must be set");
}

// 正しいURLフォーマットに修正: https://example.testrail.com/index.php?/
const url = process.env.TESTRAIL_URL;
const baseURL = url.endsWith('/index.php?/') 
  ? url 
  : url.endsWith('/') 
    ? `${url}index.php?` 
    : `${url}/index.php?`;

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

// 全プロジェクトを取得するツール
server.addTool({
  name: "getProjects",
  description: "TestRailからプロジェクト一覧を取得します",
  parameters: z.object({}),
  execute: async () => {
    try {
      const response = await testRailClient.getProjects();
      // レスポンスの構造を確認するためにJSON文字列として返す
      return `TestRailプロジェクト一覧: ${JSON.stringify(response, null, 2)}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`プロジェクト一覧の取得に失敗しました: ${errorMessage}`);
    }
  }
});

// プロジェクトのテストケースを取得するツール
server.addTool({
  name: "getTestCases",
  description: "指定したプロジェクトのテストケース一覧を取得します",
  parameters: z.object({
    projectId: z.number().describe("TestRailプロジェクトID"),
  }),
  execute: async ({ projectId }) => {
    try {
      const response = await testRailClient.getCases(projectId);
      // レスポンスの構造を確認するためにJSON文字列として返す
      return `プロジェクト${projectId}のテストケース一覧: ${JSON.stringify(response, null, 2)}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`プロジェクト${projectId}のテストケース取得に失敗しました: ${errorMessage}`);
    }
  }
});

// テスト結果を追加するツール
server.addTool({
  name: "addTestResult",
  description: "テスト結果を追加します",
  parameters: z.object({
    testId: z.number().describe("TestRailテストID"),
    statusId: z.number().describe("ステータスID (1:合格, 2:ブロック, 3:未テスト, 4:再テスト, 5:不合格)"),
    comment: z.string().optional().describe("テスト結果に関するコメント"),
  }),
  execute: async ({ testId, statusId, comment = "" }) => {
    try {
      const result = await testRailClient.addResult(testId, {
        status_id: statusId,
        comment: comment,
      });
      return `テスト${testId}に結果を追加しました。ステータス: ${statusId}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`テスト結果の追加に失敗しました: ${errorMessage}`);
    }
  }
});

// テストケースにファイルを添付するツール
server.addTool({
  name: "uploadAttachment",
  description: "テストケースにファイルを添付します",
  parameters: z.object({
    caseId: z.number().describe("TestRailケースID"),
    filePath: z.string().describe("添付するファイルのパス"),
  }),
  execute: async ({ caseId, filePath }) => {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`ファイルが見つかりません: ${filePath}`);
      }

      const result = await testRailClient.addAttachmentToCase(caseId, filePath);
      return `ケース${caseId}にファイルを添付しました。添付ID: ${result.attachment_id}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`ファイル添付に失敗しました: ${errorMessage}`);
    }
  }
});

// テストケース詳細のリソーステンプレート
server.addResourceTemplate({
  uriTemplate: "testcase://{caseId}",
  name: "テストケース詳細",
  mimeType: "text/markdown",
  arguments: [
    {
      name: "caseId",
      description: "TestRailケースID",
      required: true,
    },
  ],
  async load({ caseId }) {
    try {
      const numericCaseId = Number.parseInt(String(caseId), 10);
      const testCase = await testRailClient.getCase(numericCaseId);

      const content = `# テストケース: ${testCase.title} (ID: ${testCase.id})\n\n` +
        `**タイプ**: ${testCase.type_id}\n` +
        `**優先度**: ${testCase.priority_id}\n` +
        `**セクション**: ${testCase.section_id}\n\n` +
        `## 前提条件\n${testCase.custom_preconds || "なし"}\n\n` +
        `## ステップ\n${testCase.custom_steps || "なし"}\n\n` +
        `## 期待結果\n${testCase.custom_expected || "なし"}`;

      return {
        text: content
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        text: `テストケース${caseId}の取得に失敗しました: ${errorMessage}`
      };
    }
  },
});

// サーバー起動設定
export const startServer = async () => {
  console.error("TestRail MCP Server を起動しています...");
  
  server.start({
    transportType: "sse",
    sse: {
      endpoint: "/sse",
      port: 3000,
    },
  });
  
  console.error("サーバーが正常に起動しました。");
}; 
