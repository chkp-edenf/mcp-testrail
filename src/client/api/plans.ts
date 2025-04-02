import { AxiosResponse } from "axios";
import { BaseTestRailClient } from "./baseClient.js";
import { TestRailPlan } from "../../shared/schemas/plans.js";
import { handleApiError } from "./utils.js";
import { GetPlansInputType } from "../../shared/schemas/plans.js";

export class PlansClient extends BaseTestRailClient {
	/**
	 * Gets all test plans for a project
	 * @param projectId The ID of the project
	 * @param filters Optional filter parameters
	 * @returns Promise with array of test plans
	 */
	async getPlans(
		projectId: GetPlansInputType["projectId"],
		filters?: Record<string, string | number | boolean | null | undefined>,
	): Promise<TestRailPlan[]> {
		try {
			const response: AxiosResponse<TestRailPlan[]> = await this.client.get(
				`/api/v2/get_plans/${projectId}`,
				{ params: filters },
			);
			return response.data;
		} catch (error) {
			throw handleApiError(
				error,
				`Failed to get test plans for project ${projectId}`,
			);
		}
	}
}
