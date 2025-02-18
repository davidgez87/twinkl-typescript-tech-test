export type SignUpPayload = {
  fullName: string;
  email: string;
  password: string;
  createdDate: string;
  userType: 'student' | 'teacher' | 'parent' | 'private tutor';
};
