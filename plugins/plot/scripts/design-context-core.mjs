// Only platform-owned signal names are interpreted. Never execute or quote tool content.

// Plot tools after which advice is useful: writes and snapshots. hooks/hooks.json
// carries the same list in its matcher; design-context.test.mjs keeps them equal.
export const ADVISED_TOOLS = ["canvas_save", "canvas_edit", "canvas_apply_patch", "canvas_patch", "canvas_nodes_move", "canvas_nodes_delete", "execute", "canvas_snapshot"];

const PLOT_TOOL = /^mcp__(?:plot|plugin_plot_plot|.*[ _-]plot)__(.+)$/;

const COMPACT_REMINDER = "Plot reminder after compaction: tool schemas are gone from context. Before calling a Plot tool, reload its schema (ToolSearch select:<name>, or the plot://tools/<name> resource). The Plot server instructions are still in context and carry the signatures of the common tools; copy argument names from them or from the schema, never from memory, and when a call is rejected, read the usage line in the error. Keep editing on the server, with no local copies.";

const MESSAGES = {
  measurements: "Plot returned layout measurements. Inspect the indicated screen/element at readable size: scrolling and clipping may be intentional. Check the actual image, identify a concrete defect before changing it, and use focused refinement. Technical render success is not aesthetic approval. No obligation to add interactivity.",
  detail: "Plot suggests focused node previews: a canvas overview can hide small-screen defects. Inspect the relevant screen at legible size before handoff; do not infer quality from the overview alone.",
  inspect: "Plot's write response names nodes to inspect (the inspect field). When visual work is in scope, look at them with canvas_snapshot at legible size (a tall screen returns tiles; follow tiles.next, or use crop/element) and refine concrete defects in hierarchy, imagery, typography or layout. A successful write is not visual verification; this advice does not authorize extra edits.",
};

function hasInspectTargets(value) {
  const inspect = value?.inspect;
  if (!inspect || typeof inspect !== "object" || Array.isArray(inspect)) return false;
  return (Array.isArray(inspect.node_ids) && inspect.node_ids.length > 0) || (typeof inspect.count === "number" && inspect.count > 0);
}

export function isAdvisedPlotTool(event) {
  const match = PLOT_TOOL.exec(event?.tool_name ?? "");
  return Boolean(match) && ADVISED_TOOLS.includes(match[1]);
}

export function designContext(event, seen = []) {
  const phase = event?.hook_event_name;
  if (phase === "SessionStart") {
    // Re-injected after every compaction, so it is never deduplicated.
    if (event.source !== "compact") return null;
    return { key: "compact", persist: false, output: { hookSpecificOutput: { hookEventName: phase, additionalContext: COMPACT_REMINDER } } };
  }
  if (phase !== "PostToolUse") return null;
  if (!isAdvisedPlotTool(event)) return null;
  const signals = new Set();
  let visited = 0;
  function inspect(value, depth = 0) {
    if (depth > 7 || ++visited > 100 || value == null) return;
    if (typeof value === "string") {
      if (value.length > 100_000) return;
      try { inspect(JSON.parse(value), depth + 1); } catch {}
      return;
    }
    if (typeof value !== "object") return;
    if (value.isError || value.ok === false) return;
    if (Array.isArray(value)) { for (const item of value.slice(0, 24)) inspect(item, depth + 1); return; }
    if (Array.isArray(value.visual_issues) && value.visual_issues.length) signals.add("measurements");
    if (Array.isArray(value.suggested_previews) && value.suggested_previews.length) signals.add("detail");
    if (hasInspectTargets(value)) signals.add("inspect");
    for (const name of ["structuredContent", "content", "text", "data", "result", "emitted", "diagnostics", "preview", "canvasCommit", "canvas_commit"]) {
      if (name in value) inspect(value[name], depth + 1);
    }
  }
  inspect(event.tool_response);
  const key = ["measurements", "detail", "inspect"].find((name) => signals.has(name));
  if (!key || seen.includes(key)) return null;
  return { key, persist: true, output: { hookSpecificOutput: { hookEventName: phase, additionalContext: MESSAGES[key] } } };
}
