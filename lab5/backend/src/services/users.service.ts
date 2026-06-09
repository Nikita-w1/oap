import { ApiError } from "../infrastructure/apiError.js";
import { requiredOneOf, requiredString } from "../infrastructure/validation.js";
import { usersRepository } from "../repositories/users.repository.js";
import { ValidationDetail } from "../types/common.js";
import { CreateUserDto, UpdateUserDto } from "../types/dto.js";
import { User, UserRole } from "../types/models.js";

const roles: UserRole[] = ["Student", "Teacher", "Admin"];

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

function validateId(id: string) {
  if (!Number.isInteger(Number(id))) throw new ApiError(400, "VALIDATION_ERROR", "id must be a number");
}

export async function getUsers() {
  const items = await usersRepository.getAll();
  return { items, total: items.length };
}

export async function getUserById(id: string) {
  validateId(id);
  const user = await usersRepository.findById(id);
  if (!user) throw new ApiError(404, "NOT_FOUND", "User not found");
  return user;
}

export async function createUser(dto: CreateUserDto): Promise<User> {
  validateCreate(dto);
  return usersRepository.create({
    name: dto.name.trim(),
    email: dto.email.trim(),
    role: dto.role,
    createdAt: new Date().toISOString(),
  });
}

export async function updateUser(id: string, dto: UpdateUserDto) {
  validateId(id);
  const roleError = dto.role !== undefined ? requiredOneOf(dto.role, "role", roles) : null;
  if (roleError) throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", [roleError]);

  const updated = await usersRepository.update(id, {
    name: dto.name?.trim(),
    email: dto.email?.trim(),
    role: dto.role,
  });
  if (!updated) throw new ApiError(404, "NOT_FOUND", "User not found");
  return updated;
}

export async function deleteUser(id: string) {
  validateId(id);
  const deleted = await usersRepository.delete(id);
  if (!deleted) throw new ApiError(404, "NOT_FOUND", "User not found");
}
