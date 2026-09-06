import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const isProd = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const envSecret = process.env.JWT_SECRET;
if (!envSecret && isProd) {
  throw new Error('JWT_SECRET environment variable is required in production');
}
const SECRET = envSecret ?? 'gmc-dev-secret';
const TOKEN_TTL = '7d';

export function signToken(username: string): string {
  return jwt.sign({ username }, SECRET, { expiresIn: TOKEN_TTL } as jwt.SignOptions);
}

function readToken(req: Request): string | null {
  const cookie = (req.cookies?.token as string | undefined) ?? '';
  if (cookie) return cookie;
  const auth = req.headers.authorization ?? '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = readToken(req);
  if (!token) {
    res.status(401).json({ ok: false, error: 'unauthorized' });
    return;
  }
  try {
    const payload = jwt.verify(token, SECRET) as { username: string };
    (req as Request & { admin?: string }).admin = payload.username;
    next();
  } catch {
    res.status(401).json({ ok: false, error: 'invalid session' });
  }
}