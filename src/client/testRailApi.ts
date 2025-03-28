import {
	HttpClient,
	HttpClientConfig,
	RequestData,
	RequestParams,
} from "./api";
import FormData from "form-data";
import * as fs from "node:fs";
import * as path from "node:path";

// Response type definitions for TestRail API
interface TestRailAttachment {
	attachment_id: number;
	name: string;
	filename: string;
	size: number;
	created_on: number;
	created_by: number;
	project_id: number;
	case_id?: number;
	result_id?: number;
}

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

interface TestRailCaseField {
	id: number;
	type_id: number;
	name: string;
	label: string;
	description: string;
	system_name?: string;
	configs: TestRailCaseFieldConfig[];
	display_order: number;
	include_all: boolean;
	template_ids: number[];
}

interface TestRailCaseFieldConfig {
	id: string;
	context: {
		is_global: boolean;
		project_ids: number[];
	};
	options: {
		default_value?: string | boolean | null;
		format?: string;
		is_required?: boolean;
		rows?: string;
		items?: string;
	};
}

interface TestRailMilestone {
	id: number;
	name: string;
	description: string;
	start_on: number;
	started_on: number;
	due_on: number;
	completed_on: number;
	project_id: number;
	parent_id: number;
	refs: string;
	url: string;
	is_completed: boolean;
	is_started: boolean;
}

interface TestRailProject {
	id: number;
	name: string;
	announcement: string;
	show_announcement: boolean;
	is_completed: boolean;
	completed_on: number;
	suite_mode: number;
	url: string;
}

interface TestRailResult {
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
}

interface TestRailStepResult {
	status_id: number;
	content: string;
	expected: string;
	actual: string;
}

interface TestRailResultField {
	id: number;
	type_id: number;
	name: string;
	label: string;
	description: string;
	system_name?: string;
	configs: TestRailResultFieldConfig[];
	display_order: number;
	include_all: boolean;
	template_ids: number[];
}

interface TestRailResultFieldConfig {
	id: string;
	context: {
		is_global: boolean;
		project_ids: number[];
	};
	options: {
		default_value?: string | boolean | null;
		format?: string;
		is_required?: boolean;
		rows?: string;
		items?: string;
	};
}

interface TestRailRun {
	id: number;
	suite_id: number;
	name: string;
	description: string;
	milestone_id: number;
	assignedto_id: number;
	include_all: boolean;
	is_completed: boolean;
	completed_on: number;
	config: string;
	config_ids: number[];
	created_by: number;
	created_on: number;
	plan_id: number;
	url: string;
	refs: string;
}

interface TestRailSharedStep {
	id: number;
	title: string;
	created_by: number;
	created_on: number;
	updated_by: number;
	updated_on: number;
	steps: TestRailStep[];
	refs: string;
	project_id: number;
}

interface TestRailStatus {
	id: number;
	name: string;
	label: string;
	color_dark: string;
	color_medium: string;
	color_bright: string;
	is_system: boolean;
	is_untested: boolean;
	is_final: boolean;
}

interface TestRailSuite {
	id: number;
	name: string;
	description: string;
	project_id: number;
	is_master: boolean;
	is_baseline: boolean;
	is_completed: boolean;
	completed_on: number;
	url: string;
}

interface TestRailUser {
	id: number;
	name: string;
	email: string;
	is_active: boolean;
	role_id: number;
}

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
export interface TestRailClientConfig extends HttpClientConfig {
	auth: {
		username: string;
		password: string;
	};
}

export class TestRailClient {
	private client: HttpClient;

	constructor(config: TestRailClientConfig) {
		this.client = new HttpClient(config);
	}

	// Attachments API

	async addAttachmentToCase(
		caseId: number,
		filePath: string,
	): Promise<{ attachment_id: number }> {
		const formData = new FormData();
		formData.append(
			"attachment",
			fs.createReadStream(filePath),
			path.basename(filePath),
		);

		// Set Content-Type header for multipart/form-data
		this.client.setHeader("Content-Type", "multipart/form-data");

		// Use direct axios for form-data requests
		const response = await this.client
			.getAxiosInstance()
			.post<{ attachment_id: number }>(
				`/api/v2/add_attachment_to_case/${caseId}`,
				formData,
			);

		return response.data;
	}

