export type ErrorResult<E> = {
  isError: true;
  isOk: false;
  error: E;
};

export type OkResult<T> = {
  isError: false;
  isOk: true;
  value: T;
};

export type Result<T, E> = ErrorResult<E> | OkResult<T>;

export function err<E>(error: E): ErrorResult<E> {
  return { error, isError: true, isOk: false };
}

export function ok<T>(value: T): OkResult<T> {
  return { value, isError: false, isOk: true };
}
