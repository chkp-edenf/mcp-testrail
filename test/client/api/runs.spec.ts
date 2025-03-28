import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupMocks, createTestClient } from './testHelper';

describe('Runs API', () => {
  let mockAxiosInstance: ReturnType<typeof setupMocks>;
  let client: ReturnType<typeof createTestClient>;
  
  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance = setupMocks();
    client = createTestClient();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('retrieves a specific run', async () => {
    // Mock response
    const mockRun = {
      id: 1,
      name: 'Test Run 1',
      description: 'Description for test run 1',
      suite_id: 1,
      milestone_id: 1,
      assignedto_id: 1,
      include_all: true,
      is_completed: false,
      completed_on: null,
      passed_count: 5,
      blocked_count: 0,
      untested_count: 5,
      retest_count: 0,
      failed_count: 0,
      created_on: 1609459200,
      created_by: 1,
      url: 'http://example.com/run/1'
    };
    mockAxiosInstance.get.mockResolvedValue({ data: mockRun });
    
    // Test method
    const result = await client.getRun(1);
    
    // Verify axios get was called correctly
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_run/1');
    
    // Verify result
    expect(result).toEqual(mockRun);
  });
  
  it('handles errors when retrieving a specific run', async () => {
    // Mock error response (404 - run not found)
    const mockError = {
      response: {
        status: 404,
        data: { error: 'Run not found' }
      }
    };
    mockAxiosInstance.get.mockRejectedValue(mockError);
    
    // Test error handling
    await expect(client.getRun(999)).rejects.toThrow();
    
    // Verify axios get was called correctly
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_run/999');
  });
  
  it('retrieves all runs for a project', async () => {
    // Mock response
    const mockRuns = [
      { id: 1, name: 'Test Run 1', description: 'Description for test run 1', suite_id: 1, milestone_id: 1, is_completed: false, url: 'http://example.com/run/1' },
      { id: 2, name: 'Test Run 2', description: 'Description for test run 2', suite_id: 1, milestone_id: 1, is_completed: true, url: 'http://example.com/run/2' }
    ];
    mockAxiosInstance.get.mockResolvedValue({ data: mockRuns });
    
    // Test method
    const result = await client.getRuns(1);
    
    // Verify axios get was called correctly
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_runs/1', expect.anything());
    
    // Verify result
    expect(result).toEqual(mockRuns);
  });
  
  it('retrieves runs with filter parameters', async () => {
    // Mock response
    const mockRuns = [
      { id: 1, name: 'Test Run 1', suite_id: 1, milestone_id: 5, is_completed: false, url: 'http://example.com/run/1' }
    ];
    mockAxiosInstance.get.mockResolvedValue({ data: mockRuns });
    
    // Test method with filters
    const filters = { milestone_id: 5, is_completed: 0 };
    const result = await client.getRuns(1, filters);
    
    // Verify axios get was called correctly with query parameters
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_runs/1', {
      params: filters
    });
    
    // Verify result
    expect(result).toEqual(mockRuns);
  });
  
  it('creates a new run', async () => {
    // Mock response
    const mockRun = {
      id: 3,
      name: 'New Test Run',
      description: 'Description for new test run',
      suite_id: 1,
      milestone_id: 1,
      assignedto_id: 1,
      include_all: false,
      case_ids: [1, 2, 3],
      is_completed: false,
      created_on: 1619827200,
      created_by: 1,
      url: 'http://example.com/run/3'
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockRun });
    
    // Test data
    const runData = {
      name: 'New Test Run',
      description: 'Description for new test run',
      suite_id: 1,
      milestone_id: 1,
      assignedto_id: 1,
      include_all: false,
      case_ids: [1, 2, 3]
    };
    
    // Test method
    const result = await client.addRun(1, runData);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_run/1', runData);
    
    // Verify result
    expect(result).toEqual(mockRun);
  });
  
  it('updates an existing run', async () => {
    // Mock response
    const mockRun = {
      id: 1,
      name: 'Updated Test Run',
      description: 'Updated description',
      milestone_id: 2,
      include_all: true,
      is_completed: false,
      url: 'http://example.com/run/1'
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockRun });
    
    // Test data
    const runData = {
      name: 'Updated Test Run',
      description: 'Updated description',
      milestone_id: 2,
      include_all: true
    };
    
    // Test method
    const result = await client.updateRun(1, runData);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/update_run/1', runData);
    
    // Verify result
    expect(result).toEqual(mockRun);
  });
  
  it('closes a run', async () => {
    // Mock response
    const mockRun = {
      id: 1,
      name: 'Test Run 1',
      is_completed: true,
      completed_on: 1619827200,
      url: 'http://example.com/run/1'
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockRun });
    
    // Test method
    const result = await client.closeRun(1);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/close_run/1', {});
    
    // Verify result
    expect(result).toEqual(mockRun);
  });
  
  it('deletes a run', async () => {
    // Mock successful deletion (no response data)
    mockAxiosInstance.post.mockResolvedValue({ data: {} });
    
    // Test method
    await client.deleteRun(1);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/delete_run/1', {});
  });
  
  it('adds a result for a test', async () => {
    // Mock response
    const mockResult = {
      id: 100,
      test_id: 1,
      status_id: 1, // Pass
      comment: 'Test passed successfully',
      created_on: 1619827200,
      created_by: 1
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockResult });
    
    // Test data
    const resultData = {
      status_id: 1,
      comment: 'Test passed successfully'
    };
    
    // Test method
    const result = await client.addResult(1, resultData);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_result/1', resultData);
    
    // Verify result
    expect(result).toEqual(mockResult);
  });
  
  it('adds a result for a test case in a run', async () => {
    // Mock response
    const mockResult = {
      id: 101,
      test_id: 100,
      status_id: 5, // Failed
      comment: 'Test failed with exception',
      created_on: 1619827200,
      created_by: 1
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockResult });
    
    // Test data
    const resultData = {
      status_id: 5,
      comment: 'Test failed with exception'
    };
    
    // Test method
    const result = await client.addResultForCase(1, 2, resultData);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_result_for_case/1/2', resultData);
    
    // Verify result
    expect(result).toEqual(mockResult);
  });
}); 