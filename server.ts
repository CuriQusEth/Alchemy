import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from 'url';
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Alchemy Coral Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Alchemy Coral",
      version: "1.0.0"
    });
  });

  app.post("/api/agent", (req, res) => {
    res.json({
      status: "success",
      message: "Agent received request",
      receivedAt: new Date().toISOString(),
      payload: req.body
    });
  });

  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Alchemy Coral MCP Endpoint",
      status: "active",
      description: "Active MCP server for Alchemy Coral Orchestrator Agent",
      capabilities: ["alchemy-mechanics", "coral-ecosystem-management", "resource-management", "multi-task-automation", "daily-operations", "mcp-command-execution"],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      
      if (body?.method === "initialize") {
        return res.json({
          protocolVersion: "1.0.0",
          serverInfo: {
            name: "Alchemy Coral Orchestrator MCP",
            version: "1.0.0"
          },
          capabilities: { tools: {}, prompts: {}, resources: {} }
        });
      }

      if (body?.method === "tools/list") {
        return res.json({
          tools: [
            { name: "get_race_status", description: "Get the status of a coral race" },
            { name: "start_race", description: "Start a new coral race" },
            { name: "get_leaderboard", description: "Get the current coral ecosystem leaderboard" },
            { name: "optimize_speed", description: "Optimize coral mechanics speed" },
            { name: "get_track_info", description: "Get information about the current track" }
          ]
        });
      }

      if (body?.method === "prompts/list" || body?.method === "resources/list") {
        return res.json({ prompts: [], resources: [] });
      }

      if (body?.method === "tools/call") {
        const name = body?.params?.name;
        return res.json({
          content: [
            {
              type: "text",
              text: `Successfully executed ${name} command in Alchemy Coral Ecosystem. (Status: Active). Received args: ${JSON.stringify(body?.params?.arguments || {})}`
            }
          ]
        });
      }

      res.json({
        status: "success",
        message: "MCP command received",
        agent: "Alchemy Coral Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
