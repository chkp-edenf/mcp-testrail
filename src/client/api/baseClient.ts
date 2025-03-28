import axios, { AxiosInstance } from "axios";

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
 * Base TestRail API client that handles configuration and common functionality
 */
export class BaseTestRailClient {
	protected client: AxiosInstance;

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
}
