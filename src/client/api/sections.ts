import { BaseTestRailClient } from "./baseClient.js";
import { TestRailSection } from "./types.js";
import { handleApiError } from "./utils.js";

export class SectionsClient extends BaseTestRailClient {
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
			throw handleApiError(error, `Failed to get section ${sectionId}`);
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
			throw handleApiError(error, `Failed to get sections for project ${projectId}`);
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
			throw handleApiError(error, `Failed to add section to project ${projectId}`);
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
			throw handleApiError(error, `Failed to move section ${sectionId}`);
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
			throw handleApiError(error, `Failed to update section ${sectionId}`);
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
			throw handleApiError(error, `Failed to delete section ${sectionId}`);
		}
	}
}
