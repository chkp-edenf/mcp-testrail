import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { TestRailClient, TestRailClientConfig } from '../../src/client/testRailApi';

// Mock axios
vi.mock('axios');

describe('TestRailClient', () => {
  let client: TestRailClient;
  const mockConfig: TestRailClientConfig = {
    baseURL: 'https://example.testrail.com',
    auth: {
      username: 'test@example.com',
      password: 'api_key'
    }
  };
  
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
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup axios mocks
    // biome-ignore lint/suspicious/noExplicitAny: Required for mocking
    (axios.create as any).mockReturnValue(mockAxiosInstance);
    
    // Create client instance for testing
    client = new TestRailClient(mockConfig);
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  describe('Client Configuration', () => {
    it('initializes with the correct configuration', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: mockConfig.baseURL,
        auth: mockConfig.auth,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
    });
    
    it('sets custom headers correctly', () => {
      // Test setting a custom header
      client.setHeader('X-Custom-Header', 'CustomValue');
      
      // Verify header was set
      expect(mockAxiosInstance.defaults.headers.common['X-Custom-Header']).toBe('CustomValue');
    });
  });
  
  describe('Test Cases API', () => {
    it('retrieves a test case', async () => {
      // Mock response
      const mockCase = { 
        id: 1, 
        title: 'Test Case', 
        section_id: 1,
        template_id: 1,
        type_id: 1,
        priority_id: 2,
        created_by: 1,
        created_on: 1609459200,
        updated_by: 1,
        updated_on: 1609459300,
        suite_id: 1
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockCase });
      
      // Test method
      const result = await client.getCase(1);
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_case/1');
      
      // Verify result
      expect(result).toEqual(mockCase);
    });
    
    it('creates a new test case', async () => {
      // Mock response
      const mockCase = { 
        id: 1, 
        title: 'New Test Case', 
        section_id: 1,
        template_id: 1,
        type_id: 1,
        priority_id: 2,
        created_by: 1,
        created_on: 1609459200,
        updated_by: 1,
        updated_on: 1609459300,
        suite_id: 1
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockCase });
      
      // Test data
      const caseData = {
        title: 'New Test Case',
        template_id: 1,
        type_id: 1,
        priority_id: 2
      };
      
      // Test method
      const result = await client.addCase(1, caseData);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_case/1', caseData);
      
      // Verify result
      expect(result).toEqual(mockCase);
    });
    
    it('handles errors when retrieving a test case', async () => {
      // Mock error response
      const mockError = {
        response: {
          status: 404,
          data: { error: 'Test case not found' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.getCase(999)).rejects.toThrow();
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_case/999');
    });
  });
  
  describe('Projects API', () => {
    it('retrieves a specific project', async () => {
      // Mock response
      const mockProject = {
        id: 1,
        name: 'Project 1',
        announcement: '',
        show_announcement: false,
        is_completed: false,
        completed_on: null,
        suite_mode: 1,
        url: 'http://example.com/project/1'
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockProject });
      
      // Test method
      const result = await client.getProject(1);
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_project/1');
      
      // Verify result
      expect(result).toEqual(mockProject);
    });
    
    it('retrieves all projects', async () => {
      // Mock response
      const mockProjects = [
        { id: 1, name: 'Project 1', announcement: '', show_announcement: false, is_completed: false, completed_on: null, suite_mode: 1, url: 'http://example.com/project/1' },
        { id: 2, name: 'Project 2', announcement: '', show_announcement: false, is_completed: false, completed_on: null, suite_mode: 1, url: 'http://example.com/project/2' }
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: mockProjects });
      
      // Test method
      const result = await client.getProjects();
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_projects', expect.anything());
      
      // Verify result
      expect(result).toEqual(mockProjects);
    });
    
    it('handles errors when retrieving projects', async () => {
      // Mock error response
      const mockError = {
        response: {
          status: 500,
          data: { error: 'Server error' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.getProjects()).rejects.toThrow();
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_projects', expect.anything());
    });
  });
  
  describe('Results API', () => {
    it('adds a test result', async () => {
      // Mock response
      const mockResult = {
        id: 1,
        test_id: 1,
        status_id: 1,
        created_by: 1,
        created_on: 1609459200,
        assignedto_id: 1,
        comment: 'Test passed',
        version: '1.0',
        elapsed: '30s',
        defects: '',
        custom_step_results: []
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockResult });
      
      // Test data
      const resultData = {
        status_id: 1,
        comment: 'Test passed',
        version: '1.0',
        elapsed: '30s',
        defects: ''
      };
      
      // Test method
      const result = await client.addResult(1, resultData);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_result/1', resultData);
      
      // Verify result
      expect(result).toEqual(mockResult);
    });
    
    it('adds a result for a specific test case in a run', async () => {
      // Mock response
      const mockResult = {
        id: 1,
        test_id: 1,
        status_id: 1,
        created_by: 1,
        created_on: 1609459200,
        assignedto_id: 1,
        comment: 'Test passed',
        version: '1.0',
        elapsed: '30s',
        defects: '',
        custom_step_results: []
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockResult });
      
      // Test data
      const resultData = {
        status_id: 1,
        comment: 'Test passed',
        version: '1.0',
        elapsed: '30s',
        defects: ''
      };
      
      // Test method
      const result = await client.addResultForCase(1, 2, resultData);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_result_for_case/1/2', resultData);
      
      // Verify result
      expect(result).toEqual(mockResult);
    });
    
    it('handles 400 errors when adding results for a case', async () => {
      // Mock error response
      const mockError = {
        response: {
          status: 400,
          data: { error: 'Bad request' }
        },
        isAxiosError: true
      };
      
      // Mock implementation for isAxiosError
      // biome-ignore lint/suspicious/noExplicitAny: Required for mocking
      (axios.isAxiosError as any).mockReturnValue(true);
      
      mockAxiosInstance.post.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.addResultForCase(1, 2, { status_id: 1 })).rejects.toThrow();
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_result_for_case/1/2', { status_id: 1 });
    });
  });
  
  describe('Runs API', () => {
    it('retrieves a test run', async () => {
      // Mock response
      const mockRun = {
        id: 1,
        suite_id: 1,
        name: 'Test Run',
        description: '',
        milestone_id: 1,
        assignedto_id: 1,
        include_all: true,
        is_completed: false,
        completed_on: null,
        config: '',
        config_ids: [],
        created_by: 1,
        created_on: 1609459200,
        plan_id: 1,
        url: 'http://example.com/run/1',
        refs: ''
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockRun });
      
      // Test method
      const result = await client.getRun(1);
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_run/1');
      
      // Verify result
      expect(result).toEqual(mockRun);
    });
    
    it('adds a new test run', async () => {
      // Mock response
      const mockRun = {
        id: 1,
        suite_id: 1,
        name: 'New Test Run',
        description: 'Test run description',
        milestone_id: 1,
        assignedto_id: 1,
        include_all: true,
        is_completed: false,
        completed_on: null,
        config: '',
        config_ids: [],
        created_by: 1,
        created_on: 1609459200,
        plan_id: 1,
        url: 'http://example.com/run/1',
        refs: ''
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockRun });
      
      // Test data
      const runData = {
        name: 'New Test Run',
        description: 'Test run description',
        suite_id: 1,
        milestone_id: 1,
        assignedto_id: 1,
        include_all: true
      };
      
      // Test method
      const result = await client.addRun(1, runData);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_run/1', runData);
      
      // Verify result
      expect(result).toEqual(mockRun);
    });
  });
  
  describe('Users API', () => {
    it('retrieves a user by email', async () => {
      // Mock response
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'user@example.com',
        is_active: true,
        role_id: 2
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockUser });
      
      // Test method
      const result = await client.getUserByEmail('user@example.com');
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_user_by_email?email=user%40example.com');
      
      // Verify result
      expect(result).toEqual(mockUser);
    });
  });
});
