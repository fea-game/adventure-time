import { users, type User as UserRow } from "../../database/schema/users";
import { SqliteRepository } from "../../database/SqliteRepository";
import { isStringPresent, required } from "../../utils/validation";

export type User = {
  readonly id: string;
  readonly role: "admin" | "member";
};

export class UserRepository extends SqliteRepository<User> {
  constructor() {
    super(users, UserRepository.fromRow);
  }

  private static fromRow(row: any): User {
    if (!UserRepository.isUserRow(row))
      throw new Error("Mapping record to Entity failed!", { cause: row });

    const user: User = {
      id: row.id,
      role: row.role,
    };

    return user;
  }

  private static isUserRow(row: unknown): row is UserRow {
    if (!row || typeof row !== "object") return false;
    if (!required(row, "id", isStringPresent)) return false;
    if (!required(row, "role", isStringPresent)) return false;
    if (!(row.role === "admin" || row.role === "member")) return false;

    return true;
  }
}
