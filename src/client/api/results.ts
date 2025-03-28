// テスト結果に関するAPIクライアントの実装
import { AxiosResponse } from "axios";
import { BaseTestRailClient } from "./baseClient.js";
import { TestRailResult } from "./types.js";
import { handleApiError } from "./utils.js";
import {
	GetResultsInputType,
	GetResultsForCaseInputType,
	GetResultsForRunInputType,
	AddResultInputType,
	AddResultForCaseInputType,
	AddResultsInputType,
	AddResultsForCasesInputType,
} from "../../shared/schemas/results.js";

export class ResultsClient extends BaseTestRailClient {
	/**
	 * 1つのテストに対する結果のリストを返します
	 * @param testId テストのID
	 * @param params オプションのパラメータ（limit, offset, defects_filter, status_id）
	 * @returns テスト結果のリスト
	 */
	async getResults(
		testId: GetResultsInputType["testId"],
		params?: Record<string, string | number | boolean | null | undefined>,
	): Promise<TestRailResult[]> {
		try {
			const response: AxiosResponse<TestRailResult[]> = await this.client.get(
				`/api/v2/get_results/${testId}`,
				{ params },
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to get results for test ${testId}`);
		}
	}

	/**
	 * テストケースIDとテストランIDに基づいて、そのテストの結果のリストを返します
	 * @param runId テストランのID
	 * @param caseId テストケースのID
	 * @param params オプションのパラメータ（limit, offset, defects_filter, status_id）
	 * @returns テスト結果のリスト
	 */
	async getResultsForCase(
		runId: GetResultsForCaseInputType["runId"],
		caseId: GetResultsForCaseInputType["caseId"],
		params?: Record<string, string | number | boolean | null | undefined>,
	): Promise<TestRailResult[]> {
		try {
			const response: AxiosResponse<TestRailResult[]> = await this.client.get(
				`/api/v2/get_results_for_case/${runId}/${caseId}`,
				{ params },
			);
			return response.data;
		} catch (error) {
			throw handleApiError(
				error,
				`Failed to get results for case ${caseId} in run ${runId}`,
			);
		}
	}

	/**
	 * テストランに対する結果のリストを返します
	 * @param runId テストランのID
	 * @param params オプションのパラメータ（limit, offset, defects_filter, status_id）
	 * @returns テスト結果のリスト
	 */
	async getResultsForRun(
		runId: GetResultsForRunInputType["runId"],
		params?: Record<string, string | number | boolean | null | undefined>,
	): Promise<TestRailResult[]> {
		try {
			const response: AxiosResponse<TestRailResult[]> = await this.client.get(
				`/api/v2/get_results_for_run/${runId}`,
				{ params },
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to get results for run ${runId}`);
		}
	}

	/**
	 * テストに対して結果を追加します
	 * @param testId テストのID
	 * @param data テスト結果のデータ（status_id, comment, version, elapsed, defects, assignedto_id など）
	 * @returns 追加されたテスト結果
	 */
	async addResult(
		testId: AddResultInputType["testId"],
		data: Record<string, unknown>,
	): Promise<TestRailResult> {
		try {
			const response: AxiosResponse<TestRailResult> = await this.client.post(
				`/api/v2/add_result/${testId}`,
				data,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to add result for test ${testId}`);
		}
	}

	/**
	 * テストケースとテストランに基づいてテスト結果を追加します
	 * @param runId テストランのID
	 * @param caseId テストケースのID
	 * @param data テスト結果のデータ（status_id, comment, version, elapsed, defects, assignedto_id など）
	 * @returns 追加されたテスト結果
	 */
	async addResultForCase(
		runId: AddResultForCaseInputType["runId"],
		caseId: AddResultForCaseInputType["caseId"],
		data: Partial<Omit<AddResultForCaseInputType, "runId" | "caseId">>,
	): Promise<TestRailResult> {
		try {
			// デバッグログを追加
			console.log(
				`Sending request to add result for case ${caseId} in run ${runId}`,
			);

			// リクエスト実行
			const response: AxiosResponse<TestRailResult> = await this.client.post(
				`/api/v2/add_result_for_case/${runId}/${caseId}`,
				data,
			);
			return response.data;
		} catch (error) {
			// エラーをより詳細に記録
			console.error("Error adding result for case. Details:", error);
			throw handleApiError(
				error,
				`Failed to add result for case ${caseId} in run ${runId}`,
			);
		}
	}

	/**
	 * テストランに対して複数のテスト結果をまとめて追加します
	 * @param runId テストランのID
	 * @param data 結果データ（results配列を含む）
	 * @returns 追加されたテスト結果のリスト
	 */
	async addResults(
		runId: AddResultsInputType["runId"],
		data: Record<string, unknown>,
	): Promise<TestRailResult[]> {
		try {
			const response: AxiosResponse<TestRailResult[]> = await this.client.post(
				`/api/v2/add_results/${runId}`,
				data,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error, `Failed to add results for run ${runId}`);
		}
	}

	/**
	 * テストランに対して複数のテストケース結果をまとめて追加します
	 * @param runId テストランのID
	 * @param data 結果データ（results配列を含む）
	 * @returns 追加されたテスト結果のリスト
	 */
	async addResultsForCases(
		runId: AddResultsForCasesInputType["runId"],
		data: Record<string, unknown>,
	): Promise<TestRailResult[]> {
		try {
			const response: AxiosResponse<TestRailResult[]> = await this.client.post(
				`/api/v2/add_results_for_cases/${runId}`,
				data,
			);
			return response.data;
		} catch (error) {
			throw handleApiError(
				error,
				`Failed to add results for cases in run ${runId}`,
			);
		}
	}
}
