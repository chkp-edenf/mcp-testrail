// レスポンスの型定義
export type FastMCPToolResponse = {
	type: "text";
	text: string;
};

// エラーメッセージをフォーマットする関数
export function formatErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

// 成功レスポンスを作成する関数
export function createSuccessResponse(
	message: string,
	data?: Record<string, unknown>,
): FastMCPToolResponse {
	return {
		type: "text" as const,
		text: JSON.stringify(
			{
				message,
				...(data || {}),
			},
			null,
			2,
		),
	};
}

// エラーレスポンスを作成する関数
export function createErrorResponse(
	baseMessage: string,
	error: unknown,
): FastMCPToolResponse {
	const errorMessage = formatErrorMessage(error);
	return {
		type: "text" as const,
		text: JSON.stringify(
			{
				error: `${baseMessage}: ${errorMessage}`,
			},
			null,
			2,
		),
	};
}
