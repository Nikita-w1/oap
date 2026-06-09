import { User } from "../types/models.js";

export const users: User[] = [
  {
    id: "1",
    name: "Olena",
    email: "olena@example.com",
    role: "Student",
    createdAt: new Date().toISOString(),
  },
];
