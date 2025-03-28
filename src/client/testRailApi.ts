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
 * TestRail API Response for Plan
 */
export interface TestRailPlan {
	id: number;
	name: string;
	description?: string;
	milestone_id?: number | null;
	assignedto_id?: number | null;
	project_id: number;
	created_on: number;
	created_by: number;
	completed_on?: number | null;
	is_completed: boolean;
	passed_count: number;
	blocked_count: number;
	untested_count: number;
	retest_count: number;
	failed_count: number;
	entries: TestRailPlanEntry[];
	url: string;
}

/**
 * TestRail API Response for Plan Entry
 */
export interface TestRailPlanEntry {
	id: string;
	suite_id: number;
	name: string;
	description?: string | null;
	include_all: boolean;
	runs: TestRailRun[];
	refs?: string;
}

/**
 * TestRail API Response for Milestone
 */
export interface TestRailMilestone {
	id: number;
	name: string;
	description?: string;
	due_on?: number;
	start_on?: number;
	started_on?: number;
	completed_on?: number | null;
	project_id: number;
	is_completed: boolean;
	is_started?: boolean;
	parent_id?: number | null;
	refs?: string;
	url: string;
}

/**
 * TestRail API Response for Suite
 */
export interface TestRailSuite {
	id: number;
	name: string;
	description?: string;
	project_id: number;
	is_baseline?: boolean;
	is_completed?: boolean;
	is_master?: boolean;
	completed_on?: number | null;
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

/**
 * TestRail API Response for Case Type
 */
export interface TestRailCaseType {
	id: number;
	name: string;
	is_default: boolean;
}

/**
 * TestRail API Response for Case Field
 */
export interface TestRailCaseField {
	id: number;
	type_id: number;
	name: string;
	system_name: string;
	label: string;
	description: string;
	configs: TestRailCaseFieldConfig[];
	display_order: number;
	include_all: boolean;
	template_ids: number[];
	is_active: boolean;
	status_id: number;
}

/**
 * TestRail API Response for Case Field Config
 */
export interface TestRailCaseFieldConfig {
	id: string;
	context: {
		is_global: boolean;
		project_ids: number[];
	};
	options: {
		default_value: string;
		format: string;
		is_required: boolean;
		rows: string;
		items: string;
	};
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

/**
 * TestRail API Response for Case History
 */
export interface TestRailCaseHistory {
	id: number;
	case_id: number;
	user_id: number;
	timestamp: number;
	changes: Array<{
		field: string;
		old_value: string | null;
		new_value: string | null;
	}>;
}

/**
 * TestRail API Response for Section
 */
export interface TestRailSection {
	id: number;
	name: string;
	description?: string | null;
	suite_id: number;
	parent_id?: number | null;
	depth: number;
	display_order: number;
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

	/**
	 * Update an existing test case
	 */
	async updateCase(
		caseId: number,
		data: Record<string, unknown>,
	): Promise<TestRailCase> {
		try {
			console.log(`Updating test case ${caseId}`);
			const response = await this.client.post<TestRailCase>(
				`/api/v2/update_case/${caseId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to update test case ${caseId}`, error);
			throw error;
		}
	}

	/**
	 * Delete an existing test case
	 */
	async deleteCase(caseId: number): Promise<void> {
		try {
			console.log(`Deleting test case ${caseId}`);
			await this.client.post(`/api/v2/delete_case/${caseId}`, {});
		} catch (error) {
			handleApiError(`Failed to delete test case ${caseId}`, error);
			throw error;
		}
	}

