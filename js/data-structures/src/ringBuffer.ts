import { LinkedList } from '.';

export class RingBuffer<T> {
  private data: LinkedList<T>;
  private _capacity: number;

  constructor(capacity: number) {
    this.data = new LinkedList();
    this._capacity = capacity;
  }

  get = (index: number): T | void => this.data.get(index);

  push(element: T): void {
    if (this._capacity !== 0) {
      if (this.data.size === this._capacity) {
        this.data.shift();
      }

      this.data.push(element);
    }
  }

  shift = (): T | void => this.data.shift();

  static concat<K>(...buffers: RingBuffer<K | void>[]): RingBuffer<K | void> {
    const concated = new RingBuffer<K | void>(
      buffers.reduce((acc, buffer) => acc + buffer.capacity, 0)
    );

    buffers.forEach(buffer => {
      for (let i = 0; i < buffer.size; ++i) {
        concated.push(buffer.get(i));
      }
    });

    return concated;
  }

  get capacity(): number {
    return this._capacity;
  }

  get size(): number {
    return this.data.size;
  }
}
