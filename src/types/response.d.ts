export type UserDetailsReponse = {
  full_name: string;
  email: string;
  created_date: string;
  user_type: string;
};

export type DatabaseResponse = {
  fullName: string;
  email: string;
  createdDate: string;
  userType: 'student' | 'teacher' | 'parent' | 'private tutor' | string;
};
