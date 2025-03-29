import { AxiosResponse } from "axios";
import { BaseTestRailClient } from "./baseClient.js";
import { TestRailPlan, TestRailPlanEntry } from "../../shared/schemas/plans.js";
import { handleApiError } from "./utils.js";
import {
	GetPlanInputType,
	GetPlansInputType,
	AddPlanInputType,
	AddPlanEntryInputType,
	UpdatePlanInputType,
	UpdatePlanEntryInputType,
	ClosePlanInputType,
	DeletePlanInputType,
	DeletePlanEntryInputType,
} from "../../shared/schemas/plans.js";

export class PlansClient extends BaseTestRailClient {
	/**
	 * Gets a specific test plan by ID
	 * @param planId The ID of the test plan
	 * @returns Promise with test plan details
	 */
	async getPlan(planId: GetPlanInputType["planId"]): Promise<TestRailPlan> {
		try {
			const response: AxiosResponse<TestRailPlan> = await this.client.get(
				`/api/v2/get_plan/${planId}`,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to get test plan ${planId}`);
		}
	}

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

	/**
	 * Adds a new test plan to a project
	 * @param projectId The ID of the project
	 * @param data The test plan data
	 * @returns Promise with created test plan
	 */
	async addPlan(
		projectId: AddPlanInputType["projectId"],
		data: Omit<AddPlanInputType, "projectId">,
	): Promise<TestRailPlan> {
		try {
			const response: AxiosResponse<TestRailPlan> = await this.client.post(
				`/api/v2/add_plan/${projectId}`,
				data,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(
				error,
				`Failed to add test plan to project ${projectId}`,
			);
		}
	}

	/**
	 * Adds an entry to an existing test plan
	 * @param planId The ID of the test plan
	 * @param data The entry data
	 * @returns Promise with created plan entry
	 */
	async addPlanEntry(
		planId: AddPlanEntryInputType["planId"],
		data: Omit<AddPlanEntryInputType, "planId">,
	): Promise<TestRailPlanEntry> {
		try {
			const response: AxiosResponse<TestRailPlanEntry> = await this.client.post(
				`/api/v2/add_plan_entry/${planId}`,
				data,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to add entry to test plan ${planId}`);
		}
	}

	/**
	 * Updates an existing test plan
	 * @param planId The ID of the test plan
	 * @param data The test plan data to update
	 * @returns Promise with updated test plan
	 */
	async updatePlan(
		planId: UpdatePlanInputType["planId"],
		data: Omit<UpdatePlanInputType, "planId">,
	): Promise<TestRailPlan> {
		try {
			const response: AxiosResponse<TestRailPlan> = await this.client.post(
				`/api/v2/update_plan/${planId}`,
				data,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to update test plan ${planId}`);
		}
	}

	/**
	 * Updates an existing plan entry
	 * @param planId The ID of the test plan
	 * @param entryId The ID of the entry
	 * @param data The entry data to update
	 * @returns Promise with updated plan entry
	 */
	async updatePlanEntry(
		planId: UpdatePlanEntryInputType["planId"],
		entryId: UpdatePlanEntryInputType["entryId"],
		data: Omit<UpdatePlanEntryInputType, "planId" | "entryId">,
	): Promise<TestRailPlanEntry> {
		try {
			const response: AxiosResponse<TestRailPlanEntry> = await this.client.post(
				`/api/v2/update_plan_entry/${planId}/${entryId}`,
				data,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(
				error,
				`Failed to update entry ${entryId} in test plan ${planId}`,
			);
		}
	}

	/**
	 * Closes a test plan
	 * @param planId The ID of the test plan
	 * @returns Promise with closed test plan
	 */
	async closePlan(planId: ClosePlanInputType["planId"]): Promise<TestRailPlan> {
		try {
			const response: AxiosResponse<TestRailPlan> = await this.client.post(
				`/api/v2/close_plan/${planId}`,
				{},
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to close test plan ${planId}`);
		}
	}

	/**
	 * Deletes a test plan
	 * @param planId The ID of the test plan
	 */
	async deletePlan(planId: DeletePlanInputType["planId"]): Promise<void> {
		try {
			await this.client.post(`/api/v2/delete_plan/${planId}`, {});
		} catch (error) {
			throw handleApiError(error, `Failed to delete test plan ${planId}`);
		}
	}

	/**
	 * Deletes an entry from a test plan
	 * @param planId The ID of the test plan
	 * @param entryId The ID of the entry
	 */
	async deletePlanEntry(
		planId: DeletePlanEntryInputType["planId"],
		entryId: DeletePlanEntryInputType["entryId"],
	): Promise<void> {
		try {
			await this.client.post(
				`/api/v2/delete_plan_entry/${planId}/${entryId}`,
				{},
			);
		} catch (error) {
			throw handleApiError(
				error,
				`Failed to delete entry ${entryId} from test plan ${planId}`,
			);
		}
	}
}
