import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupMocks, createTestClient } from './testHelper';

describe('Users API', () => {
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

  it('retrieves a specific user', async () => {
    // Mock response
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      is_active: true,
      role_id: 1,
      role: 'Admin'
    };
    mockAxiosInstance.get.mockResolvedValue({ data: mockUser });
    
    // Test method
    const result = await client.getUser(1);
    
    // Verify axios get was called correctly
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_user/1');
    
    // Verify result
    expect(result).toEqual(mockUser);
  });
  
  it('handles errors when retrieving a specific user', async () => {
    // Mock error response (404 - user not found)
    const mockError = {
      response: {
        status: 404,
        data: { error: 'User not found' }
      }
    };
    mockAxiosInstance.get.mockRejectedValue(mockError);
    
    // Test error handling
    await expect(client.getUser(999)).rejects.toThrow();
    
    // Verify axios get was called correctly
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_user/999');
  });
  
  it('retrieves a user by email', async () => {
    // Mock response
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      is_active: true,
      role_id: 1,
      role: 'Admin'
    };
    mockAxiosInstance.get.mockResolvedValue({ data: mockUser });
    
    // Test method
    const result = await client.getUserByEmail('john.doe@example.com');
    
    // Verify axios get was called correctly - メールアドレスの@は%40にエンコードされる
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_user_by_email?email=john.doe%40example.com');
    
    // Verify result
    expect(result).toEqual(mockUser);
  });
  
  it('handles errors when retrieving a user by email', async () => {
    // Mock error response (404 - user not found)
    const mockError = {
      response: {
        status: 404,
        data: { error: 'User not found' }
      }
    };
    mockAxiosInstance.get.mockRejectedValue(mockError);
    
    // Test error handling
    await expect(client.getUserByEmail('nonexistent@example.com')).rejects.toThrow();
    
    // Verify axios get was called correctly - メールアドレスの@は%40にエンコードされる
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_user_by_email?email=nonexistent%40example.com');
  });
  
  it('retrieves all users', async () => {
    // Mock response
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com', is_active: true, role_id: 1, role: 'Admin' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', is_active: true, role_id: 2, role: 'Tester' }
    ];
    mockAxiosInstance.get.mockResolvedValue({ data: mockUsers });
    
    // Test method
    const result = await client.getUsers();
    
    // Verify axios get was called correctly
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v2/get_users');
    
    // Verify result
    expect(result).toEqual(mockUsers);
  });
}); 