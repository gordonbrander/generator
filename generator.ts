/**
 * Generator utility functions for iterating over sequences
 */

/**
 * Maps each value in the iterator through a transform function
 */
export function* map<T, U>(
  iter: Iterable<T>,
  fn: (value: T) => U,
): Generator<U> {
  for (const value of iter) {
    yield fn(value);
  }
}

/**
 * Filters values from the iterator that match the predicate
 */
export function* filter<T>(
  iter: Iterable<T>,
  predicate: (value: T) => boolean,
): Generator<T> {
  for (const value of iter) {
    if (predicate(value)) {
      yield value;
    }
  }
}

/**
 * Reduces an iterator to a single value using an accumulator function
 */
export function reduce<T, U>(
  iter: Iterable<T>,
  fn: (acc: U, value: T) => U,
  initial: U,
): U {
  let result = initial;
  for (const value of iter) {
    result = fn(result, value);
  }
  return result;
}

/**
 * Like reduce but yields intermediate results
 */
export function* scan<T, U>(
  iter: Iterable<T>,
  fn: (acc: U, value: T) => U,
  initial: U,
): Generator<U> {
  let acc = initial;
  yield acc;
  for (const value of iter) {
    acc = fn(acc, value);
    yield acc;
  }
}

/**
 * Concatenate multiple async or sync iterables
 */
export function* concat<T>(
  ...iter: Iterable<T>[]
): Generator<T, void, undefined> {
  for (const inner of iter) {
    yield* inner;
  }
}

/**
 * Flattens an iterator of iterables into a single iterator
 */
export function* flatten<T>(
  iter: Iterable<Iterable<T>>,
): Generator<T, void, undefined> {
  for (const inner of iter) {
    yield* inner;
  }
}

/**
 * Maps values and flattens the results
 */
export function* flatMap<T, U>(
  iter: Iterable<T>,
  fn: (value: T) => Iterable<U>,
): Generator<U, void, undefined> {
  for (const value of iter) {
    yield* fn(value);
  }
}

/**
 * Maps values and filters out null/undefined results
 */
export function* filterMap<T, U>(
  iter: Iterable<T>,
  fn: (value: T) => U | null | undefined,
): Generator<U> {
  for (const value of iter) {
    const result = fn(value);
    if (result != null) {
      yield result;
    }
  }
}

/**
 * Takes n items from the iterator
 */
export function* take<T>(iter: Iterable<T>, n: number): Generator<T> {
  let count = 0;
  for (const value of iter) {
    if (count >= n) break;
    yield value;
    count++;
  }
}

/**
 * Takes values while predicate returns true
 */
export function* takeWhile<T>(
  iter: Iterable<T>,
  predicate: (value: T) => boolean,
): Generator<T> {
  for (const value of iter) {
    if (!predicate(value)) break;
    yield value;
  }
}

export function* dedupe<T>(
  iter: Iterable<T>,
  getKey: (value: T) => string,
): Generator<T> {
  const seen: Set<string> = new Set();
  for (const value of iter) {
    const key = getKey(value);
    if (!seen.has(key)) {
      seen.add(key);
      yield value;
    }
  }
}

export type Awaitable<T> = Promise<T> | T;
export type AwaitableIterable<T, TReturn = unknown, TNext = unknown> =
  | AsyncIterable<T, TReturn, TNext>
  | Iterable<T, TReturn, TNext>;

/** Transform an iterable into an async generator */
export async function* toAsync<T>(iter: Iterable<T>): AsyncGenerator<T> {
  for await (const value of iter) {
    yield value;
  }
}

/**
 * Maps values asynchronously
 */
export async function* mapAsync<T, U>(
  iter: AwaitableIterable<T>,
  fn: (value: T) => Awaitable<U>,
): AsyncGenerator<U> {
  for await (const value of iter) {
    yield await fn(value);
  }
}

/**
 * Filters values asynchronously
 */
export async function* filterAsync<T>(
  iter: AwaitableIterable<T>,
  predicate: (value: T) => Awaitable<boolean>,
): AsyncGenerator<T> {
  for await (const value of iter) {
    if (await predicate(value)) {
      yield value;
    }
  }
}

/**
 * Reduces an awaitable iterator to a single value using an accumulator function
 * @returns a promise for the result
 */
export async function reduceAsync<T, U>(
  iter: AwaitableIterable<T>,
  fn: (acc: U, value: T) => Awaitable<U>,
  initial: U,
): Promise<U> {
  let result = initial;
  for await (const value of iter) {
    result = await fn(result, value);
  }
  return result;
}

/**
 * Like reduce but yields intermediate results
 * @returns an async generator for the intermediate results
 */
export async function* scanAsync<T, U>(
  iter: AwaitableIterable<T>,
  fn: (acc: U, value: T) => Awaitable<U>,
  initial: U,
): AsyncGenerator<U> {
  let acc = initial;
  yield acc;
  for await (const value of iter) {
    acc = await fn(acc, value);
    yield acc;
  }
}

/** Concatenate multiple async or sync iterables */
export async function* concatAsync<T>(
  ...iterables: AwaitableIterable<T>[]
): AsyncGenerator<T, void, undefined> {
  for await (const iterable of iterables) {
    yield* iterable;
  }
}

/**
 * Flattens nested async iterables
 */
export async function* flattenAsync<T>(
  iter: AwaitableIterable<AwaitableIterable<T>>,
): AsyncGenerator<T, void, undefined> {
  for await (const inner of iter) {
    yield* inner;
  }
}

/**
 * Maps values asynchronously and flattens the results
 */
export async function* flatMapAsync<T, U>(
  iter: AwaitableIterable<T>,
  fn: (value: T) => AwaitableIterable<U>,
): AsyncGenerator<U, void, undefined> {
  for await (const value of iter) {
    yield* fn(value);
  }
}

/**
 * Maps values asynchronously and filters out null/undefined results
 */
export async function* filterMapAsync<T, U>(
  iter: AwaitableIterable<T>,
  fn: (value: T) => Awaitable<U | null | undefined>,
): AsyncGenerator<U> {
  for await (const value of iter) {
    const result = await fn(value);
    if (result != null) {
      yield result;
    }
  }
}

/**
 * Takes n items from the async iterator
 */
export async function* takeAsync<T>(
  iter: AwaitableIterable<T>,
  n: number,
): AsyncGenerator<T> {
  let count = 0;
  for await (const value of iter) {
    if (count >= n) break;
    yield value;
    count++;
  }
}

/**
 * Takes values while async predicate returns true
 */
export async function* takeWhileAsync<T>(
  iter: AwaitableIterable<T>,
  predicate: (value: T) => Awaitable<boolean>,
): AsyncGenerator<T> {
  for await (const value of iter) {
    if (!(await predicate(value))) break;
    yield value;
  }
}

export async function* dedupeAsync<T>(
  iter: AwaitableIterable<T>,
  getKey: (value: T) => string,
): AsyncGenerator<T> {
  const seen: Set<string> = new Set();
  for await (const value of iter) {
    const key = getKey(value);
    if (!seen.has(key)) {
      seen.add(key);
      yield value;
    }
  }
}
