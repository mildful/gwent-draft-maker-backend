export default interface Hash {
  hash(input: string): Promise<string>;
  compare(plainText: string, hash: string): Promise<boolean>;
}