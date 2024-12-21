import type { Result } from "./Result";

export interface Repository<T extends { id: number | string }> {
  findById(id: T["id"]): Promise<Result<T | null, Error>>;
  doesExist(id: T["id"]): Promise<Result<boolean, Error>>;
  all(userId?: string): Promise<Result<T[], Error>>;
}
