export class HashTable<T, K> {
  private keys: T[];
  private values: K[];
  private _size: number;

  constructor() {
    this.keys = [];
    this.values = [];
    this._size = 0;
  }

  get = (key: T): K | void => this.values[this.keys.indexOf(key)];

  put(key: T, element: K): void {
    const index = this.keys.indexOf(key);

    if (index > -1) {
      this.values[index] = element;
    } else {
      this.keys.push(key);
      this.values.push(element);
      this._size++;
    }
  }

  clear(): void {
    this.keys = [];
    this.values = [];
    this._size = 0;
  }

  get size(): number {
    return this._size;
  }
}
