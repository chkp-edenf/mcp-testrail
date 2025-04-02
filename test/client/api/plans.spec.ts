import { describe, expect, it, vi, beforeEach } from "vitest";
import { PlansClient } from "../../../src/client/api/plans.js";
import { TestRailPlan } from "../../../src/shared/schemas/plans.js";
import { TestRailClientConfig, BaseTestRailClient } from "../../../src/client/api/baseClient.js";
import { AxiosInstance } from "axios";

describe("PlansClient", () => {
	const mockAxios = {
		get: vi.fn(),
		post: vi.fn(),
	};

	const mockConfig: TestRailClientConfig = {
		baseURL: "http://example.com",
		auth: {
			username: "test",
			password: "test",
		},
	};

	const client = new PlansClient(mockConfig);

	beforeEach(() => {
		const axiosInstance = (client as BaseTestRailClient)["client"] as AxiosInstance;
		vi.spyOn(axiosInstance, "get").mockImplementation(mockAxios.get);
		vi.spyOn(axiosInstance, "post").mockImplementation(mockAxios.post);
	});

	it("should get all test plans for a project", async () => {
		const mockPlans: TestRailPlan[] = [
			{
				id: 1,
				name: "Test Plan 1",
				description: "Description 1",
				project_id: 1,
				entries: [],
				created_on: 1234567890,
				created_by: 1,
				is_completed: false,
				completed_on: null,
				passed_count: 0,
				blocked_count: 0,
				untested_count: 0,
				retest_count: 0,
				failed_count: 0,
				url: "http://example.com",
			},
		];

		mockAxios.get.mockResolvedValueOnce({ data: mockPlans });

		const result = await client.getPlans(1);

		expect(mockAxios.get).toHaveBeenCalledWith("/api/v2/get_plans/1", {
			params: undefined,
		});
		expect(result).toEqual(mockPlans);
	});

	it("should handle errors when getting test plans", async () => {
		const errorMessage = "API Error";
		mockAxios.get.mockRejectedValueOnce(new Error(errorMessage));

		await expect(client.getPlans(1)).rejects.toThrow(errorMessage);
	});
}); 