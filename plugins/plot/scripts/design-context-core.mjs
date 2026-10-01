// Only platform-owned signal names are interpreted. Never execute or quote tool content.

// Plot tools after which advice is useful: writes and snapshots. hooks/hooks.json
// carries the same list in its matcher; design-context.test.mjs keeps them equal.
// Response fields read (contract 2026-10-01): visual_issues, suggested_previews,
// inspect and fit_pending (writes; execute carries them in canvas_commit),
// tiles.next (canvas_snapshot, top level and in captures[]).
export const ADVISED_TOOLS = ["canvas_save", "canvas_edit", "canvas_apply_patch", "canvas_patch", "canvas_nodes_move", "canvas_nodes_delete", "execute", "canvas_snapshot"];

const PLOT_TOOL = /^mcp__(?:plot|plugin_plot_plot|.*[ _-]plot)__(.+)$/;

const COMPACT_REMINDER = "Plot reminder after compaction: tool schemas are gone. Before a call you cannot write exactly, reload one (ToolSearch select:<name>, or read plot://tools/<name>); a rejected call ends with a usage: line. The server instructions still list the common signatures; they do not show these: canvas_patch page_id on the call defaults each operation, {op:\"screens.upsert\", screens:[{id,title,file}]} (no viewport.height: the node fits its content), {op:\"nodes.fit\", node_ids, reflow:true} for ids in fit_pending (viewport_relative: give viewport.height instead), {op:\"nodes.remove\", id}. A tall snapshot answers tiles.next: pass it unchanged. After a timeout repeat the same call and idempotency_key (an execute that never started needs a new one).";

const MESSAGES = {
  measurements: "Plot returned layout measurements. Inspect the indicated screen/element at readable size: scrolling and clipping may be intentional. Check the actual image, identify a concrete defect before changing it, and use focused refinement. Technical render success is not aesthetic approval. No obligation to add interactivity.",
  detail: "Plot suggests focused node previews: a canvas overview can hide small-screen defects. Inspect the relevant screen at legible size before handoff; do not infer quality from the overview alone.",
  inspect: "Plot's write response says which screens changed (the inspect field; after execute, canvas_commit.inspect). When visual work is in scope, pass inspect.node_ids as canvas_snapshot targets:[{type:\"node\", node_id}] at legible size and refine concrete defects in hierarchy, imagery, typography or layout. A successful write is not visual verification; this advice does not authorize extra edits.",
  fit_pending: "Plot could not fit some auto-height screens in that write (fit_pending names reason, page_id and node_ids). Fit only those: canvas_patch {op:\"nodes.fit\", page_id, node_ids, reflow:true}, then snapshot them; do not fit other screens. Exceptions: viewport_relative needs an explicit viewport height from you, and boundary (warning fit_blocked_by_boundary) needs the node taken out of its boundary first; nodes.fit alone does not help.",
  tiles: "A tall node was cut into tiles: this snapshot is one tile (tiles.count counts the tiles left, this one included). Pass tiles.next, the complete next call, unchanged for the next tile; a tile_revision_changed warning means the draft moved, so start the walk over. Aim crop or element at a suspect region instead of walking every tile.",
};

function hasFitPending(value) {
  const pending = value?.fit_pending;
  if (!pending || typeof pending !== "object" || Array.isArray(pending)) return false;
  return (typeof pending.count === "number" && pending.count > 0) || (Array.isArray(pending.pages) && pending.pages.length > 0);
}

function hasMoreTiles(value) {
  const tiles = value?.tiles;
  return Boolean(tiles) && typeof tiles === "object" && !Array.isArray(tiles) && Boolean(tiles.next) && typeof tiles.next === "object";
}

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
    if (hasFitPending(value)) signals.add("fit_pending");
    if (hasMoreTiles(value)) signals.add("tiles");
    for (const name of ["structuredContent", "content", "text", "data", "result", "emitted", "diagnostics", "preview", "canvasCommit", "canvas_commit", "captures"]) {
      if (name in value) inspect(value[name], depth + 1);
    }
  }
  inspect(event.tool_response);
  // The first signal not yet advised in this session, in this priority order.
  const key = ["measurements", "detail", "fit_pending", "inspect", "tiles"].find((name) => signals.has(name) && !seen.includes(name));
  if (!key) return null;
  return { key, persist: true, output: { hookSpecificOutput: { hookEventName: phase, additionalContext: MESSAGES[key] } } };
}
