// This file is kept only for backward compatibility.
// For new code, use the individual resource files in the src/client/api folder.

import {
	TestRailClient as NewTestRailClient,
	TestRailClientConfig,
} from "./api/index.js";

// Legacy interface adapter for backward compatibility
export class TestRailClient extends NewTestRailClient {
	// Projects API
	getProject(projectId: number) {
		return this.projects.getProject(projectId);
	}

	getProjects(
		params?: Record<string, string | number | boolean | null | undefined>,
	) {
		return this.projects.getProjects(params);
	}

	addProject(data: {
		name: string;
		announcement?: string;
		show_announcement?: boolean;
		suite_mode?: number;
	}) {
		return this.projects.addProject(data);
	}

	updateProject(
		projectId: number,
		data: {
			name?: string;
			announcement?: string;
			show_announcement?: boolean;
			is_completed?: boolean;
		},
	) {
		return this.projects.updateProject(projectId, data);
	}

	deleteProject(projectId: number) {
		return this.projects.deleteProject(projectId);
	}

	// Sections API
	getSection(sectionId: number) {
		return this.sections.getSection(sectionId);
	}

	getSections(
		projectId: number,
		suiteId?: number,
		params?: Record<string, string | number | boolean | null | undefined>,
	) {
		return this.sections.getSections(projectId, suiteId, params);
	}

	addSection(
		projectId: number,
		data: {
			name: string;
			description?: string;
			suite_id?: number;
			parent_id?: number;
		},
	) {
		return this.sections.addSection(projectId, data);
	}

	moveSection(
		sectionId: number,
		data: {
			parent_id?: number | null;
			after_id?: number | null;
		},
	) {
		return this.sections.moveSection(sectionId, data);
	}

	updateSection(
		sectionId: number,
		data: {
			name?: string;
			description?: string;
		},
	) {
		return this.sections.updateSection(sectionId, data);
	}

	deleteSection(sectionId: number, soft?: boolean) {
		return this.sections.deleteSection(sectionId, soft);
	}

	// Shared Steps API
	getSharedStep(sharedStepId: number) {
		return this.sharedSteps.getSharedStep(sharedStepId);
	}

	getSharedSteps(
		projectId: number,
		filters?: Record<string, string | number | boolean | null | undefined>,
	) {
		return this.sharedSteps.getSharedSteps(projectId, filters);
	}

	addSharedStep(projectId: number, data: Record<string, unknown>) {
		return this.sharedSteps.addSharedStep(projectId, data);
	}

	updateSharedStep(sharedStepId: number, data: Record<string, unknown>) {
		return this.sharedSteps.updateSharedStep(sharedStepId, data);
	}

	deleteSharedStep(sharedStepId: number, keepInCases = true) {
		return this.sharedSteps.deleteSharedStep(sharedStepId, keepInCases);
	}

	// Cases API
	getCase(caseId: number) {
		return this.cases.getCase(caseId);
	}

	getCases(
		projectId: number,
		filters?: Record<string, string | number | boolean | null | undefined>,
	) {
		return this.cases.getCases(projectId, filters);
	}

	addCase(sectionId: number, data: Record<string, unknown>) {
		return this.cases.addCase(sectionId, data);
	}

	updateCase(caseId: number, data: Record<string, unknown>) {
		return this.cases.updateCase(caseId, data);
	}

	deleteCase(caseId: number) {
		return this.cases.deleteCase(caseId);
	}

	getCaseHistory(caseId: number) {
		return this.cases.getCaseHistory(caseId);
	}

	getCaseTypes() {
		return this.cases.getCaseTypes();
	}

	getCaseFields() {
		return this.cases.getCaseFields();
	}

	copyCasesToSection(sectionId: number, caseIds: number[]) {
		return this.cases.copyToSection(caseIds, sectionId);
	}

	moveCasesToSection(sectionId: number, caseIds: number[]) {
		return this.cases.moveToSection(caseIds, sectionId);
	}

	updateCases(
		projectId: number,
		suiteId: number | null,
		data: Record<string, unknown>,
		caseIds: number[],
	) {
		return this.cases.updateCases(projectId, suiteId, data, caseIds);
	}

	deleteCases(projectId: number, suiteId: number | null, caseIds: number[]) {
		return this.cases.deleteCases(projectId, suiteId, caseIds);
	}

	// Milestones API
	getMilestone(milestoneId: number) {
		return this.milestones.getMilestone(milestoneId);
	}

	getMilestones(
		projectId: number,
		filters?: Record<string, string | number | boolean | null | undefined>,
	) {
		return this.milestones.getMilestones(projectId, filters);
	}

	addMilestone(projectId: number, data: Record<string, unknown>) {
		// 必須項目nameが存在するか確認
		if (!data.name || typeof data.name !== "string") {
			throw new Error(
				"Milestone data must include a name property of type string",
			);
		}

		return this.milestones.addMilestone(projectId, {
			name: data.name as string,
			description: data.description as string | undefined,
			due_on: data.due_on as number | undefined,
			start_on: data.start_on as number | undefined,
			parent_id: data.parent_id as number | undefined,
			refs: data.refs as string | undefined,
			is_completed: data.is_completed as boolean | undefined,
			is_started: data.is_started as boolean | undefined,
		});
	}

	updateMilestone(milestoneId: number, data: Record<string, unknown>) {
		return this.milestones.updateMilestone(milestoneId, {
			name: data.name as string | undefined,
			description: data.description as string | undefined,
			due_on: data.due_on as number | undefined,
			start_on: data.start_on as number | undefined,
			parent_id: data.parent_id as number | undefined,
			refs: data.refs as string | undefined,
			is_completed: data.is_completed as boolean | undefined,
			is_started: data.is_started as boolean | undefined,
		});
	}

