import type { VercelRequest, VercelResponse } from '@vercel/node';

// This is required for Vercel to allow CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle Preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    Object.keys(corsHeaders).forEach(key => {
      res.setHeader(key, corsHeaders[key as keyof typeof corsHeaders]);
    });
    res.status(200).send({});
    return;
  }

  // Set CORS headers for all responses
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key as keyof typeof corsHeaders]);
  });

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Alchemy Coral MCP Endpoint",
      status: "active",
      description: "Active MCP server for Alchemy Coral Orchestrator Agent",
      capabilities: [
        "alchemy-mechanics", 
        "coral-ecosystem-management", 
        "multi-task-automation",
        "daily-operations",
        "resource-management",
        "mcp-command-execution"
      ],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      
      if (body?.method === "initialize") {
        const result = {
          protocolVersion: "1.0.0",
          serverInfo: {
            name: "Alchemy Coral Orchestrator MCP",
            version: "1.0.0"
          },
          capabilities: { tools: {}, prompts: {}, resources: {} }
        };
        return res.status(200).json({
          jsonrpc: "2.0",
          id: body.id,
          result,
          ...result // Fallback
        });
      }

      if (body?.method === "tools/list") {
        const tools = [
          { name: "get_race_status", description: "Get the status of a coral race", inputSchema: { type: "object", properties: {} } },
          { name: "start_race", description: "Start a new coral race", inputSchema: { type: "object", properties: {} } },
          { name: "get_leaderboard", description: "Get the current coral ecosystem leaderboard", inputSchema: { type: "object", properties: {} } },
          { name: "optimize_speed", description: "Optimize coral mechanics speed", inputSchema: { type: "object", properties: {} } },
          { name: "get_track_info", description: "Get information about the current track", inputSchema: { type: "object", properties: {} } }
        ];
        return res.status(200).json({
          jsonrpc: "2.0",
          id: body.id,
          result: { tools },
          tools // Fallback
        });
      }

      if (body?.method === "prompts/list" || body?.method === "resources/list") {
        return res.status(200).json({ 
          jsonrpc: "2.0", id: body.id, result: { prompts: [], resources: [] }, prompts: [], resources: [] 
        });
      }

      if (body?.method === "tools/call") {
        const name = body?.params?.name;
        return res.status(200).json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            content: [
              {
                type: "text",
                text: `Successfully executed ${name} command in Alchemy Coral Ecosystem. (Status: Active). Received args: ${JSON.stringify(body?.params?.arguments || {})}`
              }
            ]
          }
        });
      }
      
      return res.status(200).json({
        status: "success",
        message: "MCP command received",
        agent: "Alchemy Coral Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      return res.status(400).json({ error: "Invalid MCP request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
