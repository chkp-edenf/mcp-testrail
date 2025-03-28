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
export interface TestRailCase {
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

/**
 * TestRail API Response for Step
 */
export interface TestRailStep {
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

/**
 * TestRail API Response for Step Result
 */
export interface TestRailStepResult {
	status_id: number;
	content: string;
	expected: string;
	actual: string;
}

/**
 * TestRail API Response for User
 */
export interface TestRailUser {
	id: number;
	name: string;
	email: string;
	is_active: boolean;
	role_id: number;
}

/**
 * TestRail API Response for Test
 */
export interface TestRailTest {
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

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
	offset: number;
	limit: number;
	size: number;
	_links: {
		next?: string;
		prev?: string;
	};
	items: T[];
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

/**
 * TestRail API Response for Shared Step
 */
export interface TestRailSharedStep {
	id: number;
	title: string;
	project_id: number;
	created_by: number;
	created_on: number;
	updated_by: number;
	updated_on: number;
	custom_steps_separated: TestRailSharedStepItem[];
	case_ids: number[];
}

/**
 * TestRail Shared Step Item
 */
export interface TestRailSharedStepItem {
	content: string;
	additional_info?: string | null;
	expected?: string | null;
	refs?: string | null;
}
