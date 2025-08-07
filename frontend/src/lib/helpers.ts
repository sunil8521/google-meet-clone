function generateCode(): string {
  const randomPart = () =>
    Array.from({ length: 3 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    ).join("");
  return `${randomPart()}-${randomPart()}-${randomPart()}`;
}
export { generateCode };
