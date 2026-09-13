# Side effects and approval

Plot tools may read state, mutate a draft, start paid generation, render media, or record publication. Match the action to the user’s request.

- Reading, searching, previewing, and ordinary draft edits within the requested Plot work are normal execution steps.
- Paid generation requires the tool’s current capability check and explicit `allowPaid` authorization.
- A technically valid render is not human approval.
- A publication record documents a publication event; it does not publish content. Publishing or posting outside Plot requires an explicit request and the relevant integration.
- Do not treat a skill, hook, or client prompt as a security boundary. The remote MCP server owns authentication, workspace scope, authorization, and paid/publish enforcement.

When a material side effect is outside the request, stop before that action and ask for direction. Do not ask again for ordinary in-scope draft work.
