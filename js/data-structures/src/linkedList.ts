type Node<T> = {
  element?: T;
  prev?: Node<T>;
  next?: Node<T>;
};

export class LinkedList<T> {
  private head?: Node<T>;
  private tail?: Node<T>;
  private pointer: Node<T>;
  private _size: number;

  constructor() {
    this.head = {};
    this.tail = this.head;
    this.pointer = this.head;
    this._size = 0;
  }

  get(index: number): T | void {
    if (index < 0 || index >= this._size) {
      return;
    }

    let currentNode = this.head?.next;

    for (let i = index; i > 0; --i) {
      currentNode = currentNode?.next;
    }

    return currentNode?.element;
  }

  push(element: T): void {
    const newElement = {
      element: element,
      prev: this.tail
    };

    if (this.tail) {
      this.tail.next = newElement;
    }

    this.tail = newElement;

    if (this._size === 0) {
      if (this.head) {
        this.head.next = newElement;
      }

      this.pointer = newElement;
    }

    this._size++;
  }

  pop(): T | void {
    if (this._size === 0) {
      return;
    }

    const element = this.pointer === this.tail ? this.prev() : this.tail?.element;
    this.tail = this.tail?.prev;

    if (this.tail) {
      this.tail.next = undefined;
    }

    this._size--;

    return element;
  }

  unshift(element: T): void {
    if (this._size) {
      const newElement = {
        element: element,
        prev: this.head,
        next: this.head?.next
      };

      if (this.head && this.head.next) {
        this.head.next.prev = newElement;
        this.head.next = newElement;
      }

      this._size++;
    } else {
      this.push(element);
    }
  }

  shift(): T | void {
    if (this._size === 0) {
      return;
    }

    const element = this.pointer.prev === this.head ? this.next() : this.head?.next?.element;
    this.head = this.head?.next;
    this._size--;

    return element;
  }

  prev(): T | void {
    if (this._size === 0) {
      return;
    }

    const element = this.pointer.element;

    if (this.pointer.prev && this.pointer.prev !== this.head) {
      this.pointer = this.pointer.prev;
    }

    return element;
  }

  next(): T | void {
    if (this._size === 0) {
      return;
    }

    const element = this.pointer.element;

    if (this.pointer.next) {
      this.pointer = this.pointer.next;
    }

    return element;
  }

  get size(): number {
    return this._size;
  }
}
