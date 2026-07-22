export interface Env {
  INSTALLS: KVNamespace;
  SLACK_WEBHOOK_URL?: string;
}

interface InstallRecord {
  host: string;
  project?: string;
  theme?: string;
  version?: string;
  firstSeen: string;
  lastSeen: string;
  hits: number;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === "/r" && request.method === "GET") {
      return handlePing(url, env);
    }

    if (url.pathname === "/installs" && request.method === "GET") {
      return handleInstallsList(env);
    }

    return new Response("Not found", { status: 404 });
  },
};

async function handlePing(url: URL, env: Env): Promise<Response> {
  const host = url.searchParams.get("host")?.trim().toLowerCase();
  if (!host) {
    return new Response("missing host", { status: 400, headers: corsHeaders });
  }

  const now = new Date().toISOString();
  const project = url.searchParams.get("project")?.trim() || undefined;
  const theme = url.searchParams.get("theme")?.trim() || undefined;
  const version = url.searchParams.get("v")?.trim() || "1";
  const key = project ? `${host}::${project}` : host;

  const existingRaw = await env.INSTALLS.get(key);
  let record: InstallRecord;

  if (existingRaw) {
    record = JSON.parse(existingRaw) as InstallRecord;
    record.lastSeen = now;
    record.hits += 1;
    record.theme = theme ?? record.theme;
    record.version = version;
    record.project = project ?? record.project;
  } else {
    record = {
      host,
      project,
      theme,
      version,
      firstSeen: now,
      lastSeen: now,
      hits: 1,
    };
  }

  await env.INSTALLS.put(key, JSON.stringify(record));

  return new Response(null, { status: 204, headers: corsHeaders });
}

async function handleInstallsList(env: Env): Promise<Response> {
  const list = await env.INSTALLS.list();
  const installs: InstallRecord[] = [];

  for (const key of list.keys) {
    const raw = await env.INSTALLS.get(key.name);
    if (raw) installs.push(JSON.parse(raw) as InstallRecord);
  }

  installs.sort((a, b) => b.lastSeen.localeCompare(a.lastSeen));

  return new Response(JSON.stringify(installs, null, 2), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
