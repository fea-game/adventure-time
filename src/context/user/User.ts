import { eq } from "drizzle-orm";
import { err, ok, type Result } from "../../utils/Result";
import type { Database } from "../../database/getDatabase";
import { users } from "../../database/schema";

export class User {
  static async doesExist(
    id: User["id"],
    database: Database
  ): Promise<Result<boolean, Error>> {
    const result = await User.findById(id, database);

    if (result.isError) {
      return err(result.error);
    }

    return ok(result.value !== null);
  }

  static async create(
    newUser: Omit<User, "role"> & { emailAddress: string },
    database: Database
  ): Promise<Result<User, Error>> {
    const isExistsResult = await User.doesExist(newUser.id, database);

    if (isExistsResult.isError) {
      return err(isExistsResult.error);
    }

    if (isExistsResult.value) {
      return err(new Error("User already exists!"));
    }

    try {
      const values: User = {
        id: newUser.id,
        role:
          newUser.emailAddress === import.meta.env.ADMIN_USER_EMAIL
            ? "admin"
            : "member",
      };

      const result = await database.insert(users).values(values).returning();

      if (result.length === 1 && result[0]) {
        return ok(new User(result[0]));
      }

      throw new Error("No new user created!");
    } catch (e) {
      return err(
        new Error((e as Error).message ?? "Create new User failed!", {
          cause: e,
        })
      );
    }
  }

  static async findById(
    id: User["id"],
    database: Database
  ): Promise<Result<User | null, Error>> {
    try {
      const result = await database
        .select()
        .from(users)
        .where(eq(users.id, id));

      if (result.length === 1 && result[0]) {
        return ok(new User(result[0]));
      }

      return ok(null);
    } catch (e) {
      return err(
        new Error((e as Error).message ?? "Finding User by id failed!", {
          cause: e,
        })
      );
    }
  }

  static async all(database: Database): Promise<Result<User[], Error>> {
    try {
      const result = await database.select().from(users);

      return ok(result.map((user) => new User(user)));
    } catch (e) {
      return err(
        new Error((e as Error).message ?? "Listing Users failed!", { cause: e })
      );
    }
  }

  public readonly id: string;
  public readonly role: "admin" | "member";

  constructor(params: User) {
    this.id = params.id;
    this.role = params.role;
  }
}
