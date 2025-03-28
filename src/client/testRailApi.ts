import axios, { AxiosInstance, AxiosError } from "axios";

/**
 * TestRail API Response for Project
 */
export interface TestRailProject {
	id: number;
	name: string;
	announcement: string;
	show_announcement: boolean;
	is_completed: boolean;
	completed_on: number;
	suite_mode: number;
	url: string;
}

/**
 * TestRail API Response for Case
 */
interface TestRailCase {
	id: number;
	title: string;
	section_id: number;
	template_id: number;
	type_id: number;
	priority_id: number;
	milestone_id?: number;
	refs?: string;
	created_by: number;
	created_on: number;
	updated_by: number;
	updated_on: number;
	estimate?: string;
	estimate_forecast?: string;
	suite_id: number;
	custom_preconds?: string;
	custom_steps?: string;
	custom_expected?: string;
	custom_steps_separated?: TestRailStep[];
	custom_mission?: string;
	custom_goals?: string;
}

interface TestRailStep {
	content: string;
	expected: string;
}

/**
 * TestRail API Response for Run
 */
export interface TestRailRun {
	id: number;
	suite_id: number;
	name: string;
	description: string;
	milestone_id: number | null;
	assignedto_id: number | null;
	include_all: boolean;
	is_completed: boolean;
	completed_on: number | null;
	config: string | null;
	config_ids: number[];
	passed_count: number;
	blocked_count: number;
	untested_count: number;
	retest_count: number;
	failed_count: number;
	custom_status_count: Record<string, number>;
	created_on: number;
	created_by: number;
	plan_id: number;
	url: string;
	refs: string;
}

/**
 * TestRail API Response for Result
 */
export interface TestRailResult {
	id: number;
	test_id: number;
	status_id: number;
	created_by: number;
	created_on: number;
	assignedto_id: number;
	comment: string;
	version: string;
	elapsed: string;
	defects: string;
	custom_step_results?: TestRailStepResult[];
	custom_fields?: Record<string, unknown>;
}

interface TestRailStepResult {
	status_id: number;
	content: string;
	expected: string;
	actual: string;
}

/**
 * TestRail API Response for User
 */
interface TestRailUser {
	id: number;
	name: string;
	email: string;
	is_active: boolean;
	role_id: number;
}

/**
 * TestRail API Response for Test
 */
interface TestRailTest {
	id: number;
	case_id: number;
	status_id: number;
	assignedto_id: number;
	run_id: number;
	title: string;
	template_id: number;
	type_id: number;
	priority_id: number;
	milestone_id: number;
	refs: string;
	estimate: string;
	estimate_forecast: string;
	custom_preconds: string;
	custom_steps: string;
	custom_expected: string;
}

/**
 * Payload for creating a new test run
 */
export interface AddRunPayload {
	suite_id?: number;
	name: string;
	description?: string;
	milestone_id?: number;
	assignedto_id?: number;
	include_all?: boolean;
	case_ids?: number[];
}

/**
 * Payload for adding a test result
 */
export interface AddResultPayload {
	status_id: number;
	comment?: string;
	version?: string;
	elapsed?: string;
	defects?: string;
	assignedto_id?: number;
	custom_fields?: Record<string, unknown>;
}

/**
 * Status IDs used in TestRail
 */
export enum TestStatus {
	Passed = 1,
	Blocked = 2,
	Untested = 3,
	Retest = 4,
	Failed = 5,
}

interface PaginatedResponse<T> {
	offset: number;
	limit: number;
	size: number;
	_links: {
		next?: string;
		prev?: string;
	};
	items: T[];
}

// TestRail API client configuration interface
export interface TestRailClientConfig {
	baseURL: string;
	auth: {
		username: string;
		password: string;
	};
	timeout?: number;
	headers?: Record<string, string>;
}

/**
 * Handle API errors with better logging
 * @param message Context message for the error
 * @param error The original error
 */
function handleApiError(message: string, error: unknown): void {
	if (axios.isAxiosError(error)) {
		const status = error.response?.status;
		const responseData = error.response?.data;

		console.error(`${message}: HTTP ${status}`);
		if (responseData) {
			console.error("Response:", JSON.stringify(responseData, null, 2));
		}
	} else {
		console.error(`${message}:`, error);
	}
	throw error;
}

