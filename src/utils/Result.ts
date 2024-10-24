export type ErrorResult<E> = {
  isError: true;
  isSuccess: false;
  error: E;
};

export type SuccessResult<T> = {
  isError: false;
  isSuccess: true;
  data: T;
};

export type Result<T, E> = ErrorResult<E> | SuccessResult<T>;

export function err<E>(error: E): ErrorResult<E> {
  return { error, isError: true, isSuccess: false };
}

export function ok<T>(data: T): SuccessResult<T> {
  return { data, isError: false, isSuccess: true };
}
