import { AxiosResponse } from "axios";
import { BaseTestRailClient } from "./baseClient.js";
import { TestRailSuite } from "./types.js";
import { handleApiError } from "./utils.js";

export class SuitesClient extends BaseTestRailClient {
	/**
	 * Gets a specific test suite by ID
	 * @param suiteId The ID of the test suite
	 * @returns Promise with test suite details
	 */
	async getSuite(suiteId: number): Promise<TestRailSuite> {
		try {
			const response: AxiosResponse<TestRailSuite> = await this.client.get(
				`/api/v2/get_suite/${suiteId}`,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to get test suite ${suiteId}`);
		}
	}

	/**
	 * Gets all test suites for a project
	 * @param projectId The ID of the project
	 * @returns Promise with array of test suites
	 */
	async getSuites(projectId: number): Promise<TestRailSuite[]> {
		try {
			const response: AxiosResponse<TestRailSuite[]> = await this.client.get(
				`/api/v2/get_suites/${projectId}`,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(
				error,
				`Failed to get test suites for project ${projectId}`,
			);
		}
	}

	/**
	 * Adds a new test suite to a project
	 * @param projectId The ID of the project
	 * @param data The test suite data
	 * @returns Promise with created test suite
	 */
	async addSuite(
		projectId: number,
		data: Record<string, unknown>,
	): Promise<TestRailSuite> {
		try {
			const response: AxiosResponse<TestRailSuite> = await this.client.post(
				`/api/v2/add_suite/${projectId}`,
				data,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(
				error,
				`Failed to add test suite to project ${projectId}`,
			);
		}
	}

	/**
	 * Updates an existing test suite
	 * @param suiteId The ID of the test suite
	 * @param data The test suite data to update
	 * @returns Promise with updated test suite
	 */
	async updateSuite(
		suiteId: number,
		data: Record<string, unknown>,
	): Promise<TestRailSuite> {
		try {
			const response: AxiosResponse<TestRailSuite> = await this.client.post(
				`/api/v2/update_suite/${suiteId}`,
				data,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to update test suite ${suiteId}`);
		}
	}

	/**
	 * Deletes a test suite
	 * @param suiteId The ID of the test suite
	 */
	async deleteSuite(suiteId: number): Promise<void> {
		try {
			await this.client.post(`/api/v2/delete_suite/${suiteId}`, {});
		} catch (error) {
			throw handleApiError(error, `Failed to delete test suite ${suiteId}`);
		}
	}
}
