// Fail open. No transcript, credential, network, model or subprocess access.
const REMINDER = "If this session uses Plot: it exposes one tool, execute, running TypeScript against plot.<namespace>.<method>(input). Signatures are gone after compaction; call plot.help({topic}) (\"catalog\", a namespace or a method name) before a call you cannot write exactly. After a timeout repeat the same call with the same idempotency_key; never resubmit paid work blindly.";
try {
  let raw = "";
  for await (const chunk of process.stdin) {
    raw += chunk;
    if (raw.length > 1024 * 1024) process.exit(0);
  }
  const event = JSON.parse(raw);
  if (event.hook_event_name === "SessionStart" && event.source === "compact")
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: REMINDER } }));
} catch { /* A reminder failure must never block the session. */ }
