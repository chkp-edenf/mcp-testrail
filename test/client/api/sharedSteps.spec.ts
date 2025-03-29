import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupMocks, createTestClient } from './testHelper';

describe('Shared Steps API', () => {
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

  it('retrieves a specific shared step', async () => {
    // Mock response
    const mockSharedStep = {
      id: 1,
      title: 'Login Process',
      project_id: 1,
      created_by: 1,
      created_on: 1609459200,
      updated_by: 1,
      updated_on: 1609459200,
      custom_steps_separated: [
        {
          content: 'Open the login page',
          additional_info: 'Use Chrome browser',
          expected: 'Login page is displayed',
          refs: 'REF-1'
        },
        {
          content: 'Enter valid credentials',
          additional_info: null,
          expected: 'User is logged in',
          refs: null
        }
      ],
      case_ids: [1, 2, 3]
    };
    mockAxiosInstance.get.mockResolvedValue({ data: mockSharedStep });
    
    // Test method
    const result = await client.sharedSteps.getSharedStep(1);
    
    // Verify axios get was called correctly
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_shared_step/1');
    
    // Verify result
    expect(result).toEqual(mockSharedStep);
  });

  it('retrieves all shared steps for a project', async () => {
    // Mock response
    const mockSharedSteps = [
      {
        id: 1,
        title: 'Login Process',
        project_id: 1,
        created_by: 1,
        created_on: 1609459200,
        updated_by: 1,
        updated_on: 1609459200,
        custom_steps_separated: [
          {
            content: 'Open the login page',
            additional_info: 'Use Chrome browser',
            expected: 'Login page is displayed',
            refs: 'REF-1'
          },
          {
            content: 'Enter valid credentials',
            additional_info: null,
            expected: 'User is logged in',
            refs: null
          }
        ],
        case_ids: [1, 2, 3]
      },
      {
        id: 2,
        title: 'Logout Process',
        project_id: 1,
        created_by: 1,
        created_on: 1609459300,
        updated_by: 1,
        updated_on: 1609459300,
        custom_steps_separated: [
          {
            content: 'Click logout button',
            additional_info: null,
            expected: 'User is logged out',
            refs: null
          }
        ],
        case_ids: [4, 5]
      }
    ];
    mockAxiosInstance.get.mockResolvedValue({ data: mockSharedSteps });
    
    // Test method
    const result = await client.sharedSteps.getSharedSteps(1);
    
    // Verify axios get was called correctly
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_shared_steps/1', { params: undefined });
    
    // Verify result
    expect(result).toEqual(mockSharedSteps);
  });

  it('creates a new shared step', async () => {
    // Mock response
    const mockSharedStep = {
      id: 3,
      title: 'New Shared Step',
      project_id: 1,
      created_by: 1,
      created_on: 1609459400,
      updated_by: 1,
      updated_on: 1609459400,
      custom_steps_separated: [
        {
          content: 'Step 1',
          additional_info: 'Additional info for step 1',
          expected: 'Expected result 1',
          refs: 'REF-1'
        },
        {
          content: 'Step 2',
          additional_info: null,
          expected: 'Expected result 2',
          refs: null
        }
      ],
      case_ids: []
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockSharedStep });
    
    // Test data
    const sharedStepData = {
      title: 'New Shared Step',
      custom_steps_separated: [
        {
          content: 'Step 1',
          additional_info: 'Additional info for step 1',
          expected: 'Expected result 1',
          refs: 'REF-1'
        },
        {
          content: 'Step 2',
          additional_info: null,
          expected: 'Expected result 2',
          refs: null
        }
      ]
    };
    
    // Test method
    const result = await client.sharedSteps.addSharedStep(1, sharedStepData);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_shared_step/1', sharedStepData);
    
    // Verify result
    expect(result).toEqual(mockSharedStep);
  });

  it('updates an existing shared step', async () => {
    // Mock response
    const mockSharedStep = {
      id: 1,
      title: 'Updated Shared Step',
      project_id: 1,
      created_by: 1,
      created_on: 1609459200,
      updated_by: 1,
      updated_on: 1609459500,
      custom_steps_separated: [
        {
          content: 'Updated Step 1',
          additional_info: 'Updated additional info',
          expected: 'Updated expected result',
          refs: 'REF-2'
        }
      ],
      case_ids: [1, 2, 3]
    };
    mockAxiosInstance.post.mockResolvedValue({ data: mockSharedStep });
    
    // Test data
    const updateData = {
      title: 'Updated Shared Step',
      custom_steps_separated: [
        {
          content: 'Updated Step 1',
          additional_info: 'Updated additional info',
          expected: 'Updated expected result',
          refs: 'REF-2'
        }
      ]
    };
    
    // Test method
    const result = await client.sharedSteps.updateSharedStep(1, updateData);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/update_shared_step/1', updateData);
    
    // Verify result
    expect(result).toEqual(mockSharedStep);
  });

  it('deletes a shared step', async () => {
    // Mock successful delete (no response body)
    mockAxiosInstance.post.mockResolvedValue({});
    
    // Test method with default keepInCases=true
    await client.sharedSteps.deleteSharedStep(1);
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/delete_shared_step/1', {
      keep_in_cases: 1
    });
    
    // Test method with keepInCases=false
    await client.sharedSteps.deleteSharedStep(2, false);
    
    // Verify axios post was called correctly for second call
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/delete_shared_step/2', {
      keep_in_cases: 0
    });
  });

  it('handles errors when retrieving a shared step', async () => {
    // Mock error response
    const mockError = {
      response: {
        status: 400,
        data: { error: 'Invalid or unknown shared step' }
      }
    };
    mockAxiosInstance.get.mockRejectedValue(mockError);
    
    // Test error handling
    await expect(client.sharedSteps.getSharedStep(999)).rejects.toThrow();
    
    // Verify axios get was called correctly
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_shared_step/999');
  });

  it('handles errors when retrieving shared steps for a project', async () => {
    // Mock error response
    const mockError = {
      response: {
        status: 400,
        data: { error: 'Invalid or unknown project' }
      }
    };
    mockAxiosInstance.get.mockRejectedValue(mockError);
    
    // Test error handling
    await expect(client.sharedSteps.getSharedSteps(999)).rejects.toThrow();
    
    // Verify axios get was called correctly
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_shared_steps/999', { params: undefined });
  });

  it('handles errors when creating a shared step', async () => {
    // Mock error response
    const mockError = {
      response: {
        status: 400,
        data: { error: 'Invalid or unknown project' }
      }
    };
    mockAxiosInstance.post.mockRejectedValue(mockError);
    
    // Test data
    const sharedStepData = {
      title: 'New Shared Step',
      custom_steps_separated: [
        {
          content: 'Step 1',
          additional_info: null,
          expected: null,
          refs: null
        }
      ]
    };
    
    // Test error handling
    await expect(client.sharedSteps.addSharedStep(999, sharedStepData)).rejects.toThrow();
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/add_shared_step/999', sharedStepData);
  });

  it('handles errors when updating a shared step', async () => {
    // Mock error response
    const mockError = {
      response: {
        status: 400,
        data: { error: 'Invalid or unknown shared step' }
      }
    };
    mockAxiosInstance.post.mockRejectedValue(mockError);
    
    // Test data
    const updateData = {
      title: 'Updated Shared Step'
    };
    
    // Test error handling
    await expect(client.sharedSteps.updateSharedStep(999, updateData)).rejects.toThrow();
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/update_shared_step/999', updateData);
  });

  it('handles errors when deleting a shared step', async () => {
    // Mock error response
    const mockError = {
      response: {
        status: 400,
        data: { error: 'Invalid or unknown shared step' }
      }
    };
    mockAxiosInstance.post.mockRejectedValue(mockError);
    
    // Test error handling
    await expect(client.sharedSteps.deleteSharedStep(999)).rejects.toThrow();
    
    // Verify axios post was called correctly
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/delete_shared_step/999', {
      keep_in_cases: 1
    });
  });
}); 