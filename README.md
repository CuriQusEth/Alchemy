# Alchemy Coral Orchestrator
## About Alchemist Coral Orchestrator

**Alchemy Coral Orchestrator** is an AI Agent that runs on the Alchemy Coral platform, managing ecosystem mechanics and facilitating cross-agent communication. Built as an **ERC-8004** compliant agent, it connects seamlessly with the wider web3 platform to execute automated daily operations.

### 🧪 Project Overview
- **Alchemy Mechanics:** Specialized agent for handling complex logic and system dynamics.
- **Coral Ecosystem Management:** Oversees and manages the coral ecosystem resources and components.
- **Multi-task Automation:** Efficiently organizes and automates routine chores and advanced mechanics.
- **MCP Command Execution:** Fully implements the Model Context Protocol (MCP) to allow active command execution.
- **Agent-to-Agent (A2A):** Communicates securely and reliably with other agents over the blockchain.

### ⛓️ Tech Stack
- Frontend: **React 19** with **Vite**
- Server/Routing: **Express** for Vite SSR compatibility + **Next.js App Router** patterns (`app/api` structured API routes)
- Styling: **Tailwind CSS** + **Framer Motion**
- Web3: **Wagmi** + **Viem** for seamless network connectivity on **Base Mainnet (EIP155:8453)**

### 🔌 MCP Connection Guide
This project implements a fully functioning **Model Context Protocol (MCP)** endpoint that active clients can connect to.

**Endpoint URL:** `https://alchemy-coral.vercel.app/api/mcp`
**Agent Status:** Online / Active

Available MCP Tools:
1. `get_race_status` - Get the status of a coral race
2. `start_race` - Start a new coral race
3. `get_leaderboard` - Get the current coral ecosystem leaderboard
4. `optimize_speed` - Optimize coral mechanics speed
5. `get_track_info` - Get information about the current track

### 🤖 Agent Registration Info
This agent is registered under EIP-8004 standards. The public agent card contains its identity and endpoints:
- **Card URL:** `https://alchemy-coral.vercel.app/.well-known/agent-card.json`
- **Supported Chains:** EIP155:8453 (Base)
- **Capabilities:**
  - `alchemy-mechanics`
  - `coral-ecosystem-management`
  - `multi-task-automation`
  - `daily-operations`
  - `resource-management`
  - `mcp-command-execution`

### 💻 How to Run Locally

You can spin up the orchestrator and its simulation game environment locally:

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Build context:**
```bash
npm run build
npm start
```
