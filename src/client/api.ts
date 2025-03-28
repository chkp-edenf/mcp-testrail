import axios, { AxiosInstance } from "axios";

export interface HttpClientConfig {
	baseURL: string;
	headers?: Record<string, string>;
	timeout?: number;
	auth?: {
		username: string;
		password: string;
	};
}

// Generic request parameters type
export interface RequestParams {
	[key: string]: string | number | boolean | null | undefined;
}

// Generic request body type
export interface RequestData {
	[key: string]: unknown;
}

export class HttpClient {
	private client: AxiosInstance;

	constructor(config: HttpClientConfig) {
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

	// Access to the underlying Axios instance for special cases
	getAxiosInstance(): AxiosInstance {
		return this.client;
	}

	// GET request
	async get<T>(url: string, params?: RequestParams): Promise<T> {
		const response = await this.client.get<T>(url, { params });
		return response.data;
	}

	// POST request
	async post<T>(url: string, data?: RequestData): Promise<T> {
		const response = await this.client.post<T>(url, data);
		return response.data;
	}

	// PUT request
	async put<T>(url: string, data?: RequestData): Promise<T> {
		const response = await this.client.put<T>(url, data);
		return response.data;
	}

	// PATCH request
	async patch<T>(url: string, data?: RequestData): Promise<T> {
		const response = await this.client.patch<T>(url, data);
		return response.data;
	}

	// DELETE request
	async delete<T>(url: string): Promise<T> {
		const response = await this.client.delete<T>(url);
		return response.data;
	}

	// Add custom header
	setHeader(name: string, value: string): void {
		this.client.defaults.headers.common[name] = value;
	}
}
