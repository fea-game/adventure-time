import { eq } from "drizzle-orm/sqlite-core/expressions";
import { getDatabase, type Database } from "./getDatabase";
import type { Repository } from "../utils/Repository";
import { err, ok, type Result } from "../utils/Result";

export abstract class SqliteRepository<T extends { id: number | string }>
  implements Repository<T>
{
  protected database: Database;
  protected table: any;
  protected fromRow: (row: any) => T;

  constructor(table: any, fromRow: (row: any) => T) {
    const databaseResult = getDatabase();
    if (databaseResult.isError) {
      throw new Error(databaseResult.error.message, { cause: databaseResult.error });
    }

    this.database = databaseResult.value;
    this.table = table;
    this.fromRow = fromRow;
  }

  async findById(id: T["id"]): Promise<Result<T | null, Error>> {
    try {
      const result = await this.database
        .select()
        .from(this.table)
        .where(eq(this.table.id, id));

      if (result.length === 1 && result[0]) {
        return ok(this.fromRow(result[0]));
      }
      return ok(null);
    } catch (e) {
      return err(
        new Error((e as Error).message ?? "Finding by ID failed!", { cause: e })
      );
    }
  }

  async doesExist(id: T["id"]): Promise<Result<boolean, Error>> {
    const result = await this.findById(id);
    if (result.isError) {
      return err(result.error);
    }
    return ok(result.value !== null);
  }

  async all(userId?: string): Promise<Result<T[], Error>> {
    try {
      if (!!userId?.length) {
        const result = await this.database.select().from(this.table).where(eq(this.table.userId, userId));
        return ok(result.map(this.fromRow));
      }

      const result = await this.database.select().from(this.table);
      return ok(result.map(this.fromRow));
    } catch (e) {
      return err(
        new Error((e as Error).message ?? "Listing all records failed!", {
          cause: e,
        })
      );
    }
  }
}
