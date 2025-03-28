import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupMocks, createTestClient } from './testHelper';

describe('Milestones API', () => {
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

  it('retrieves a specific milestone', async () => {
    // Mock response
    const mockMilestone = {
      id: 1,
      name: 'Milestone 1',
      description: 'Description for milestone 1',
      is_completed: false,
      due_on: 1609459200,
      project_id: 1,
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
  
  it('handles errors when retrieving a specific milestone', async () => {
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
  
  it('retrieves all milestones for a project', async () => {
    // Mock response
    const mockMilestones = [
      { id: 1, name: 'Milestone 1', description: 'Description for milestone 1', is_completed: false, due_on: 1609459200, project_id: 1, url: 'http://example.com/milestone/1' },
      { id: 2, name: 'Milestone 2', description: 'Description for milestone 2', is_completed: true, due_on: 1609545600, project_id: 1, url: 'http://example.com/milestone/2' }
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
      description: 'Description for new milestone',
      is_completed: false,
      due_on: 1619827200,
      project_id: 1,
      url: 'http://example.com/milestone/3'
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockMilestone });
    
    // Test data
    const milestoneData = {
      name: 'New Milestone',
      description: 'Description for new milestone',
      due_on: 1619827200
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
      description: 'Updated description',
      is_completed: true,
      due_on: 1619827200,
      project_id: 1,
      url: 'http://example.com/milestone/1'
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockMilestone });
    
    // Test data
    const milestoneData = {
      name: 'Updated Milestone',
      description: 'Updated description',
      is_completed: true,
      due_on: 1619827200
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
}); 