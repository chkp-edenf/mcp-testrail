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
    
    it('handles errors when retrieving a specific project', async () => {
      // Mock error response (404 - project not found)
      const mockError = {
        response: {
          status: 404,
          data: { error: 'Project not found' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.getProject(999)).rejects.toThrow();
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_project/999');
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
    
    it('creates a new project', async () => {
      // Mock response
      const mockProject = {
        id: 3,
        name: 'New Project',
        announcement: 'Project announcement',
        show_announcement: true,
        is_completed: false,
        completed_on: null,
        suite_mode: 3,
        url: 'http://example.com/project/3'
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockProject });
      
      // Test data
      const projectData = {
        name: 'New Project',
        announcement: 'Project announcement',
        show_announcement: true,
        suite_mode: 3
      };
      
      // Test method
      const result = await client.addProject(projectData);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_project', projectData);
      
      // Verify result
      expect(result).toEqual(mockProject);
    });
    
    it('updates an existing project', async () => {
      // Mock response
      const mockProject = {
        id: 1,
        name: 'Updated Project',
        announcement: 'Updated announcement',
        show_announcement: true,
        is_completed: true,
        completed_on: 1609459200,
        suite_mode: 1,
        url: 'http://example.com/project/1'
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockProject });
      
      // Test data
      const projectData = {
        name: 'Updated Project',
        announcement: 'Updated announcement',
        show_announcement: true,
        is_completed: true
      };
      
      // Test method
      const result = await client.updateProject(1, projectData);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/update_project/1', projectData);
      
      // Verify result
      expect(result).toEqual(mockProject);
    });
    
    it('deletes a project', async () => {
      // Mock successful deletion (no response data)
      mockAxiosInstance.post.mockResolvedValue({ data: {} });
      
      // Test method
      await client.deleteProject(1);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/delete_project/1', {});
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
    
    it('handles errors when creating a project', async () => {
      // Mock error response (403 - no admin rights)
      const mockError = {
        response: {
          status: 403,
          data: { error: 'No admin rights' }
        }
      };
      mockAxiosInstance.post.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.addProject({ name: 'Test Project' })).rejects.toThrow();
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_project', { name: 'Test Project' });
    });
    
    it('handles errors when updating a project', async () => {
      // Mock error response (400 - invalid project ID)
      const mockError = {
        response: {
          status: 400,
          data: { error: 'Invalid project ID' }
        }
      };
      mockAxiosInstance.post.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.updateProject(999, { name: 'Updated Project' })).rejects.toThrow();
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/update_project/999', { name: 'Updated Project' });
    });
    
    it('handles errors when deleting a project', async () => {
      // Mock error response (403 - no admin rights)
      const mockError = {
        response: {
          status: 403,
          data: { error: 'No permission to delete project' }
        }
      };
      mockAxiosInstance.post.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.deleteProject(1)).rejects.toThrow();
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/delete_project/1', {});
    });
  });
  
  describe('Milestones API', () => {
    it('retrieves a specific milestone', async () => {
      // Mock response
      const mockMilestone = {
        id: 1,
        name: 'Release 1.0',
        description: 'First release',
        due_on: 1609459200,
        start_on: 1608249600,
        started_on: 1608249600,
        completed_on: null,
        project_id: 1,
        is_completed: false,
        is_started: true,
        parent_id: null,
        refs: 'REF-1',
        url: 'http://example.com/milestone/1'
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockMilestone });
      
      // Test method
      const result = await client.getMilestone(1);
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_milestone/1');
      
      // Verify result
      expect(result).toEqual(mockMilestone);
    });
    
    it('retrieves all milestones for a project', async () => {
      // Mock response
      const mockMilestones = [
        {
          id: 1,
          name: 'Release 1.0',
          description: 'First release',
          due_on: 1609459200,
          start_on: 1608249600,
          started_on: 1608249600,
          completed_on: null,
          project_id: 1,
          is_completed: false,
          is_started: true,
          parent_id: null,
          refs: 'REF-1',
          url: 'http://example.com/milestone/1'
        },
        {
          id: 2,
          name: 'Release 2.0',
          description: 'Second release',
          due_on: 1619459200,
          start_on: 1618249600,
          started_on: null,
          completed_on: null,
          project_id: 1,
          is_completed: false,
          is_started: false,
          parent_id: null,
          refs: 'REF-2',
          url: 'http://example.com/milestone/2'
        }
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: mockMilestones });
      
      // Test method
      const result = await client.getMilestones(1);
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_milestones/1', expect.anything());
      
      // Verify result
      expect(result).toEqual(mockMilestones);
    });
    
    it('creates a new milestone', async () => {
      // Mock response
      const mockMilestone = {
        id: 3,
        name: 'New Milestone',
        description: 'This is a new milestone',
        due_on: 1639459200,
        start_on: 1638249600,
        started_on: null,
        completed_on: null,
        project_id: 1,
        is_completed: false,
        is_started: false,
        parent_id: null,
        refs: 'REF-3',
        url: 'http://example.com/milestone/3'
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockMilestone });
      
      // Test data
      const milestoneData = {
        name: 'New Milestone',
        description: 'This is a new milestone',
        due_on: 1639459200,
        start_on: 1638249600,
        refs: 'REF-3'
      };
      
      // Test method
      const result = await client.addMilestone(1, milestoneData);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_milestone/1', milestoneData);
      
      // Verify result
      expect(result).toEqual(mockMilestone);
    });
    
    it('updates an existing milestone', async () => {
      // Mock response
      const mockMilestone = {
        id: 1,
        name: 'Updated Milestone',
        description: 'This milestone has been updated',
        due_on: 1659459200,
        start_on: 1658249600,
        started_on: 1658249600,
        completed_on: null,
        project_id: 1,
        is_completed: false,
        is_started: true,
        parent_id: null,
        refs: 'REF-1-UPDATED',
        url: 'http://example.com/milestone/1'
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockMilestone });
      
      // Test data
      const milestoneData = {
        name: 'Updated Milestone',
        description: 'This milestone has been updated',
        due_on: 1659459200,
        start_on: 1658249600,
        is_started: true,
        refs: 'REF-1-UPDATED'
      };
      
      // Test method
      const result = await client.updateMilestone(1, milestoneData);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/update_milestone/1', milestoneData);
      
      // Verify result
      expect(result).toEqual(mockMilestone);
    });
    
    it('deletes a milestone', async () => {
      // Mock successful deletion (no response data)
      mockAxiosInstance.post.mockResolvedValue({ data: {} });
      
      // Test method
      await client.deleteMilestone(1);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/delete_milestone/1', {});
    });
    
    it('handles errors when retrieving a milestone', async () => {
      // Mock error response (404 - milestone not found)
      const mockError = {
        response: {
          status: 404,
          data: { error: 'Milestone not found' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.getMilestone(999)).rejects.toThrow();
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_milestone/999');
    });
    
    it('handles errors when creating a milestone', async () => {
      // Mock error response (400 - invalid request)
      const mockError = {
        response: {
          status: 400,
          data: { error: 'Invalid project' }
        }
      };
      mockAxiosInstance.post.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.addMilestone(999, { name: 'Test Milestone' })).rejects.toThrow();
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_milestone/999', { name: 'Test Milestone' });
    });
    
    it('handles errors when updating a milestone', async () => {
      // Mock error response (404 - milestone not found)
      const mockError = {
        response: {
          status: 404,
          data: { error: 'Milestone not found' }
        }
      };
      mockAxiosInstance.post.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.updateMilestone(999, { name: 'Updated Milestone' })).rejects.toThrow();
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/update_milestone/999', { name: 'Updated Milestone' });
    });
  });
  
  describe('Suites API', () => {
    it('retrieves a specific test suite', async () => {
      // Mock response
      const mockSuite = {
        id: 1,
        name: 'Test Suite 1',
        description: 'This is a test suite',
        project_id: 1,
        is_baseline: false,
        is_completed: false,
        is_master: true,
        completed_on: null,
        url: 'http://example.com/suite/1'
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockSuite });
      
      // Test method
      const result = await client.getSuite(1);
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_suite/1');
      
      // Verify result
      expect(result).toEqual(mockSuite);
    });
    
    it('retrieves all test suites for a project', async () => {
      // Mock response
      const mockSuites = [
        {
          id: 1,
          name: 'Test Suite 1',
          description: 'This is test suite 1',
          project_id: 1,
          is_baseline: false,
          is_completed: false,
          is_master: true,
          completed_on: null,
          url: 'http://example.com/suite/1'
        },
        {
          id: 2,
          name: 'Test Suite 2',
          description: 'This is test suite 2',
          project_id: 1,
          is_baseline: false,
          is_completed: false,
          is_master: false,
          completed_on: null,
          url: 'http://example.com/suite/2'
        }
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: mockSuites });
      
      // Test method
      const result = await client.getSuites(1);
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_suites/1');
      
      // Verify result
      expect(result).toEqual(mockSuites);
    });
    
    it('creates a new test suite', async () => {
      // Mock response
      const mockSuite = {
        id: 3,
        name: 'New Test Suite',
        description: 'This is a new test suite',
        project_id: 1,
        is_baseline: false,
        is_completed: false,
        is_master: false,
        completed_on: null,
        url: 'http://example.com/suite/3'
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockSuite });
      
      // Test data
      const suiteData = {
        name: 'New Test Suite',
        description: 'This is a new test suite'
      };
      
      // Test method
      const result = await client.addSuite(1, suiteData);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_suite/1', suiteData);
      
      // Verify result
      expect(result).toEqual(mockSuite);
    });
    
    it('updates an existing test suite', async () => {
      // Mock response
      const mockSuite = {
        id: 1,
        name: 'Updated Test Suite',
        description: 'This test suite has been updated',
        project_id: 1,
        is_baseline: false,
        is_completed: false,
        is_master: true,
        completed_on: null,
        url: 'http://example.com/suite/1'
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockSuite });
      
      // Test data
      const suiteData = {
        name: 'Updated Test Suite',
        description: 'This test suite has been updated'
      };
      
      // Test method
      const result = await client.updateSuite(1, suiteData);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/update_suite/1', suiteData);
      
      // Verify result
      expect(result).toEqual(mockSuite);
    });
    
    it('deletes a test suite', async () => {
      // Mock successful deletion (no response data)
      mockAxiosInstance.post.mockResolvedValue({ data: {} });
      
      // Test method
      await client.deleteSuite(1);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/delete_suite/1', {});
    });
    
    it('handles errors when retrieving a test suite', async () => {
      // Mock error response (404 - test suite not found)
      const mockError = {
        response: {
          status: 404,
          data: { error: 'Test suite not found' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.getSuite(999)).rejects.toThrow();
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_suite/999');
    });
    
    it('handles errors when creating a test suite', async () => {
      // Mock error response (400 - invalid request)
      const mockError = {
        response: {
          status: 400,
          data: { error: 'Invalid project' }
        }
      };
      mockAxiosInstance.post.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.addSuite(999, { name: 'Test Suite' })).rejects.toThrow();
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_suite/999', { name: 'Test Suite' });
    });
    
    it('handles errors when updating a test suite', async () => {
      // Mock error response (404 - test suite not found)
      const mockError = {
        response: {
          status: 404,
          data: { error: 'Test suite not found' }
        }
      };
      mockAxiosInstance.post.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.updateSuite(999, { name: 'Updated Test Suite' })).rejects.toThrow();
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/update_suite/999', { name: 'Updated Test Suite' });
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
  
  describe('Plans API', () => {
    it('retrieves a specific test plan', async () => {
      // Mock response
      const mockPlan = {
        id: 1,
        name: 'Test Plan',
        description: 'This is a test plan',
        milestone_id: 1,
        assignedto_id: 1,
        project_id: 1,
        created_on: 1609459200,
        created_by: 1,
        completed_on: null,
        is_completed: false,
        passed_count: 5,
        blocked_count: 2,
        untested_count: 3,
        retest_count: 0,
        failed_count: 1,
        entries: [
          {
            id: 'abc123',
            suite_id: 1,
            name: 'Test Entry',
            description: 'Test entry description',
            include_all: true,
            runs: [
              {
                id: 101,
                suite_id: 1,
                name: 'Test Run',
                description: '',
                milestone_id: 1,
                assignedto_id: 1,
                include_all: true,
                is_completed: false,
                completed_on: null,
                config: null,
                config_ids: [],
                passed_count: 5,
                blocked_count: 2,
                untested_count: 3,
                retest_count: 0,
                failed_count: 1,
                custom_status_count: {},
                created_on: 1609459200,
                created_by: 1,
                plan_id: 1,
                url: 'http://example.com/run/101',
                refs: ''
              }
            ],
            refs: 'REF-1'
          }
        ],
        url: 'http://example.com/plan/1'
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockPlan });
      
      // Test method
      const result = await client.getPlan(1);
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_plan/1');
      
      // Verify result
      expect(result).toEqual(mockPlan);
    });
    
    it('retrieves all test plans for a project', async () => {
      // Mock response
      const mockPlans = [
        {
          id: 1,
          name: 'Test Plan 1',
          description: 'This is test plan 1',
          milestone_id: 1,
          assignedto_id: 1,
          project_id: 1,
          created_on: 1609459200,
          created_by: 1,
          completed_on: null,
          is_completed: false,
          passed_count: 5,
          blocked_count: 2,
          untested_count: 3,
          retest_count: 0,
          failed_count: 1,
          entries: [],
          url: 'http://example.com/plan/1'
        },
        {
          id: 2,
          name: 'Test Plan 2',
          description: 'This is test plan 2',
          milestone_id: 2,
          assignedto_id: 1,
          project_id: 1,
          created_on: 1609559200,
          created_by: 1,
          completed_on: null,
          is_completed: false,
          passed_count: 10,
          blocked_count: 0,
          untested_count: 5,
          retest_count: 0,
          failed_count: 0,
          entries: [],
          url: 'http://example.com/plan/2'
        }
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: mockPlans });
      
      // Test method
      const result = await client.getPlans(1);
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_plans/1', expect.anything());
      
      // Verify result
      expect(result).toEqual(mockPlans);
    });
    
    it('creates a new test plan', async () => {
      // Mock response
      const mockPlan = {
        id: 3,
        name: 'New Test Plan',
        description: 'This is a new test plan',
        milestone_id: 1,
        assignedto_id: null,
        project_id: 1,
        created_on: 1609659200,
        created_by: 1,
        completed_on: null,
        is_completed: false,
        passed_count: 0,
        blocked_count: 0,
        untested_count: 10,
        retest_count: 0,
        failed_count: 0,
        entries: [
          {
            id: 'xyz789',
            suite_id: 1,
            name: 'Test Suite Run',
            description: null,
            include_all: true,
            runs: [],
            refs: null
          }
        ],
        url: 'http://example.com/plan/3'
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockPlan });
      
      // Test data
      const planData = {
        name: 'New Test Plan',
        description: 'This is a new test plan',
        milestone_id: 1,
        entries: [
          {
            suite_id: 1,
            name: 'Test Suite Run',
            include_all: true
          }
        ]
      };
      
      // Test method
      const result = await client.addPlan(1, planData);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_plan/1', planData);
      
      // Verify result
      expect(result).toEqual(mockPlan);
    });
    
    it('adds an entry to an existing test plan', async () => {
      // Mock response
      const mockEntry = {
        id: 'def456',
        suite_id: 2,
        name: 'New Entry',
        description: 'This is a new entry',
        include_all: false,
        case_ids: [1, 2, 3],
        runs: [
          {
            id: 102,
            suite_id: 2,
            name: 'New Entry',
            description: 'This is a new entry',
            milestone_id: null,
            assignedto_id: null,
            include_all: false,
            is_completed: false,
            completed_on: null,
            config: null,
            config_ids: [],
            passed_count: 0,
            blocked_count: 0,
            untested_count: 3,
            retest_count: 0,
            failed_count: 0,
            custom_status_count: {},
            created_on: 1609759200,
            created_by: 1,
            plan_id: 1,
            url: 'http://example.com/run/102',
            refs: ''
          }
        ],
        refs: null
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockEntry });
      
      // Test data
      const entryData = {
        suite_id: 2,
        name: 'New Entry',
        description: 'This is a new entry',
        include_all: false,
        case_ids: [1, 2, 3]
      };
      
      // Test method
      const result = await client.addPlanEntry(1, entryData);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_plan_entry/1', entryData);
      
      // Verify result
      expect(result).toEqual(mockEntry);
    });
    
    it('updates an existing test plan', async () => {
      // Mock response
      const mockPlan = {
        id: 1,
        name: 'Updated Test Plan',
        description: 'This test plan has been updated',
        milestone_id: 2,
        assignedto_id: 1,
        project_id: 1,
        created_on: 1609459200,
        created_by: 1,
        completed_on: null,
        is_completed: false,
        passed_count: 5,
        blocked_count: 2,
        untested_count: 3,
        retest_count: 0,
        failed_count: 1,
        entries: [],
        url: 'http://example.com/plan/1'
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockPlan });
      
      // Test data
      const planData = {
        name: 'Updated Test Plan',
        description: 'This test plan has been updated',
        milestone_id: 2
      };
      
      // Test method
      const result = await client.updatePlan(1, planData);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/update_plan/1', planData);
      
      // Verify result
      expect(result).toEqual(mockPlan);
    });
    
    it('updates an existing test plan entry', async () => {
      // Mock response
      const mockEntry = {
        id: 'abc123',
        suite_id: 1,
        name: 'Updated Entry',
        description: 'This entry has been updated',
        include_all: false,
        case_ids: [4, 5],
        runs: [],
        refs: 'REF-1'
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockEntry });
      
      // Test data
      const entryData = {
        name: 'Updated Entry',
        description: 'This entry has been updated',
        include_all: false,
        case_ids: [4, 5]
      };
      
      // Test method
      const result = await client.updatePlanEntry(1, 'abc123', entryData);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/update_plan_entry/1/abc123', entryData);
      
      // Verify result
      expect(result).toEqual(mockEntry);
    });
    
    it('closes a test plan', async () => {
      // Mock response
      const mockPlan = {
        id: 1,
        name: 'Test Plan',
        description: 'This is a test plan',
        milestone_id: 1,
        assignedto_id: 1,
        project_id: 1,
        created_on: 1609459200,
        created_by: 1,
        completed_on: 1619459200,
        is_completed: true,
        passed_count: 5,
        blocked_count: 2,
        untested_count: 3,
        retest_count: 0,
        failed_count: 1,
        entries: [],
        url: 'http://example.com/plan/1'
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockPlan });
      
      // Test method
      const result = await client.closePlan(1);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/close_plan/1', {});
      
      // Verify result
      expect(result).toEqual(mockPlan);
    });
    
    it('deletes a test plan', async () => {
      // Mock successful deletion (no response data)
      mockAxiosInstance.post.mockResolvedValue({ data: {} });
      
      // Test method
      await client.deletePlan(1);
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/delete_plan/1', {});
    });
    
    it('deletes an entry from a test plan', async () => {
      // Mock successful deletion (no response data)
      mockAxiosInstance.post.mockResolvedValue({ data: {} });
      
      // Test method
      await client.deletePlanEntry(1, 'abc123');
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/delete_plan_entry/1/abc123', {});
    });
    
    it('handles errors when retrieving a test plan', async () => {
      // Mock error response (404 - test plan not found)
      const mockError = {
        response: {
          status: 404,
          data: { error: 'Test plan not found' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.getPlan(999)).rejects.toThrow();
      
      // Verify axios get was called correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_plan/999');
    });
    
    it('handles errors when creating a test plan', async () => {
      // Mock error response (400 - invalid request)
      const mockError = {
        response: {
          status: 400,
          data: { error: 'Invalid project' }
        }
      };
      mockAxiosInstance.post.mockRejectedValue(mockError);
      
      // Test error handling
      await expect(client.addPlan(999, { name: 'Test Plan' })).rejects.toThrow();
      
      // Verify axios post was called correctly
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_plan/999', { name: 'Test Plan' });
    });
  });
});