	async addAttachmentToPlan(
		planId: number,
		filePath: string,
	): Promise<{ attachment_id: number }> {
		const formData = new FormData();
		formData.append(
			"attachment",
			fs.createReadStream(filePath),
			path.basename(filePath),
		);

		// Set Content-Type header for multipart/form-data
		this.client.setHeader("Content-Type", "multipart/form-data");

		// Use direct axios for form-data requests
		const response = await this.client
			.getAxiosInstance()
			.post<{ attachment_id: number }>(
				`/api/v2/add_attachment_to_plan/${planId}`,
				formData,
			);

		return response.data;
	}

	async addAttachmentToPlanEntry(
		planId: number,
		entryId: number,
		filePath: string,
	): Promise<{ attachment_id: number }> {
		const formData = new FormData();
		formData.append(
			"attachment",
			fs.createReadStream(filePath),
			path.basename(filePath),
		);

		// Set Content-Type header for multipart/form-data
		this.client.setHeader("Content-Type", "multipart/form-data");

		// Use direct axios for form-data requests
		const response = await this.client
			.getAxiosInstance()
			.post<{ attachment_id: number }>(
				`/api/v2/add_attachment_to_plan_entry/${planId}/${entryId}`,
				formData,
			);

		return response.data;
	}

	async addAttachmentToResult(
		resultId: number,
		filePath: string,
	): Promise<{ attachment_id: number }> {
		const formData = new FormData();
		formData.append(
			"attachment",
			fs.createReadStream(filePath),
			path.basename(filePath),
		);

		// Set Content-Type header for multipart/form-data
		this.client.setHeader("Content-Type", "multipart/form-data");

		// Use direct axios for form-data requests
		const response = await this.client
			.getAxiosInstance()
			.post<{ attachment_id: number }>(
				`/api/v2/add_attachment_to_result/${resultId}`,
				formData,
			);

		return response.data;
	}

	async addAttachmentToRun(
		runId: number,
		filePath: string,
	): Promise<{ attachment_id: number }> {
		const formData = new FormData();
		formData.append(
			"attachment",
			fs.createReadStream(filePath),
			path.basename(filePath),
		);

		// Set Content-Type header for multipart/form-data
		this.client.setHeader("Content-Type", "multipart/form-data");

		// Use direct axios for form-data requests
		const response = await this.client
			.getAxiosInstance()
			.post<{ attachment_id: number }>(
				`/api/v2/add_attachment_to_run/${runId}`,
				formData,
			);

		return response.data;
	}

	async getAttachmentsForCase(
		caseId: number,
		params?: { limit?: number; offset?: number },
	): Promise<TestRailAttachment[] | PaginatedResponse<TestRailAttachment>> {
		return this.client.get<
			TestRailAttachment[] | PaginatedResponse<TestRailAttachment>
		>(`/api/v2/get_attachments_for_case/${caseId}`, params);
	}

	async getAttachmentsForPlan(
		planId: number,
		params?: { limit?: number; offset?: number },
	): Promise<TestRailAttachment[] | PaginatedResponse<TestRailAttachment>> {
		return this.client.get<
			TestRailAttachment[] | PaginatedResponse<TestRailAttachment>
		>(`/api/v2/get_attachments_for_plan/${planId}`, params);
	}

	async getAttachmentsForPlanEntry(
		planId: number,
		entryId: number,
		params?: { limit?: number; offset?: number },
	): Promise<TestRailAttachment[] | PaginatedResponse<TestRailAttachment>> {
		return this.client.get<
			TestRailAttachment[] | PaginatedResponse<TestRailAttachment>
		>(`/api/v2/get_attachments_for_plan_entry/${planId}/${entryId}`, params);
	}

	async getAttachmentsForRun(
		runId: number,
		params?: { limit?: number; offset?: number },
	): Promise<TestRailAttachment[] | PaginatedResponse<TestRailAttachment>> {
		return this.client.get<
			TestRailAttachment[] | PaginatedResponse<TestRailAttachment>
		>(`/api/v2/get_attachments_for_run/${runId}`, params);
	}

	async getAttachmentsForTest(testId: number): Promise<TestRailAttachment[]> {
		return this.client.get<TestRailAttachment[]>(
			`/api/v2/get_attachments_for_test/${testId}`,
		);
	}

	async getAttachment(attachmentId: number): Promise<Blob> {
		return this.client.get<Blob>(`/api/v2/get_attachment/${attachmentId}`);
	}

	async deleteAttachment(attachmentId: number): Promise<void> {
		return this.client.post<void>(`/api/v2/delete_attachment/${attachmentId}`);
	}

	// Test Cases API

