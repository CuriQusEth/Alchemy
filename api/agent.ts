import type { VercelRequest, VercelResponse } from '@vercel/node';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    Object.keys(corsHeaders).forEach(key => {
      res.setHeader(key, corsHeaders[key as keyof typeof corsHeaders]);
    });
    res.status(200).send({});
    return;
  }

  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key as keyof typeof corsHeaders]);
  });

  if (req.method === 'GET') {
    return res.status(200).json({
      name: "Alchemy Coral Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Alchemy Coral",
      version: "1.0.0"
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      return res.status(200).json({
        status: "success",
        message: "Agent received request",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      return res.status(400).json({ error: "Invalid Agent request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
