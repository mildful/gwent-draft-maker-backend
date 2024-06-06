export default interface AuthProvider {
  verifyToken(token: string): Promise<string>;
}