	async getCase(caseId: number): Promise<TestRailCase> {
		return this.client.get<TestRailCase>(`/api/v2/get_case/${caseId}`);
	}

	async getCases(
		projectId: number,
		params?: RequestParams,
	): Promise<TestRailCase[]> {
		return this.client.get<TestRailCase[]>(
			`/api/v2/get_cases/${projectId}`,
			params,
		);
	}

	async addCase(sectionId: number, data: RequestData): Promise<TestRailCase> {
		return this.client.post<TestRailCase>(
			`/api/v2/add_case/${sectionId}`,
			data,
		);
	}

	async updateCase(caseId: number, data: RequestData): Promise<TestRailCase> {
		return this.client.post<TestRailCase>(
			`/api/v2/update_case/${caseId}`,
			data,
		);
	}

	async deleteCase(caseId: number): Promise<void> {
		return this.client.post<void>(`/api/v2/delete_case/${caseId}`);
	}

	// Case Fields API

	async getCaseFields(): Promise<TestRailCaseField[]> {
		return this.client.get<TestRailCaseField[]>("/api/v2/get_case_fields");
	}

	async addCaseField(data: RequestData): Promise<TestRailCaseField> {
		return this.client.post<TestRailCaseField>("/api/v2/add_case_field", data);
	}

	// Milestones API

	async getMilestone(milestoneId: number): Promise<TestRailMilestone> {
		return this.client.get<TestRailMilestone>(
			`/api/v2/get_milestone/${milestoneId}`,
		);
	}

	async getMilestones(
		projectId: number,
		params?: RequestParams,
	): Promise<TestRailMilestone[]> {
		return this.client.get<TestRailMilestone[]>(
			`/api/v2/get_milestones/${projectId}`,
			params,
		);
	}

	async addMilestone(
		projectId: number,
		data: RequestData,
	): Promise<TestRailMilestone> {
		return this.client.post<TestRailMilestone>(
			`/api/v2/add_milestone/${projectId}`,
			data,
		);
	}

	async updateMilestone(
		milestoneId: number,
		data: RequestData,
	): Promise<TestRailMilestone> {
		return this.client.post<TestRailMilestone>(
			`/api/v2/update_milestone/${milestoneId}`,
			data,
		);
	}

	async deleteMilestone(milestoneId: number): Promise<void> {
		return this.client.post<void>(`/api/v2/delete_milestone/${milestoneId}`);
	}

	// Projects API

	async getProject(projectId: number): Promise<TestRailProject> {
		return this.client.get<TestRailProject>(`/api/v2/get_project/${projectId}`);
	}

	async getProjects(params?: RequestParams): Promise<TestRailProject[]> {
		return this.client.get<TestRailProject[]>("/api/v2/get_projects", params);
	}

	async addProject(data: RequestData): Promise<TestRailProject> {
		return this.client.post<TestRailProject>("/api/v2/add_project", data);
	}

	async updateProject(
		projectId: number,
		data: RequestData,
	): Promise<TestRailProject> {
		return this.client.post<TestRailProject>(
			`/api/v2/update_project/${projectId}`,
			data,
		);
	}

	async deleteProject(projectId: number): Promise<void> {
		return this.client.post<void>(`/api/v2/delete_project/${projectId}`);
	}

	// Results API

	async getResults(
		testId: number,
		params?: RequestParams,
	): Promise<TestRailResult[]> {
		return this.client.get<TestRailResult[]>(
			`/api/v2/get_results/${testId}`,
			params,
		);
	}

	async getResultsForCase(
		runId: number,
		caseId: number,
		params?: RequestParams,
	): Promise<TestRailResult[]> {
		return this.client.get<TestRailResult[]>(
			`/api/v2/get_results_for_case/${runId}/${caseId}`,
			params,
		);
	}

	async getResultsForRun(
		runId: number,
		params?: RequestParams,
	): Promise<TestRailResult[] | PaginatedResponse<TestRailResult>> {
		return this.client.get<
			TestRailResult[] | PaginatedResponse<TestRailResult>
		>(`/api/v2/get_results_for_run/${runId}`, params);
	}

	async addResult(testId: number, data: RequestData): Promise<TestRailResult> {
		return this.client.post<TestRailResult>(
			`/api/v2/add_result/${testId}`,
			data,
		);
	}

	async addResultForCase(
		runId: number,
		caseId: number,
		data: RequestData,
	): Promise<TestRailResult> {
		return this.client.post<TestRailResult>(
			`/api/v2/add_result_for_case/${runId}/${caseId}`,
			data,
		);
	}

