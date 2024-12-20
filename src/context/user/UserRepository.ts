import { users, UserSelectSchema, type User as UserRow } from "../../database/schema/users";
import { SqliteRepository } from "../../database/SqliteRepository";
import { assertIsValid } from "../../utils/validation";

export type User = {
  readonly id: string;
  readonly role: "admin" | "member";
};

export class UserRepository extends SqliteRepository<User> {
  constructor() {
    super(users, UserRepository.fromRow);
  }

  private static fromRow(row: any): User {
    assertIsValid<UserRow>(row, UserSelectSchema);

    const user: User = {
      id: row.id,
      role: row.role,
    };

    return user;
  }
}
