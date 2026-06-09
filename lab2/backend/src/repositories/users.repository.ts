import { users } from "../store/users.store.js";
import { User } from "../types/models.js";

export const usersRepository = {
  getAll(): User[] {
    return users;
  },
  findById(id: string): User | undefined {
    return users.find((item) => item.id === id);
  },
  create(user: User): User {
    users.push(user);
    return user;
  },
  delete(id: string): boolean {
    const index = users.findIndex((item) => item.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
};
