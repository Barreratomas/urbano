export default interface UserQuery {
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
