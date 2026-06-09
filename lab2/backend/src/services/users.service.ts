import { ApiError } from "../infrastructure/apiError.js";
import { requiredOneOf, requiredString } from "../infrastructure/validation.js";
import { usersRepository } from "../repositories/users.repository.js";
import { ValidationDetail } from "../types/common.js";
import { CreateUserDto, UpdateUserDto } from "../types/dto.js";
import { User, UserRole } from "../types/models.js";

const roles: UserRole[] = ["Student", "Teacher", "Admin"];

function generateId() {
  return Date.now().toString();
}

function validateCreate(dto: CreateUserDto) {
  const errors: ValidationDetail[] = [];
  const nameError = requiredString(dto.name, "name", 2);
  const emailError = requiredString(dto.email, "email", 5);
  const roleError = requiredOneOf(dto.role, "role", roles);

  if (nameError) errors.push(nameError);
  if (emailError) errors.push(emailError);
  if (roleError) errors.push(roleError);
  if (errors.length) throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
}

export function getUsers() {
  const items = usersRepository.getAll();
  return { items, total: items.length };
}

export function getUserById(id: string) {
  const user = usersRepository.findById(id);
  if (!user) throw new ApiError(404, "NOT_FOUND", "User not found");
  return user;
}

export function createUser(dto: CreateUserDto): User {
  validateCreate(dto);

  const user: User = {
    id: generateId(),
    name: dto.name.trim(),
    email: dto.email.trim(),
    role: dto.role,
    createdAt: new Date().toISOString(),
  };

  return usersRepository.create(user);
}

export function updateUser(id: string, dto: UpdateUserDto) {
  const user = getUserById(id);

  if (dto.name !== undefined) user.name = dto.name.trim();
  if (dto.email !== undefined) user.email = dto.email.trim();
  if (dto.role !== undefined) user.role = dto.role;

  return user;
}

export function deleteUser(id: string) {
  const deleted = usersRepository.delete(id);
  if (!deleted) throw new ApiError(404, "NOT_FOUND", "User not found");
}
