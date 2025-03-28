import { vi } from 'vitest';
import axios from 'axios';
import { TestRailClient, TestRailClientConfig } from '../../../src/client/testRailApi';

// Mock axios
vi.mock('axios');

// 標準的なモックの設定を行う関数
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

// テスト用のクライアントを生成
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