	async addResults(
		runId: number,
		data: RequestData,
	): Promise<{ results: TestRailResult[] }> {
		return this.client.post<{ results: TestRailResult[] }>(
			`/api/v2/add_results/${runId}`,
			data,
		);
	}

	async addResultsForCases(
		runId: number,
		data: RequestData,
	): Promise<{ results: TestRailResult[] }> {
		return this.client.post<{ results: TestRailResult[] }>(
			`/api/v2/add_results_for_cases/${runId}`,
			data,
		);
	}

	// Result Fields API

	async getResultFields(): Promise<TestRailResultField[]> {
		return this.client.get<TestRailResultField[]>("/api/v2/get_result_fields");
	}

	// Runs API

	async getRun(runId: number): Promise<TestRailRun> {
		return this.client.get<TestRailRun>(`/api/v2/get_run/${runId}`);
	}

	async getRuns(
		projectId: number,
		params?: RequestParams,
	): Promise<TestRailRun[] | PaginatedResponse<TestRailRun>> {
		return this.client.get<TestRailRun[] | PaginatedResponse<TestRailRun>>(
			`/api/v2/get_runs/${projectId}`,
			params,
		);
	}

	async addRun(projectId: number, data: RequestData): Promise<TestRailRun> {
		return this.client.post<TestRailRun>(`/api/v2/add_run/${projectId}`, data);
	}

	async updateRun(runId: number, data: RequestData): Promise<TestRailRun> {
		return this.client.post<TestRailRun>(`/api/v2/update_run/${runId}`, data);
	}

	async closeRun(runId: number): Promise<TestRailRun> {
		return this.client.post<TestRailRun>(`/api/v2/close_run/${runId}`);
	}

	async deleteRun(runId: number): Promise<void> {
		return this.client.post<void>(`/api/v2/delete_run/${runId}`);
	}

	// Shared Steps API

	async getSharedStep(stepId: number): Promise<TestRailSharedStep> {
		return this.client.get<TestRailSharedStep>(
			`/api/v2/get_shared_step/${stepId}`,
		);
	}

	async getSharedSteps(
		projectId: number,
		params?: RequestParams,
	): Promise<TestRailSharedStep[]> {
		return this.client.get<TestRailSharedStep[]>(
			`/api/v2/get_shared_steps/${projectId}`,
			params,
		);
	}

	// Statuses API

	async getStatuses(): Promise<TestRailStatus[]> {
		return this.client.get<TestRailStatus[]>("/api/v2/get_statuses");
	}

	// Suites API

	async getSuite(suiteId: number): Promise<TestRailSuite> {
		return this.client.get<TestRailSuite>(`/api/v2/get_suite/${suiteId}`);
	}

	async getSuites(projectId: number): Promise<TestRailSuite[]> {
		return this.client.get<TestRailSuite[]>(`/api/v2/get_suites/${projectId}`);
	}

	async addSuite(projectId: number, data: RequestData): Promise<TestRailSuite> {
		return this.client.post<TestRailSuite>(
			`/api/v2/add_suite/${projectId}`,
			data,
		);
	}

	async updateSuite(
		suiteId: number,
		data: RequestData,
	): Promise<TestRailSuite> {
		return this.client.post<TestRailSuite>(
			`/api/v2/update_suite/${suiteId}`,
			data,
		);
	}

	async deleteSuite(suiteId: number): Promise<void> {
		return this.client.post<void>(`/api/v2/delete_suite/${suiteId}`);
	}

	// Users API

	async getUser(userId: number): Promise<TestRailUser> {
		return this.client.get<TestRailUser>(`/api/v2/get_user/${userId}`);
	}

	async getUserByEmail(email: string): Promise<TestRailUser> {
		return this.client.get<TestRailUser>(
			`/api/v2/get_user_by_email&email=${encodeURIComponent(email)}`,
		);
	}

	async getUsers(): Promise<TestRailUser[]> {
		return this.client.get<TestRailUser[]>("/api/v2/get_users");
	}

	// Tests API

	async getTest(testId: number): Promise<TestRailTest> {
		return this.client.get<TestRailTest>(`/api/v2/get_test/${testId}`);
	}

	async getTests(
		runId: number,
		params?: RequestParams,
	): Promise<TestRailTest[] | PaginatedResponse<TestRailTest>> {
		return this.client.get<TestRailTest[] | PaginatedResponse<TestRailTest>>(
			`/api/v2/get_tests/${runId}`,
			params,
		);
	}
}
