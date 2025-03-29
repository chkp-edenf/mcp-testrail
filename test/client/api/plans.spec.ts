import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupMocks, createTestClient } from './testHelper';

describe('Plans API', () => {
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

  it('retrieves a specific plan', async () => {
    // Mock response
    const mockPlan = {
      id: 1,
      name: 'Test Plan 1',
      description: 'Description for test plan 1',
      milestone_id: 1,
      assignedto_id: 1,
      entries: [],
      created_on: 1609459200,
      created_by: 1,
      url: 'http://example.com/plan/1'
    };
    mockAxiosInstance.get.mockResolvedValue({ data: mockPlan });
    
    // Test method
    const result = await client.plans.getPlan(1);
    
    // Verify axios get was called correctly
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_plan/1');
    
    // Verify result
    expect(result).toEqual(mockPlan);
  });
  
  it('handles errors when retrieving a specific plan', async () => {
    // Mock error response (404 - plan not found)
    const mockError = {
      response: {
        status: 404,
        data: { error: 'Plan not found' }
      }
    };
    mockAxiosInstance.get.mockRejectedValue(mockError);
    
    // Test error handling
    await expect(client.plans.getPlan(999)).rejects.toThrow();
    
    // Verify axios get was called correctly
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_plan/999');
  });
  
  it('retrieves all plans for a project', async () => {
    // Mock response
    const mockPlans = [
      { id: 1, name: 'Test Plan 1', description: 'Description for test plan 1', milestone_id: 1, assignedto_id: 1, entries: [], created_on: 1609459200, created_by: 1, url: 'http://example.com/plan/1' },
      { id: 2, name: 'Test Plan 2', description: 'Description for test plan 2', milestone_id: 2, assignedto_id: 2, entries: [], created_on: 1609545600, created_by: 1, url: 'http://example.com/plan/2' }
    ];
    mockAxiosInstance.get.mockResolvedValue({ data: mockPlans });
    
    // Test method
    const result = await client.plans.getPlans(1);
    
    // Verify axios get was called correctly
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_plans/1', expect.anything());
    
    // Verify result
    expect(result).toEqual(mockPlans);
  });
  
  it('creates a new plan', async () => {
    // Mock response
    const mockPlan = {
      id: 3,
      name: 'New Test Plan',
      description: 'Description for new test plan',
      milestone_id: 1,
      assignedto_id: null,
      entries: [],
      created_on: 1619827200,
      created_by: 1,
      url: 'http://example.com/plan/3'
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockPlan });
    
    // Test data
    const planData = {
      name: 'New Test Plan',
      description: 'Description for new test plan',
      milestone_id: 1
    };
    
    // Test method
    const result = await client.plans.addPlan(1, planData);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_plan/1', planData);
    
    // Verify result
    expect(result).toEqual(mockPlan);
  });
  
  it('adds an entry to a plan', async () => {
    // Mock response
    const mockEntry = {
      id: '1234abc',
      suite_id: 2,
      name: 'New Entry',
      runs: [
        {
          id: 5,
          suite_id: 2,
          name: 'Test Run',
          case_ids: [1, 2, 3],
          include_all: false
        }
      ]
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockEntry });
    
    // Test data
    const entryData = {
      suite_id: 2,
      name: 'New Entry',
      include_all: false,
      case_ids: [1, 2, 3]
    };
    
    // Test method
    const result = await client.plans.addPlanEntry(1, entryData);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_plan_entry/1', entryData);
    
    // Verify result
    expect(result).toEqual(mockEntry);
  });
  
  it('updates an existing plan', async () => {
    // Mock response
    const mockPlan = {
      id: 1,
      name: 'Updated Test Plan',
      description: 'Updated description',
      milestone_id: 2,
      assignedto_id: 1,
      entries: [],
      created_on: 1609459200,
      created_by: 1,
      url: 'http://example.com/plan/1'
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockPlan });
    
    // Test data
    const planData = {
      name: 'Updated Test Plan',
      description: 'Updated description',
      milestone_id: 2
    };
    
    // Test method
    const result = await client.plans.updatePlan(1, planData);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/update_plan/1', planData);
    
    // Verify result
    expect(result).toEqual(mockPlan);
  });
  
  it('updates a plan entry', async () => {
    // Mock response
    const mockEntry = {
      id: '1234abc',
      suite_id: 2,
      name: 'Updated Entry',
      runs: [
        {
          id: 5,
          suite_id: 2,
          name: 'Test Run',
          case_ids: [1, 2, 3, 4],
          include_all: false
        }
      ]
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockEntry });
    
    // Test data
    const entryData = {
      name: 'Updated Entry',
      include_all: false,
      case_ids: [1, 2, 3, 4]
    };
    
    // Test method
    const result = await client.plans.updatePlanEntry(1, '1234abc', entryData);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/update_plan_entry/1/1234abc', entryData);
    
    // Verify result
    expect(result).toEqual(mockEntry);
  });
  
  it('closes a plan', async () => {
    // Mock response
    const mockPlan = {
      id: 1,
      name: 'Test Plan 1',
      description: 'Description for test plan 1',
      milestone_id: 1,
      is_completed: true,
      completed_on: 1619827200,
      url: 'http://example.com/plan/1'
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockPlan });
    
    // Test method
    const result = await client.plans.closePlan(1);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/close_plan/1', {});
    
    // Verify result
    expect(result).toEqual(mockPlan);
  });
  
  it('deletes a plan', async () => {
    // Mock successful deletion (no response data)
    mockAxiosInstance.post.mockResolvedValue({ data: {} });
    
    // Test method
    await client.plans.deletePlan(1);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/delete_plan/1', {});
  });
  
  it('deletes a plan entry', async () => {
    // Mock successful deletion (no response data)
    mockAxiosInstance.post.mockResolvedValue({ data: {} });
    
    // Test method
    await client.plans.deletePlanEntry(1, '1234abc');
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/delete_plan_entry/1/1234abc', {});
  });
}); 