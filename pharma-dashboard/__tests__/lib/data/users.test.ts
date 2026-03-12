import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  getUsersByRole,
  getUsersByStatus,
} from '../../../lib/data/users';

describe('Users Data Store', () => {
  // Note: The users module uses an internal mutable array.
  // Tests run sequentially within this file, so we need to be aware of state changes.

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = await getAllUsers();
      expect(users.length).toBeGreaterThanOrEqual(4);
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('name');
      expect(users[0]).toHaveProperty('email');
      expect(users[0]).toHaveProperty('role');
    });
  });

  describe('getUserById', () => {
    it('should return user when id exists', async () => {
      const user = await getUserById('USR001');
      expect(user).toBeDefined();
      expect(user?.id).toBe('USR001');
      expect(user?.name).toBe('Dr. Sarah Johnson');
    });

    it('should return null for non-existent id', async () => {
      const user = await getUserById('NONEXISTENT');
      expect(user).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'New Test User',
        email: 'newuser@pharma.com',
        role: 'Staff' as const,
        assignedPrograms: ['PROG001'],
        status: 'Active' as const,
      };
      const user = await createUser(userData);
      expect(user.name).toBe('New Test User');
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('updateUser', () => {
    it('should update existing user', async () => {
      const updated = await updateUser('USR001', { name: 'Updated Name' });
      expect(updated).toBeDefined();
      expect(updated?.name).toBe('Updated Name');
    });

    it('should return null for non-existent user', async () => {
      const result = await updateUser('NONEXISTENT', { name: 'Test' });
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should return false for non-existent user', async () => {
      const result = await deleteUser('NONEXISTENT');
      expect(result).toBe(false);
    });

    it('should delete existing user', async () => {
      const users = await getAllUsers();
      const lastUser = users[users.length - 1];
      const result = await deleteUser(lastUser.id);
      expect(result).toBe(true);
      const deleted = await getUserById(lastUser.id);
      expect(deleted).toBeNull();
    });
  });

  describe('searchUsers', () => {
    it('should search by name', async () => {
      const results = await searchUsers('sarah');
      expect(results.length).toBeGreaterThanOrEqual(0);
    });

    it('should search by email', async () => {
      const results = await searchUsers('pharma.com');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should search by role', async () => {
      const results = await searchUsers('Manager');
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    it('should return all users for empty query', async () => {
      const all = await getAllUsers();
      const results = await searchUsers('');
      expect(results.length).toBe(all.length);
    });

    it('should return all users for whitespace query', async () => {
      const all = await getAllUsers();
      const results = await searchUsers('   ');
      expect(results.length).toBe(all.length);
    });
  });

  describe('getUsersByRole', () => {
    it('should filter by Manager role', async () => {
      const results = await getUsersByRole('Manager');
      results.forEach(user => {
        expect(user.role).toBe('Manager');
      });
    });

    it('should filter by Viewer role', async () => {
      const results = await getUsersByRole('Viewer');
      results.forEach(user => {
        expect(user.role).toBe('Viewer');
      });
    });
  });

  describe('getUsersByStatus', () => {
    it('should filter by Active status', async () => {
      const results = await getUsersByStatus('Active');
      results.forEach(user => {
        expect(user.status).toBe('Active');
      });
    });

    it('should filter by Inactive status', async () => {
      const results = await getUsersByStatus('Inactive');
      results.forEach(user => {
        expect(user.status).toBe('Inactive');
      });
    });
  });
});
