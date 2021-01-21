import { LinkedList } from '.';

export class Queue<T> {
  private data: LinkedList<T>;

  constructor() {
    this.data = new LinkedList();
  }

  get = (index: number): T | void => this.data.get(index);

  enqueue = (element: T): void => this.data.unshift(element);

  dequeue = (): T | void => this.data.pop();

  get size(): number {
    return this.data.size;
  }
}
