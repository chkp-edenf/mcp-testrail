import { z } from "zod";

// ユーザー取得用のスキーマ（引数なし）
export const getUsersSchema = {};

// ユーザーIDによる取得用のスキーマ
export const getUserSchema = {
	userId: z.number().describe("TestRail User ID"),
};

// メールアドレスによるユーザー取得用のスキーマ
export const getUserByEmailSchema = {
	email: z.string().email().describe("Email address of the user"),
};

// 各スキーマからZodオブジェクトを作成
export const GetUsersInput = z.object(getUsersSchema);
export const GetUserInput = z.object(getUserSchema);
export const GetUserByEmailInput = z.object(getUserByEmailSchema);

// 入力型を抽出
export type GetUsersInputType = z.infer<typeof GetUsersInput>;
export type GetUserInputType = z.infer<typeof GetUserInput>;
export type GetUserByEmailInputType = z.infer<typeof GetUserByEmailInput>;
