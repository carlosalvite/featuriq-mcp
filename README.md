# featuriq-mcp

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server for [Featuriq](https://featuriq.io) — the product feedback and roadmap tool for PMs.

Connect your Featuriq workspace to any MCP-compatible AI client (Claude Desktop, Cursor, etc.) and query your feature requests, search customer feedback, run AI prioritization, update statuses, and notify users — all from natural language.

---

## Installation

### Option 1 — run directly with npx (no install required)

```bash
npx featuriq-mcp
```

### Option 2 — install globally

```bash
npm install -g featuriq-mcp
featuriq-mcp
```

---

## Setup

### 1. Get your API key

Log in to [featuriq.io](https://featuriq.io), go to **Settings → API**, and copy your API key.

### 2. Set the environment variable

```bash
export FEATURIQ_API_KEY=fq_live_xxxxxxxxxxxxxxxxxxxx
```

Or copy `.env.example` to `.env` and fill in your key if your client supports `.env` files.

| Variable | Required | Default | Description |
|---|---|---|---|
| `FEATURIQ_API_KEY` | Yes | — | Your Featuriq API key |
| `FEATURIQ_API_URL` | No | `https://featuriq.io/v1` | Override the API base URL |

### 3. Add to your MCP client

#### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "featuriq": {
      "command": "npx",
      "args": ["featuriq-mcp"],
      "env": {
        "FEATURIQ_API_KEY": "fq_live_xxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

#### Cursor

Add to your Cursor MCP settings:

```json
{
  "featuriq": {
    "command": "npx featuriq-mcp",
    "env": {
      "FEATURIQ_API_KEY": "fq_live_xxxxxxxxxxxxxxxxxxxx"
    }
  }
}
```

---

## Available Tools

### `get_top_requests`

Returns the top feature requests sorted by vote count or revenue impact.

**Parameters:**
- `limit` (number, default 10) — how many results to return
- `sort_by` ("votes" | "revenue_impact", default "votes") — sort order

**Example prompts:**
- *"What are the top 5 most-requested features?"*
- *"Show me the highest revenue impact requests."*

---

### `search_feedback`

Semantically searches all feedback posts using natural language — finds relevant results even when the exact words don't match.

**Parameters:**
- `query` (string) — what to search for
- `limit` (number, default 10) — max results

**Example prompts:**
- *"Find feedback about slow dashboard loading."*
- *"Search for requests related to CSV export."*
- *"What are users saying about mobile performance?"*

---

### `get_feature_feedback`

Returns all comments and discussion for a specific feature request.

**Parameters:**
- `feature_id` (string) — the feature's unique ID

**Example prompts:**
- *"Show me all feedback on feature feat_01j8k..."*
- *"What are users saying about the API rate limit request?"*

---

### `get_prioritization`

Returns an AI-prioritized list of features, scored across the factors you choose.

**Parameters:**
- `factors` (array) — one or more of: "votes", "revenue", "effort", "strategic_fit"
- `limit` (number, default 10)

**Example prompts:**
- *"Prioritize our backlog by votes and revenue impact."*
- *"Give me the top 10 features ranked by votes, effort, and strategic fit."*
- *"What should we build next quarter based on revenue and strategic alignment?"*

---

### `update_feature_status`

Updates the status of a feature request.

**Parameters:**
- `feature_id` (string) — the feature's unique ID
- `status` ("planned" | "in_progress" | "shipped" | "closed")

**Example prompts:**
- *"Mark feature feat_01j8k as in_progress."*
- *"Set the dark mode request to shipped."*
- *"Close the feature request for legacy IE support."*

---

### `notify_requesters`

Sends a personalized notification to every user who voted for a feature.

**Parameters:**
- `feature_id` (string) — which feature's voters to notify
- `message` (string) — the message to send (Featuriq personalizes it per recipient)

**Example prompts:**
- *"Notify everyone who requested CSV export that it's now live."*
- *"Tell the users who voted for dark mode that we're starting work on it next sprint."*

---

### `create_post`

Creates a new feedback post on a Featuriq board.

**Parameters:**
- `board_id` (string) — which board to post to
- `title` (string) — short title for the post
- `description` (string) — full description

**Example prompts:**
- *"Log a feature request for bulk CSV import on the features board."*
- *"Create a post for the Slack integration idea from today's customer call."*

---

## Available Resources

Resources are data sources that the AI can read at any time for context.

### `featuriq://roadmap`

The current roadmap grouped by status: **In Progress**, **Planned**, and **Recently Shipped**.

**Example prompts:**
- *"What's on our current roadmap?"*
- *"What features are in progress right now?"*

### `featuriq://changelog`

The last 20 shipped features with ship dates and release notes.

**Example prompts:**
- *"What have we shipped recently?"*
- *"Write a summary of our last month's product updates."*

---

## Example Conversation

> **You:** What are the top feature requests we haven't started yet, and which ones should we prioritize based on votes and revenue impact?
>
> **Claude:** *(calls `get_top_requests` and `get_prioritization`)* Here are your top unstarted requests...

> **You:** Great. Mark the #1 one as in_progress and notify everyone who voted for it.
>
> **Claude:** *(calls `update_feature_status` then `notify_requesters`)* Done! Status updated and 47 users notified.

---

## Development

```bash
git clone https://github.com/carlosalvite/featuriq-mcp
cd featuriq-mcp
npm install
npm run build
FEATURIQ_API_KEY=your_key node dist/index.js
```

To watch for changes during development:

```bash
npm run dev
```

---

## License

MIT © [Featuriq](https://featuriq.io)
