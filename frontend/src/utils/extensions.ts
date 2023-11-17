declare global {
  interface Array<T> {
    toShuffle(): Array<T>;
  }
}

if (!Array.prototype.toShuffle) {
  Array.prototype.toShuffle = function (this) {
    const result = [...this];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
}

export {};
