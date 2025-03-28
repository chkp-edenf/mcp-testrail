import { BaseTestRailClient } from "./baseClient.js";
import { TestRailSharedStep, TestRailSharedStepItem } from "./types.js";
import { handleApiError } from "./utils.js";

export class SharedStepsClient extends BaseTestRailClient {
	/**
	 * Get a specific shared step by ID
	 * @param sharedStepId The ID of the shared step
	 * @returns Promise with shared step details
	 */
	async getSharedStep(sharedStepId: number): Promise<TestRailSharedStep> {
		try {
			const response = await this.client.get<TestRailSharedStep>(
				`/api/v2/get_shared_step/${sharedStepId}`
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to get shared step ${sharedStepId}`);
		}
	}

	/**
	 * Get all shared steps for a project
	 * @param projectId The ID of the project
	 * @param filters Optional filter parameters (created_after, created_before, updated_after, updated_before, created_by, limit, offset)
	 * @returns Promise with array of shared steps
	 */
	async getSharedSteps(
		projectId: number,
		filters?: Record<string, string | number | boolean | null | undefined>
	): Promise<TestRailSharedStepItem[]> {
		try {
			const response = await this.client.get<TestRailSharedStepItem[]>(
				`/api/v2/get_shared_steps/${projectId}`,
				{ params: filters }
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to get shared steps for project ${projectId}`);
		}
	}

	/**
	 * Add a new shared step to a project
	 * @param projectId The ID of the project
	 * @param data The shared step data
	 * @returns Promise with created shared step
	 */
	async addSharedStep(
		projectId: number,
		data: Record<string, unknown>
	): Promise<TestRailSharedStep> {
		try {
			const response = await this.client.post<TestRailSharedStep>(
				`/api/v2/add_shared_step/${projectId}`,
				data
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to add shared step to project ${projectId}`);
		}
	}

	/**
	 * Update an existing shared step
	 * @param sharedStepId The ID of the shared step
	 * @param data The shared step data to update
	 * @returns Promise with updated shared step
	 */
	async updateSharedStep(
		sharedStepId: number,
		data: Record<string, unknown>
	): Promise<TestRailSharedStep> {
		try {
			const response = await this.client.post<TestRailSharedStep>(
				`/api/v2/update_shared_step/${sharedStepId}`,
				data
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to update shared step ${sharedStepId}`);
		}
	}

	/**
	 * Delete a shared step
	 * @param sharedStepId The ID of the shared step
	 * @param keepInCases Whether to keep the steps in test cases that reference this shared step (default true)
	 */
	async deleteSharedStep(sharedStepId: number, keepInCases = true): Promise<void> {
		try {
			await this.client.post(`/api/v2/delete_shared_step/${sharedStepId}`, {
				keep_in_cases: keepInCases ? 1 : 0,
			});
		} catch (error) {
			throw handleApiError(error, `Failed to delete shared step ${sharedStepId}`);
		}
	}
}
