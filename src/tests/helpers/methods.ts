interface UserData {
  fullName?: string;
  email?: string;
  password?: string;
  createdDate?: string;
  userType?: string;
}

const buildUserData = (overrides: UserData = {}) => ({
  fullName: 'David Geraghty',
  email: `e2e_test_${Date.now()}@email.com`,
  password: 'Password123!',
  createdDate: '2024-02-25',
  userType: 'student',
  ...overrides,
});

export default buildUserData;
