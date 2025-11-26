// backend/familyAuth.ts

import type { Request, Response, NextFunction } from 'express';

const FAMILY_API_KEY = process.env.FAMILY_API_KEY;

if (!FAMILY_API_KEY) {
  console.warn(
    '[Veckopeng] WARNING: FAMILY_API_KEY is not set.\n' +
      'API is running WITHOUT auth. Set FAMILY_API_KEY in your environment to protect the API.'
  );
}

/**
 * Simple middleware that enforces a shared "family key" sent as `x-family-key`.
 * If FAMILY_API_KEY is not configured, the middleware is effectively disabled (dev mode).
 */
export function requireFamilyKey(req: Request, res: Response, next: NextFunction) {
  // Dev/unsecured mode – no key configured
  if (!FAMILY_API_KEY) {
    return next();
  }

  const headerKey = req.header('x-family-key');

  if (!headerKey) {
    return res.status(401).json({ error: 'Missing family key' });
  }

  if (headerKey !== FAMILY_API_KEY) {
    return res.status(403).json({ error: 'Invalid family key' });
  }

  return next();
}