export class TestRailClient {
	private client: AxiosInstance;

	constructor(config: TestRailClientConfig) {
		this.client = axios.create({
			baseURL: config.baseURL,
			headers: {
				"Content-Type": "application/json",
				...(config.headers || {}),
			},
			timeout: config.timeout || 30000,
			auth: config.auth,
		});
	}

	/**
	 * Set a custom header
	 */
	setHeader(name: string, value: string): void {
		this.client.defaults.headers.common[name] = value;
	}

	// Test Cases API

	async getCase(caseId: number): Promise<TestRailCase> {
		try {
			const response = await this.client.get<TestRailCase>(
				`/api/v2/get_case/${caseId}`,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to get case ${caseId}`, error);
			throw error;
		}
	}

	async getCases(
		projectId: number,
		params?: Record<string, string | number | boolean | null | undefined>,
	): Promise<TestRailCase[]> {
		try {
			const response = await this.client.get<TestRailCase[]>(
				`/api/v2/get_cases/${projectId}`,
				{ params },
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to get cases for project ${projectId}`, error);
			throw error;
		}
	}

	async addCase(
		sectionId: number,
		data: Record<string, unknown>,
	): Promise<TestRailCase> {
		try {
			const response = await this.client.post<TestRailCase>(
				`/api/v2/add_case/${sectionId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to add case to section ${sectionId}`, error);
			throw error;
		}
	}

	// Projects API

	async getProject(projectId: number): Promise<TestRailProject> {
		try {
			const response = await this.client.get<TestRailProject>(
				`/api/v2/get_project/${projectId}`,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to get project ${projectId}`, error);
			throw error;
		}
	}

	async getProjects(
		params?: Record<string, string | number | boolean | null | undefined>,
	): Promise<TestRailProject[]> {
		try {
			const response = await this.client.get<TestRailProject[]>(
				"/api/v2/get_projects",
				{ params },
			);
			return response.data;
		} catch (error) {
			handleApiError("Failed to get projects", error);
			throw error;
		}
	}

	// Results API

	async addResult(
		testId: number,
		data: Record<string, unknown>,
	): Promise<TestRailResult> {
		try {
			const response = await this.client.post<TestRailResult>(
				`/api/v2/add_result/${testId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to add result for test ${testId}`, error);
			throw error;
		}
	}

	async addResultForCase(
		runId: number,
		caseId: number,
		data: Record<string, unknown>,
	): Promise<TestRailResult> {
		try {
			const response = await this.client.post<TestRailResult>(
				`/api/v2/add_result_for_case/${runId}/${caseId}`,
				data,
			);
			return response.data;
		} catch (error) {
			// For 400 errors, log and skip (possible user error in TestID specification)
			if (axios.isAxiosError(error) && error.response?.status === 400) {
				console.error(
					`Skipping result for case ${caseId} in run ${runId} due to 400 Bad Request`,
				);
				if (error.response?.data) {
					console.error(
						"Response:",
						JSON.stringify(error.response.data, null, 2),
					);
				}
			}
			handleApiError(
				`Failed to add result for case ${caseId} in run ${runId}`,
				error,
			);
			throw error;
		}
	}

	// Runs API

	async getRun(runId: number): Promise<TestRailRun> {
		try {
			const response = await this.client.get<TestRailRun>(
				`/api/v2/get_run/${runId}`,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to get run ${runId}`, error);
			throw error;
		}
	}

	async addRun(projectId: number, data: AddRunPayload): Promise<TestRailRun> {
		try {
			const response = await this.client.post<TestRailRun>(
				`/api/v2/add_run/${projectId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to add run to project ${projectId}`, error);
			throw error;
		}
	}

	// Users API

	async getUserByEmail(email: string): Promise<TestRailUser> {
		try {
			const response = await this.client.get<TestRailUser>(
				`/api/v2/get_user_by_email?email=${encodeURIComponent(email)}`,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to get user by email ${email}`, error);
			throw error;
		}
	}
}
