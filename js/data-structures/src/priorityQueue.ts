import { Queue } from '.';

enum Priority {
  Low = 1,
  Medium = 2,
  High = 3
}

export class PriorityQueue<T> {
  private data: Map<number, Queue<T>>;
  private _size: number;

  constructor() {
    this.data = new Map();

    for (let p = 0; p < 3; ++p) {
      this.data.set(p, new Queue());
    }

    this._size = 0;
  }

  enqueue(element: T, priority: Priority): void {
    this.data.get(priority - 1)?.enqueue(element);
    this._size++;
  }

  dequeue(): T | void {
    for (let p = 2; p >= 0; --p) {
      const element = this.data.get(p)?.dequeue();

      if (element !== undefined) {
        this._size = Math.max(this._size - 1, 0);

        return element;
      }
    }
  }

  get size(): number {
    return this._size;
  }
}
