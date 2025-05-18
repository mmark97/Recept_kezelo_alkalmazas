export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type NewUser = Omit<User, 'id'>;
