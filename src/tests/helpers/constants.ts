/* eslint-disable object-curly-newline */
const validationTestCases = [
  { field: 'fullName', value: '', expectedField: 'fullName', description: 'should return 400 if fullName is empty' },
  { field: 'email', value: '', expectedField: 'email', description: 'should return 400 if email is empty' },
  { field: 'email', value: 'incorrectemail.com', expectedField: 'email', description: 'should return 400 if email is invalid' },
  { field: 'password', value: '', expectedField: 'password', description: 'should return 400 if password is empty' },
  { field: 'password', value: '123', expectedField: 'password', description: 'should return 400 if password is too short' },
  { field: 'password', value: 'a'.repeat(65), expectedField: 'password', description: 'should return 400 if password exceeds max length' },
  { field: 'password', value: 'PasswordNoNumbers', expectedField: 'password', description: 'should return 400 if password lacks digits' },
  { field: 'password', value: '12345678', expectedField: 'password', description: 'should return 400 if password lacks letters' },
  { field: 'password', value: 'password123', expectedField: 'password', description: 'should return 400 if password lacks uppercase letter' },
  { field: 'password', value: 'PASSWORD123', expectedField: 'password', description: 'should return 400 if password lacks lowercase letter' },
  { field: 'createdDate', value: '', expectedField: 'createdDate', description: 'should return 400 if createdDate is empty' },
  { field: 'userType', value: '', expectedField: 'userType', description: 'should return 400 if userType is empty' },
  { field: 'userType', value: 'invalidType', expectedField: 'userType', description: 'should return 400 if userType is invalid' },
];

export default validationTestCases;
