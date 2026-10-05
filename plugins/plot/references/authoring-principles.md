# Stable authoring principles

- Read existing state before writing and preserve successful work.
- Search workspace and shared assets before generating substitutes, especially official logos, characters, product imagery, music, and effects.
- Use immutable asset revisions and stable Plot paths.
- Author canvas source inline on the server and edit it there; keep no local copies of canvas files. Data a program produces is written on the server with `execute`.
- Verify meaningful visual changes from actual snapshots or renders, then repair observed defects.
- Keep handoff concise: canonical refs and URLs, decisions, warnings, unresolved findings, and the next useful choice.

## Screen boards

A page that holds many screens is a board, and a board is read through its sections, not as a flat wall. Keep every screen in a titled `nodes.pack` section once a page holds roughly eight screens; the server says so itself with `structure_suggestion: {page_id, screen_count}` in the write response when a page crosses that without any structure (groups, lanes, stages and sections all count). Re-packing with sections is safe: repeating the call updates titles in place.

Section titles by delivery state turn the page into a handoff board: `Ready for dev` for screens implementation may pick up, `In development`, `Implemented` for shipped ones. The convention is prose, not schema: titles can be any language and any set of states the team uses, a screen moves between sections by re-packing with different membership, and a design change to an implemented screen moves it back to `Ready for dev` (a `comment_list` thread on the node records what drifted until the implementation catches up). When positions must not move, `groups` with labels carry the same grouping without re-layout.


Current tool names, schemas, limits, templates, providers, MIME rules, and capability availability belong to the remote MCP server and should be discovered there when needed.
