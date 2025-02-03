# Generator

Typescript functions for working with generators and async generators. Gives you
generator equivalents for the typical array-like combinators (map, filter,
reduce, flatten), plus a few more.

```typescript
import { map, mapAsync } from "@gordonb/generator";

const doubles = map([1, 2, 3], (n) => n * 2);
// Generator<number>

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

const doublesAsync = mapAsync(sleepyIter([1, 2, 3]), (n) => n * 2);
// AsyncGenerator<number>
```
