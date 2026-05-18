import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json({
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
  }, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (body?.method === "initialize") {
      const result = {
        protocolVersion: "1.0.0",
        serverInfo: {
          name: "Alchemy Coral Orchestrator MCP",
          version: "1.0.0"
        },
        capabilities: { tools: {}, prompts: {}, resources: {} }
      };
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result,
        ...result // Fallback for simple REST clients
      }, { headers: corsHeaders });
    }

    if (body?.method === "tools/list") {
      const tools = [
        { name: "get_race_status", description: "Get the status of a coral race", inputSchema: { type: "object", properties: {} } },
        { name: "start_race", description: "Start a new coral race", inputSchema: { type: "object", properties: {} } },
        { name: "get_leaderboard", description: "Get the current coral ecosystem leaderboard", inputSchema: { type: "object", properties: {} } },
        { name: "optimize_speed", description: "Optimize coral mechanics speed", inputSchema: { type: "object", properties: {} } },
        { name: "get_track_info", description: "Get information about the current track", inputSchema: { type: "object", properties: {} } }
      ];
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: { tools },
        tools // Fallback for simple REST clients
      }, { headers: corsHeaders });
    }

    if (body?.method === "prompts/list" || body?.method === "resources/list") {
      return NextResponse.json({ 
        jsonrpc: "2.0", id: body.id, result: { prompts: [], resources: [] }, prompts: [], resources: [] 
      }, { headers: corsHeaders });
    }

    if (body?.method === "tools/call") {
      const name = body?.params?.name;
      return NextResponse.json({
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
      }, { headers: corsHeaders });
    }
    
    return NextResponse.json({
      status: "success",
      message: "MCP command received",
      agent: "Alchemy Coral Orchestrator",
      receivedAt: new Date().toISOString(),
      payload: body
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: "Invalid MCP request" }, { status: 400, headers: corsHeaders });
  }
}
