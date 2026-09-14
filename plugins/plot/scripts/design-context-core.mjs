// Only platform-owned signal names are interpreted. Never execute or quote tool content.
export function designContext(event, seen = []) {
  if (!/^mcp__(?:plot|plugin_plot_plot|.*[ _-]plot)__/.test(event.tool_name ?? "")) return null;
  const phase = event.hook_event_name;
  let key;
  let message;
  if (phase === "PreToolUse") {
    key = "assets";
    message = "Plot design context: consider what imagery and sound contribute before detailed styling. For places, products and brands, existing workspace/shared assets can be core content. Search and visually inspect suitable candidates when useful; importing, generating, or intentional typography-only design are also valid. See the relevant Plot skill. This is advice, not a prerequisite or an instruction to modify anything.";
  } else if (phase === "PostToolUse") {
    const signals = [];
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
      if (Array.isArray(value.visual_issues) && value.visual_issues.length) signals.push("measurements");
      if (Array.isArray(value.suggested_previews) && value.suggested_previews.length) signals.push("detail");
      if (value.code === "inspect_changed_canvas" || value.state === "committed") signals.push("inspect");
      for (const name of ["structuredContent", "content", "text", "data", "result", "emitted", "diagnostics", "recommendations", "preview", "canvasCommit", "canvas_commit"]) {
        if (name in value) inspect(value[name], depth + 1);
      }
    }
    inspect(event.tool_response);
    if (!signals.length) return null;
    key = signals.includes("measurements") ? "measurements" : signals.includes("detail") ? "detail" : "inspect";
    message = key === "measurements"
      ? "Plot returned layout measurements. Inspect the indicated screen/element at readable size: scrolling and clipping may be intentional. Check the actual image, identify a concrete defect before changing it, and use focused refinement. Technical render success is not aesthetic approval. No obligation to add interactivity."
      : key === "detail"
        ? "Plot suggests focused node previews: a canvas overview can hide small-screen defects. Inspect the relevant screen at legible size before handoff; do not infer quality from the overview alone."
        : "Plot reports a canvas change. When visual work is in scope, inspect the changed result at legible size and refine concrete issues in hierarchy, imagery, typography or layout. A successful write is not visual verification; this advice does not authorize extra edits.";
  } else return null;
  if (seen.includes(key)) return null;
  return { key, output: { hookSpecificOutput: { hookEventName: phase, additionalContext: message } } };
}
