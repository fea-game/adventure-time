import { and, eq } from "drizzle-orm";
import { err, ok, type Result } from "../../utils/Result";
import type { Database } from "../../database/getDatabase";
import { users } from "../../database/schema";

export class User {
  static isWithId<T extends Partial<User>>(user: T): user is WithId<T> {
    return !!user.id?.length;
  }

  static isWithExternalId<T extends Partial<User>>(
    user: T
  ): user is WithExternalId<T> {
    return !!user.externalSystem?.length && !!user.externalId?.length;
  }

  static async doesExist<T extends Partial<User>>(
    user: T,
    database: Database
  ): Promise<Result<boolean, Error>> {
    if (User.isWithId(user)) {
      const result = await User.findById(user, database);

      if (result.isError) {
        return err(result.error);
      }

      return ok(result.data !== null);
    }

    if (User.isWithExternalId(user)) {
      const result = await User.findByExternalId(user, database);

      if (result.isError) {
        return err(result.error);
      }

      return ok(result.data !== null);
    }

    return err(new Error("User is not identifiable!"));
  }

  static async create(
    newUser: Omit<NewUser, "role"> & { emailAddress: string },
    database: Database
  ): Promise<Result<User, Error>> {
    const isExistsResult = await User.doesExist(newUser, database);

    if (isExistsResult.isError) {
      return err(isExistsResult.error);
    }

    if (isExistsResult.data) {
      return err(new Error("User already exists!"));
    }

    try {
      const values: NewUser = {
        role:
          newUser.emailAddress === import.meta.env.ADMIN_USER_EMAIL
            ? "admin"
            : "member",
        externalId: newUser.externalId,
        externalSystem: newUser.externalSystem,
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
    params: WithId<{}>,
    database: Database
  ): Promise<Result<User | null, Error>> {
    try {
      const result = await database
        .select()
        .from(users)
        .where(eq(users.id, params.id));

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

  static async findByExternalId(
    params: WithExternalId<{}>,
    database: Database
  ): Promise<Result<User | null, Error>> {
    try {
      const result = await database
        .select()
        .from(users)
        .where(
          and(
            eq(users.externalSystem, params.externalSystem),
            eq(users.externalId, params.externalId)
          )
        );

      if (result.length === 1 && result[0]) {
        return ok(new User(result[0]));
      }

      return ok(null);
    } catch (e) {
      return err(
        new Error(
          (e as Error).message ?? "Finding User by external id failed!",
          { cause: e }
        )
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
  public readonly externalId: string;
  public readonly externalSystem: "clerk";

  constructor(params: Omit<User, "database">) {
    this.id = params.id;
    this.role = params.role;
    this.externalId = params.externalId;
    this.externalSystem = params.externalSystem;
  }
}

export type NewUser = Omit<User, "id">;
export type WithId<T extends Partial<User>> = T & Pick<User, "id">;
export type WithExternalId<T extends Partial<User>> = T &
  Pick<User, "externalSystem" | "externalId">;
export type IdentifiableUser<T extends Partial<User>> = T &
  (WithId<T> | WithExternalId<T>);