	deleteMilestone(milestoneId: number) {
		return this.milestones.deleteMilestone(milestoneId);
	}

	// Suites API
	getSuite(suiteId: number) {
		return this.suites.getSuite(suiteId);
	}

	getSuites(projectId: number) {
		return this.suites.getSuites(projectId);
	}

	addSuite(projectId: number, data: Record<string, unknown>) {
		// dataオブジェクトにnameプロパティが存在することを確認
		if (!data.name || typeof data.name !== "string") {
			throw new Error("Suite data must include a name property of type string");
		}

		return this.suites.addSuite(projectId, {
			name: data.name as string,
			description: data.description as string | undefined,
		});
	}

	updateSuite(suiteId: number, data: Record<string, unknown>) {
		return this.suites.updateSuite(suiteId, {
			name: data.name as string | undefined,
			description: data.description as string | undefined,
		});
	}

	deleteSuite(suiteId: number) {
		return this.suites.deleteSuite(suiteId);
	}

	// Runs & Results API
	getRun(runId: number) {
		return this.runs.getRun(runId);
	}

	getRuns(
		projectId: number,
		filters?: Record<string, string | number | boolean | null | undefined>,
	) {
		return this.runs.getRuns(projectId, filters);
	}

	addRun(projectId: number, data: Record<string, unknown>) {
		return this.runs.addRun(projectId, data);
	}

	updateRun(runId: number, data: Record<string, unknown>) {
		return this.runs.updateRun(runId, data);
	}

	closeRun(runId: number) {
		return this.runs.closeRun(runId);
	}

	deleteRun(runId: number) {
		return this.runs.deleteRun(runId);
	}

	// テスト結果の追加
	addResultForCase(
		runId: number,
		caseId: number,
		data: Record<string, unknown>,
	) {
		return this.results.addResultForCase(runId, caseId, data);
	}

	// Results API
	getResults(
		testId: number,
		params?: Record<string, string | number | boolean | null | undefined>,
	) {
		return this.results.getResults(testId, params);
	}

	getResultsForCase(
		runId: number,
		caseId: number,
		params?: Record<string, string | number | boolean | null | undefined>,
	) {
		return this.results.getResultsForCase(runId, caseId, params);
	}

	getResultsForRun(
		runId: number,
		params?: Record<string, string | number | boolean | null | undefined>,
	) {
		return this.results.getResultsForRun(runId, params);
	}

	// Users API
	getUser(userId: number) {
		return this.users.getUser(userId);
	}

	getUserByEmail(email: string) {
		return this.users.getUserByEmail(email);
	}

	getUsers() {
		return this.users.getUsers();
	}

	// Plans API
	getPlan(planId: number) {
		return this.plans.getPlan(planId);
	}

	getPlans(
		projectId: number,
		filters?: Record<string, string | number | boolean | null | undefined>,
	) {
		return this.plans.getPlans(projectId, filters);
	}

	addPlan(projectId: number, data: Record<string, unknown>) {
		// 必須項目nameが存在するか確認
		if (!data.name || typeof data.name !== "string") {
			throw new Error("Plan data must include a name property of type string");
		}

		const planData = {
			name: data.name as string,
			description: data.description as string | undefined,
			milestone_id: data.milestone_id as number | undefined,
			entries: Array.isArray(data.entries)
				? data.entries.map((entry) => ({
						suite_id: entry.suite_id as number,
						name: entry.name as string | undefined,
						description: entry.description as string | undefined,
						include_all: entry.include_all as boolean | undefined,
						case_ids: entry.case_ids as number[] | undefined,
						config_ids: entry.config_ids as number[] | undefined,
						refs: entry.refs as string | undefined,
					}))
				: undefined,
		};

		return this.plans.addPlan(projectId, planData);
	}

	addPlanEntry(planId: number, data: Record<string, unknown>) {
		// 必須項目suite_idが存在するか確認
		if (!data.suite_id || typeof data.suite_id !== "number") {
			throw new Error(
				"Plan entry data must include a suite_id property of type number",
			);
		}

		const entryData = {
			suite_id: data.suite_id as number,
			name: data.name as string | undefined,
			description: data.description as string | undefined,
			include_all: data.include_all as boolean | undefined,
			case_ids: data.case_ids as number[] | undefined,
			config_ids: data.config_ids as number[] | undefined,
			refs: data.refs as string | undefined,
		};

		return this.plans.addPlanEntry(planId, entryData);
	}

	updatePlan(planId: number, data: Record<string, unknown>) {
		const planData = {
			name: data.name as string | undefined,
			description: data.description as string | undefined,
			milestone_id: data.milestone_id as number | undefined,
		};

		return this.plans.updatePlan(planId, planData);
	}

	updatePlanEntry(
		planId: number,
		entryId: string,
		data: Record<string, unknown>,
	) {
		const entryData = {
			name: data.name as string | undefined,
			description: data.description as string | undefined,
			include_all: data.include_all as boolean | undefined,
			case_ids: data.case_ids as number[] | undefined,
			config_ids: data.config_ids as number[] | undefined,
			refs: data.refs as string | undefined,
		};

		return this.plans.updatePlanEntry(planId, entryId, entryData);
	}

	closePlan(planId: number) {
		return this.plans.closePlan(planId);
	}

	deletePlan(planId: number) {
		return this.plans.deletePlan(planId);
	}

	deletePlanEntry(planId: number, entryId: string) {
		return this.plans.deletePlanEntry(planId, entryId);
	}
}

export { TestRailClientConfig };
export * from "./api/types.js";

// Adapter code to integrate legacy interfaces with new interfaces could be added in the future.