	/**
	 * Get test case history for a specific case
	 */
	async getCaseHistory(caseId: number): Promise<TestRailCaseHistory[]> {
		try {
			console.log(`Getting history for test case ${caseId}`);
			const response = await this.client.get<TestRailCaseHistory[]>(
				`/api/v2/get_history_for_case/${caseId}`,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to get history for test case ${caseId}`, error);
			throw error;
		}
	}

	/**
	 * Get a list of case types
	 */
	async getCaseTypes(): Promise<TestRailCaseType[]> {
		try {
			console.log("Getting test case types");
			const response = await this.client.get<TestRailCaseType[]>(
				"/api/v2/get_case_types",
			);
			return response.data;
		} catch (error) {
			handleApiError("Failed to get test case types", error);
			throw error;
		}
	}

	/**
	 * Get a list of case fields
	 */
	async getCaseFields(): Promise<TestRailCaseField[]> {
		try {
			console.log("Getting test case fields");
			const response = await this.client.get<TestRailCaseField[]>(
				"/api/v2/get_case_fields",
			);
			return response.data;
		} catch (error) {
			handleApiError("Failed to get test case fields", error);
			throw error;
		}
	}

	/**
	 * Copy test cases to a different section
	 */
	async copyCasesToSection(
		sectionId: number,
		caseIds: number[],
	): Promise<TestRailCase[]> {
		try {
			console.log(`Copying test cases to section ${sectionId}`);
			const response = await this.client.post<TestRailCase[]>(
				`/api/v2/copy_cases_to_section/${sectionId}`,
				{ case_ids: caseIds },
			);
			return response.data;
		} catch (error) {
			handleApiError(
				`Failed to copy test cases to section ${sectionId}`,
				error,
			);
			throw error;
		}
	}

	/**
	 * Move test cases to a different section
	 */
	async moveCasesToSection(
		sectionId: number,
		caseIds: number[],
	): Promise<void> {
		try {
			console.log(`Moving test cases to section ${sectionId}`);
			await this.client.post(`/api/v2/move_cases_to_section/${sectionId}`, {
				case_ids: caseIds,
			});
		} catch (error) {
			handleApiError(
				`Failed to move test cases to section ${sectionId}`,
				error,
			);
			throw error;
		}
	}

	/**
	 * Update multiple test cases with the same values
	 */
	async updateCases(
		projectId: number,
		suiteId: number | null,
		data: Record<string, unknown>,
		caseIds?: number[],
	): Promise<void> {
		try {
			console.log(`Updating multiple test cases in project ${projectId}`);
			const url = suiteId
				? `/api/v2/update_cases/${projectId}&suite_id=${suiteId}`
				: `/api/v2/update_cases/${projectId}`;

			const payload = caseIds ? { ...data, case_ids: caseIds } : data;

			await this.client.post(url, payload);
		} catch (error) {
			handleApiError(
				`Failed to update test cases in project ${projectId}`,
				error,
			);
			throw error;
		}
	}

	/**
	 * Delete multiple test cases
	 */
	async deleteCases(
		projectId: number,
		suiteId: number | null,
		caseIds: number[],
	): Promise<void> {
		try {
			console.log(`Deleting multiple test cases in project ${projectId}`);
			const url = suiteId
				? `/api/v2/delete_cases/${projectId}&suite_id=${suiteId}`
				: `/api/v2/delete_cases/${projectId}`;

			await this.client.post(url, { case_ids: caseIds });
		} catch (error) {
			handleApiError(
				`Failed to delete test cases in project ${projectId}`,
				error,
			);
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
			// For debugging
			console.error(
				"TestRail API getProjects raw response:",
				JSON.stringify(response.data),
			);
			return response.data;
		} catch (error) {
			handleApiError("Failed to get projects", error);
			throw error;
		}
	}

	/**
	 * Create a new project
	 */
	async addProject(data: {
		name: string;
		announcement?: string;
		show_announcement?: boolean;
		suite_mode?: number;
	}): Promise<TestRailProject> {
		try {
			const response = await this.client.post<TestRailProject>(
				"/api/v2/add_project",
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError("Failed to create project", error);
			throw error;
		}
	}

	/**
	 * Update an existing project
	 */
	async updateProject(
		projectId: number,
		data: {
			name?: string;
			announcement?: string;
			show_announcement?: boolean;
			is_completed?: boolean;
		},
	): Promise<TestRailProject> {
		try {
			const response = await this.client.post<TestRailProject>(
				`/api/v2/update_project/${projectId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to update project ${projectId}`, error);
			throw error;
		}
	}

	/**
	 * Delete an existing project
	 */
	async deleteProject(projectId: number): Promise<void> {
		try {
			await this.client.post(`/api/v2/delete_project/${projectId}`, {});
		} catch (error) {
			handleApiError(`Failed to delete project ${projectId}`, error);
			throw error;
		}
	}

	// Milestone API

	/**
	 * Get a specific milestone
	 */
	async getMilestone(milestoneId: number): Promise<TestRailMilestone> {
		try {
			console.log(`Getting milestone ${milestoneId}`);
			const response = await this.client.get<TestRailMilestone>(
				`/api/v2/get_milestone/${milestoneId}`,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to get milestone ${milestoneId}`, error);
			throw error;
		}
	}

	/**
	 * Get all milestones for a project
	 */
	async getMilestones(
		projectId: number,
		params?: Record<string, string | number | boolean | null | undefined>,
	): Promise<TestRailMilestone[]> {
		try {
			console.log(`Getting milestones for project ${projectId}`);
			const response = await this.client.get<TestRailMilestone[]>(
				`/api/v2/get_milestones/${projectId}`,
				{ params },
			);
			return response.data;
		} catch (error) {
			handleApiError(
				`Failed to get milestones for project ${projectId}`,
				error,
			);
			throw error;
		}
	}

	/**
	 * Add a new milestone to a project
	 */
	async addMilestone(
		projectId: number,
		data: {
			name: string;
			description?: string;
			due_on?: number;
			start_on?: number;
			parent_id?: number;
			refs?: string;
		},
	): Promise<TestRailMilestone> {
		try {
			console.log(`Adding milestone to project ${projectId}`);
			const response = await this.client.post<TestRailMilestone>(
				`/api/v2/add_milestone/${projectId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to add milestone to project ${projectId}`, error);
			throw error;
		}
	}

	/**
	 * Update an existing milestone
	 */
	async updateMilestone(
		milestoneId: number,
		data: {
			name?: string;
			description?: string;
			due_on?: number;
			start_on?: number;
			is_completed?: boolean;
			is_started?: boolean;
			parent_id?: number;
			refs?: string;
		},
	): Promise<TestRailMilestone> {
		try {
			console.log(`Updating milestone ${milestoneId}`);
			const response = await this.client.post<TestRailMilestone>(
				`/api/v2/update_milestone/${milestoneId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to update milestone ${milestoneId}`, error);
			throw error;
		}
	}

	/**
	 * Delete an existing milestone
	 */
	async deleteMilestone(milestoneId: number): Promise<void> {
		try {
			console.log(`Deleting milestone ${milestoneId}`);
			await this.client.post(`/api/v2/delete_milestone/${milestoneId}`, {});
		} catch (error) {
			handleApiError(`Failed to delete milestone ${milestoneId}`, error);
			throw error;
		}
	}

	// Suite API

	/**
	 * Get a specific test suite
	 */
	async getSuite(suiteId: number): Promise<TestRailSuite> {
		try {
			console.log(`Getting test suite ${suiteId}`);
			const response = await this.client.get<TestRailSuite>(
				`/api/v2/get_suite/${suiteId}`,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to get test suite ${suiteId}`, error);
			throw error;
		}
	}

	/**
	 * Get all test suites for a project
	 */
	async getSuites(projectId: number): Promise<TestRailSuite[]> {
		try {
			console.log(`Getting test suites for project ${projectId}`);
			const response = await this.client.get<TestRailSuite[]>(
				`/api/v2/get_suites/${projectId}`,
			);
			return response.data;
		} catch (error) {
			handleApiError(
				`Failed to get test suites for project ${projectId}`,
				error,
			);
			throw error;
		}
	}

	/**
	 * Add a new test suite to a project
	 */
	async addSuite(
		projectId: number,
		data: {
			name: string;
			description?: string;
		},
	): Promise<TestRailSuite> {
		try {
			console.log(`Adding test suite to project ${projectId}`);
			const response = await this.client.post<TestRailSuite>(
				`/api/v2/add_suite/${projectId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to add test suite to project ${projectId}`, error);
			throw error;
		}
	}

	/**
	 * Update an existing test suite
	 */
	async updateSuite(
		suiteId: number,
		data: {
			name?: string;
			description?: string;
		},
	): Promise<TestRailSuite> {
		try {
			console.log(`Updating test suite ${suiteId}`);
			const response = await this.client.post<TestRailSuite>(
				`/api/v2/update_suite/${suiteId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to update test suite ${suiteId}`, error);
			throw error;
		}
	}

	/**
	 * Delete an existing test suite
	 */
	async deleteSuite(suiteId: number): Promise<void> {
		try {
			console.log(`Deleting test suite ${suiteId}`);
			await this.client.post(`/api/v2/delete_suite/${suiteId}`, {});
		} catch (error) {
			handleApiError(`Failed to delete test suite ${suiteId}`, error);
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

	// Plans API

	/**
	 * Get a specific test plan
	 */
	async getPlan(planId: number): Promise<TestRailPlan> {
		try {
			console.log(`Getting test plan ${planId}`);
			const response = await this.client.get<TestRailPlan>(
				`/api/v2/get_plan/${planId}`,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to get test plan ${planId}`, error);
			throw error;
		}
	}

	/**
	 * Get all test plans for a project
	 */
	async getPlans(
		projectId: number,
		params?: Record<string, string | number | boolean | null | undefined>,
	): Promise<TestRailPlan[]> {
		try {
			console.log(`Getting test plans for project ${projectId}`);
			const response = await this.client.get<TestRailPlan[]>(
				`/api/v2/get_plans/${projectId}`,
				{ params },
			);
			return response.data;
		} catch (error) {
			handleApiError(
				`Failed to get test plans for project ${projectId}`,
				error,
			);
			throw error;
		}
	}

	/**
	 * Add a new test plan to a project
	 */
	async addPlan(
		projectId: number,
		data: {
			name: string;
			description?: string;
			milestone_id?: number;
			entries?: Array<{
				suite_id: number;
				name?: string;
				description?: string;
				include_all?: boolean;
				case_ids?: number[];
				config_ids?: number[];
				refs?: string;
			}>;
		},
	): Promise<TestRailPlan> {
		try {
			console.log(`Adding test plan to project ${projectId}`);
			const response = await this.client.post<TestRailPlan>(
				`/api/v2/add_plan/${projectId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to add test plan to project ${projectId}`, error);
			throw error;
		}
	}

	/**
	 * Add an entry to an existing test plan
	 */
	async addPlanEntry(
		planId: number,
		data: {
			suite_id: number;
			name?: string;
			description?: string;
			include_all?: boolean;
			case_ids?: number[];
			config_ids?: number[];
			refs?: string;
		},
	): Promise<TestRailPlanEntry> {
		try {
			console.log(`Adding entry to test plan ${planId}`);
			const response = await this.client.post<TestRailPlanEntry>(
				`/api/v2/add_plan_entry/${planId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to add entry to test plan ${planId}`, error);
			throw error;
		}
	}

	/**
	 * Update an existing test plan
	 */
	async updatePlan(
		planId: number,
		data: {
			name?: string;
			description?: string;
			milestone_id?: number;
		},
	): Promise<TestRailPlan> {
		try {
			console.log(`Updating test plan ${planId}`);
			const response = await this.client.post<TestRailPlan>(
				`/api/v2/update_plan/${planId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to update test plan ${planId}`, error);
			throw error;
		}
	}

	/**
	 * Update an existing test plan entry
	 */
	async updatePlanEntry(
		planId: number,
		entryId: string,
		data: {
			name?: string;
			description?: string;
			include_all?: boolean;
			case_ids?: number[];
		},
	): Promise<TestRailPlanEntry> {
		try {
			console.log(`Updating entry ${entryId} in test plan ${planId}`);
			const response = await this.client.post<TestRailPlanEntry>(
				`/api/v2/update_plan_entry/${planId}/${entryId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to update entry in test plan ${planId}`, error);
			throw error;
		}
	}

	/**
	 * Close an existing test plan
	 */
	async closePlan(planId: number): Promise<TestRailPlan> {
		try {
			console.log(`Closing test plan ${planId}`);
			const response = await this.client.post<TestRailPlan>(
				`/api/v2/close_plan/${planId}`,
				{},
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to close test plan ${planId}`, error);
			throw error;
		}
	}

	/**
	 * Delete an existing test plan
	 */
	async deletePlan(planId: number): Promise<void> {
		try {
			console.log(`Deleting test plan ${planId}`);
			await this.client.post(`/api/v2/delete_plan/${planId}`, {});
		} catch (error) {
			handleApiError(`Failed to delete test plan ${planId}`, error);
			throw error;
		}
	}

	/**
	 * Delete an entry from an existing test plan
	 */
	async deletePlanEntry(planId: number, entryId: string): Promise<void> {
		try {
			console.log(`Deleting entry ${entryId} from test plan ${planId}`);
			await this.client.post(
				`/api/v2/delete_plan_entry/${planId}/${entryId}`,
				{},
			);
		} catch (error) {
			handleApiError(`Failed to delete entry from test plan ${planId}`, error);
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

	// Sections API

	/**
	 * Get a specific section
	 */
	async getSection(sectionId: number): Promise<TestRailSection> {
		try {
			console.log(`Getting section ${sectionId}`);
			const response = await this.client.get<TestRailSection>(
				`/api/v2/get_section/${sectionId}`,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to get section ${sectionId}`, error);
			throw error;
		}
	}

	/**
	 * Get all sections for a project
	 */
	async getSections(
		projectId: number,
		suiteId?: number,
		params?: Record<string, string | number | boolean | null | undefined>,
	): Promise<TestRailSection[]> {
		try {
			console.log(`Getting sections for project ${projectId}`);
			const url = `/api/v2/get_sections/${projectId}`;
			const queryParams = suiteId ? { ...params, suite_id: suiteId } : params;

			const response = await this.client.get<TestRailSection[]>(url, {
				params: queryParams,
			});
			return response.data;
		} catch (error) {
			handleApiError(`Failed to get sections for project ${projectId}`, error);
			throw error;
		}
	}

	/**
	 * Add a new section
	 */
	async addSection(
		projectId: number,
		data: {
			name: string;
			description?: string;
			suite_id?: number;
			parent_id?: number;
		},
	): Promise<TestRailSection> {
		try {
			console.log(`Adding section to project ${projectId}`);
			const response = await this.client.post<TestRailSection>(
				`/api/v2/add_section/${projectId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to add section to project ${projectId}`, error);
			throw error;
		}
	}

	/**
	 * Move a section to a different parent or position
	 */
	async moveSection(
		sectionId: number,
		data: {
			parent_id?: number | null;
			after_id?: number | null;
		},
	): Promise<TestRailSection> {
		try {
			console.log(`Moving section ${sectionId}`);
			const response = await this.client.post<TestRailSection>(
				`/api/v2/move_section/${sectionId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to move section ${sectionId}`, error);
			throw error;
		}
	}

	/**
	 * Update an existing section
	 */
	async updateSection(
		sectionId: number,
		data: {
			name?: string;
			description?: string;
		},
	): Promise<TestRailSection> {
		try {
			console.log(`Updating section ${sectionId}`);
			const response = await this.client.post<TestRailSection>(
				`/api/v2/update_section/${sectionId}`,
				data,
			);
			return response.data;
		} catch (error) {
			handleApiError(`Failed to update section ${sectionId}`, error);
			throw error;
		}
	}

	/**
	 * Delete an existing section
	 */
	async deleteSection(sectionId: number, soft?: boolean): Promise<void> {
		try {
			console.log(`Deleting section ${sectionId}`);
			const url = soft
				? `/api/v2/delete_section/${sectionId}?soft=1`
				: `/api/v2/delete_section/${sectionId}`;

			await this.client.post(url, {});
		} catch (error) {
			handleApiError(`Failed to delete section ${sectionId}`, error);
			throw error;
		}
	}
}
