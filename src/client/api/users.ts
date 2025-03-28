import { AxiosResponse } from "axios";
import { BaseTestRailClient } from "./baseClient.js";
import { TestRailUser } from "./types.js";
import { handleApiError } from "./utils.js";
import {
	GetUserInputType,
	GetUserByEmailInputType,
} from "../../shared/schemas/users.js";

export class UsersClient extends BaseTestRailClient {
	/**
	 * Gets a specific user by ID
	 * @param userId The ID of the user
	 * @returns Promise with user details
	 */
	async getUser(userId: GetUserInputType["userId"]): Promise<TestRailUser> {
		try {
			const response: AxiosResponse<TestRailUser> = await this.client.get(
				`/api/v2/get_user/${userId}`,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to get user ${userId}`);
		}
	}

	/**
	 * Gets a user by email address
	 * @param email The email address of the user
	 * @returns Promise with user details
	 */
	async getUserByEmail(
		email: GetUserByEmailInputType["email"],
	): Promise<TestRailUser> {
		try {
			const response: AxiosResponse<TestRailUser> = await this.client.get(
				`/api/v2/get_user_by_email?email=${encodeURIComponent(email)}`,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to get user with email ${email}`);
		}
	}

	/**
	 * Gets all users
	 * @returns Promise with array of users
	 */
	async getUsers(): Promise<TestRailUser[]> {
		try {
			const response: AxiosResponse<TestRailUser[]> =
				await this.client.get("/api/v2/get_users");
			return response.data;
		} catch (error) {
			throw handleApiError(error, "Failed to get users");
		}
	}
}
