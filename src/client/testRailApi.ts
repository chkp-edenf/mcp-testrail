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

	updateProject(projectId: number, data: {
		name?: string;
		announcement?: string;
		show_announcement?: boolean;
		is_completed?: boolean;
	}) {
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

	addSection(projectId: number, data: {
		name: string;
		description?: string;
		suite_id?: number;
		parent_id?: number;
	}) {
		return this.sections.addSection(projectId, data);
	}

	moveSection(sectionId: number, data: {
		parent_id?: number | null;
		after_id?: number | null;
	}) {
		return this.sections.moveSection(sectionId, data);
	}

	updateSection(sectionId: number, data: {
		name?: string;
		description?: string;
	}) {
		return this.sections.updateSection(sectionId, data);
	}

	deleteSection(sectionId: number, soft?: boolean) {
		return this.sections.deleteSection(sectionId, soft);
	}

	// Shared Steps API
	getSharedStep(sharedStepId: number) {
		return this.sharedSteps.getSharedStep(sharedStepId);
	}

	getSharedSteps(projectId: number, filters?: Record<string, string | number | boolean | null | undefined>) {
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

	getCases(projectId: number, filters?: Record<string, string | number | boolean | null | undefined>) {
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

	getMilestones(projectId: number, filters?: Record<string, string | number | boolean | null | undefined>) {
		return this.milestones.getMilestones(projectId, filters);
	}

	addMilestone(projectId: number, data: Record<string, unknown>) {
		return this.milestones.addMilestone(projectId, data);
	}

	updateMilestone(milestoneId: number, data: Record<string, unknown>) {
		return this.milestones.updateMilestone(milestoneId, data);
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
		return this.suites.addSuite(projectId, data);
	}

	updateSuite(suiteId: number, data: Record<string, unknown>) {
		return this.suites.updateSuite(suiteId, data);
	}

	deleteSuite(suiteId: number) {
		return this.suites.deleteSuite(suiteId);
	}

	// Runs & Results API
	getRun(runId: number) {
		return this.runs.getRun(runId);
	}

	getRuns(projectId: number, filters?: Record<string, string | number | boolean | null | undefined>) {
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

	addResult(testId: number, data: Record<string, unknown>) {
		return this.runs.addResult(testId, data);
	}

	addResultForCase(runId: number, caseId: number, data: Record<string, unknown>) {
		return this.runs.addResultForCase(runId, caseId, data);
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

	getPlans(projectId: number, filters?: Record<string, string | number | boolean | null | undefined>) {
		return this.plans.getPlans(projectId, filters);
	}

	addPlan(projectId: number, data: Record<string, unknown>) {
		return this.plans.addPlan(projectId, data);
	}

	addPlanEntry(planId: number, data: Record<string, unknown>) {
		return this.plans.addPlanEntry(planId, data);
	}

	updatePlan(planId: number, data: Record<string, unknown>) {
		return this.plans.updatePlan(planId, data);
	}

	updatePlanEntry(planId: number, entryId: string, data: Record<string, unknown>) {
		return this.plans.updatePlanEntry(planId, entryId, data);
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
