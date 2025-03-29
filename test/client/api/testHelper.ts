import { vi } from 'vitest';
import axios from 'axios';
import { TestRailClient } from '../../../src/client/api/index.js';
import { TestRailClientConfig } from '../../../src/client/api/baseClient.js';

// Mock axios
vi.mock('axios');

// Function to set up standard mocks
export function setupMocks() {
  // Mock axios instance
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    defaults: {
      headers: {
        common: {}
      }
    }
  };
  
  // Setup axios mocks
  // biome-ignore lint/suspicious/noExplicitAny: Required for mocking
  (axios.create as any).mockReturnValue(mockAxiosInstance);
  
  return mockAxiosInstance;
}

// Create a client for testing
export function createTestClient() {
  const mockConfig: TestRailClientConfig = {
    baseURL: 'https://example.testrail.com',
    auth: {
      username: 'test@example.com',
      password: 'api_key'
    }
  };
  
  return new TestRailClient(mockConfig);
} 