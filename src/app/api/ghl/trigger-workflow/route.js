export const runtime = "nodejs";

const DEFAULT_VITE_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/MJHmir5Xkxz4EWxcOEj3/webhook-trigger/23EaRw19TjCgaK8wGoJ3";

function jsonError(message, status = 400, extra) {
  return Response.json(
    { ok: false, error: message, ...(extra ? { extra } : {}) },
    { status }
  );
}

export async function POST(request) {
  const workflowWebhookUrl =
    process.env.GHL_WORKFLOW_WEBHOOK_URL || DEFAULT_VITE_WEBHOOK_URL;
  if (!workflowWebhookUrl) {
    return jsonError("Missing env: GHL_WORKFLOW_WEBHOOK_URL", 500);
  }

  let payload;
  try {
    payload = await request.json();    
  } catch (e) {
    return jsonError("Invalid JSON body", 400, { message: String(e) });
  }

  const res = await fetch(workflowWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    return jsonError("Workflow webhook call failed", res.status, { body: text });
  }

  return Response.json({ ok: true });
}

