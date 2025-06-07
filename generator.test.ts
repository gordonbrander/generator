import { assertEquals } from "@std/assert";
import {
  dedupe,
  dedupeAsync,
  filter,
  filterAsync,
  filterMap,
  filterMapAsync,
  flatMap,
  flatMapAsync,
  flatten,
  flattenAsync,
  map,
  mapAsync,
  reduce,
  reduceAsync,
  scan,
  scanAsync,
  take,
  takeAsync,
  takeWhile,
  takeWhileAsync,
  toAsync,
} from "./generator.ts";

Deno.test("map transforms values", () => {
  const numbers = [1, 2, 3];
  const doubled = [...map(numbers, (n) => n * 2)];
  assertEquals(doubled, [2, 4, 6]);
});

Deno.test("filter keeps matching values", () => {
  const numbers = [1, 2, 3, 4, 5];
  const evens = [...filter(numbers, (n) => n % 2 === 0)];
  assertEquals(evens, [2, 4]);
});

Deno.test("reduce accumulates values", () => {
  const numbers = [1, 2, 3, 4];
  const sum = reduce(numbers, (acc, n) => acc + n, 0);
  assertEquals(sum, 10);
});

Deno.test("scan yields intermediate results", () => {
  const numbers = [1, 2, 3];
  const sums = [...scan(numbers, (acc, n) => acc + n, 0)];
  assertEquals(sums, [0, 1, 3, 6]);
});

Deno.test("flatten combines nested iterables", () => {
  const nested = [[1, 2], [3, 4], [5]];
  const flat = [...flatten(nested)];
  assertEquals(flat, [1, 2, 3, 4, 5]);
});

Deno.test("flatMap transforms and flattens", () => {
  const numbers = [1, 2, 3];
  const duplicated = [...flatMap(numbers, (n) => [n, n])];
  assertEquals(duplicated, [1, 1, 2, 2, 3, 3]);
});

Deno.test("filterMap transforms and filters nulls", () => {
  const numbers = [1, 2, 3, 4];
  const evenDoubles = [
    ...filterMap(numbers, (n) => (n % 2 === 0 ? n * 2 : null)),
  ];
  assertEquals(evenDoubles, [4, 8]);
});

Deno.test("take limits output length", () => {
  const numbers = [1, 2, 3, 4, 5];
  const taken = [...take(numbers, 3)];
  assertEquals(taken, [1, 2, 3]);
});

Deno.test("takeWhile takes until predicate fails", () => {
  const numbers = [1, 2, 3, 4, 5];
  const lessThanFour = [...takeWhile(numbers, (n) => n < 4)];
  assertEquals(lessThanFour, [1, 2, 3]);
});

Deno.test("dedupe removes duplicate values based on key", async () => {
  const input = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "1", name: "Alice (duplicate)" },
    { id: "3", name: "Charlie" },
    { id: "2", name: "Bob (duplicate)" },
  ];

  const result = [];
  for await (const item of dedupe(input, (value) => value.id)) {
    result.push(item);
  }

  assertEquals(result, [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Charlie" },
  ]);
});

const sleep = <T>(value: T, ms: number): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, ms);
  });

async function* sleepyIter<T>(values: Iterable<T>): AsyncGenerator<T> {
  for (const n of values) {
    yield await sleep(n, 1);
  }
}

Deno.test("mapAsync transforms values asynchronously", async () => {
  const numbers = [1, 2, 3];
  const doubled = await Array.fromAsync(
    mapAsync(sleepyIter(numbers), (n) => n * 2),
  );
  assertEquals(doubled, [2, 4, 6]);
});

Deno.test("filterAsync keeps matching values asynchronously", async () => {
  const numbers = [1, 2, 3, 4, 5];
  const evens = await Array.fromAsync(
    filterAsync(sleepyIter(numbers), (n) => n % 2 === 0),
  );
  assertEquals(evens, [2, 4]);
});

Deno.test("reduceAsync accumulates values asynchronously", async () => {
  const numbers = [1, 2, 3, 4];
  const sum = await reduceAsync(sleepyIter(numbers), (acc, n) => acc + n, 0);
  assertEquals(sum, 10);
});

Deno.test("scanAsync yields intermediate results asynchronously", async () => {
  const numbers = [1, 2, 3];
  const sums = await Array.fromAsync(
    scanAsync(sleepyIter(numbers), (acc, n) => acc + n, 0),
  );
  assertEquals(sums, [0, 1, 3, 6]);
});

Deno.test("flattenAsync combines nested async iterables", async () => {
  const nested = [[1, 2], [3, 4], [5]].map(sleepyIter);
  const flat = await Array.fromAsync(flattenAsync(nested));
  assertEquals(flat, [1, 2, 3, 4, 5]);
});

Deno.test("flatMapAsync transforms and flattens asynchronously", async () => {
  const numbers = [1, 2, 3];
  const duplicated = await Array.fromAsync(
    flatMapAsync(sleepyIter(numbers), (n) => sleepyIter([n, n])),
  );
  assertEquals(duplicated, [1, 1, 2, 2, 3, 3]);
});

Deno.test(
  "filterMapAsync transforms and filters nulls asynchronously",
  async () => {
    const numbers = [1, 2, 3, 4];
    const evenDoubles = await Array.fromAsync(
      filterMapAsync(sleepyIter(numbers), (n) => (n % 2 === 0 ? n * 2 : null)),
    );
    assertEquals(evenDoubles, [4, 8]);
  },
);

Deno.test("takeAsync limits output length asynchronously", async () => {
  const numbers = [1, 2, 3, 4, 5];
  const taken = await Array.fromAsync(takeAsync(sleepyIter(numbers), 3));
  assertEquals(taken, [1, 2, 3]);
});

Deno.test(
  "takeWhileAsync takes until predicate fails asynchronously",
  async () => {
    const numbers = [1, 2, 3, 4, 5];
    const lessThanFour = await Array.fromAsync(
      takeWhileAsync(sleepyIter(numbers), (n) => n < 4),
    );
    assertEquals(lessThanFour, [1, 2, 3]);
  },
);

Deno.test(
  "dedupeAsync removes duplicate values based on key asynchronously",
  async () => {
    const input = [
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
      { id: "1", name: "Alice (duplicate)" },
      { id: "3", name: "Charlie" },
      { id: "2", name: "Bob (duplicate)" },
    ];

    const result = await Array.fromAsync(
      dedupeAsync(sleepyIter(input), (value) => value.id),
    );

    assertEquals(result, [
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
      { id: "3", name: "Charlie" },
    ]);
  },
);

Deno.test("toAsync converts sync iterable to async generator", async () => {
  const numbers = [1, 2, 3, 4, 5];
  const gen = toAsync(numbers);
  assertEquals(typeof gen[Symbol.asyncIterator], "function");
  const asyncNumbers = await Array.fromAsync(gen);
  assertEquals(asyncNumbers, [1, 2, 3, 4, 5]);
});
