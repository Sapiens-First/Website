export function plural(count: number, word: string) {
  const label =
    count === 1
      ? word
      : word.endsWith("y")
        ? `${word.slice(0, -1)}ies`
        : word.endsWith("ch")
          ? `${word}es`
          : `${word}s`;
  return `${count} ${label}`;
}

export function lines(value: string) {
  return value
    .split(/\n|;\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}
