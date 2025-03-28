import { BaseTestRailClient, TestRailClientConfig } from "./baseClient.js";
import { ProjectsClient } from "./projects.js";
import { SectionsClient } from "./sections.js";
import { SharedStepsClient } from "./sharedSteps.js";
import { CasesClient } from "./cases.js";
import { MilestonesClient } from "./milestones.js";
import { SuitesClient } from "./suites.js";
import { RunsClient } from "./runs.js";
import { UsersClient } from "./users.js";
import { PlansClient } from "./plans.js";

/**
 * Main TestRail API client that provides access to all resource-specific clients
 */
export class TestRailClient extends BaseTestRailClient {
	readonly projects: ProjectsClient;
	readonly sections: SectionsClient;
	readonly sharedSteps: SharedStepsClient;
	readonly cases: CasesClient;
	readonly milestones: MilestonesClient;
	readonly suites: SuitesClient;
	readonly runs: RunsClient;
	readonly users: UsersClient;
	readonly plans: PlansClient;

	constructor(config: TestRailClientConfig) {
		super(config);
		this.projects = new ProjectsClient(config);
		this.sections = new SectionsClient(config);
		this.sharedSteps = new SharedStepsClient(config);
		this.cases = new CasesClient(config);
		this.milestones = new MilestonesClient(config);
		this.suites = new SuitesClient(config);
		this.runs = new RunsClient(config);
		this.users = new UsersClient(config);
		this.plans = new PlansClient(config);
	}
}

// Export all clients and types
export { TestRailClientConfig };
export { ProjectsClient } from "./projects.js";
export { SectionsClient } from "./sections.js";
export { SharedStepsClient } from "./sharedSteps.js";
export { CasesClient } from "./cases.js";
export { MilestonesClient } from "./milestones.js";
export { SuitesClient } from "./suites.js";
export { RunsClient } from "./runs.js";
export { UsersClient } from "./users.js";
export { PlansClient } from "./plans.js";
export * from "./types.js";
