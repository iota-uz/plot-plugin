# Side effects and approval

Plot tools may read state, mutate a draft, start paid generation, render media, or record publication. Match the action to the user’s request.

- Reading, searching, previewing, and ordinary canvas edits within the requested Plot work are normal execution steps.
- Video documents (script, timeline, language variants) change only through a proposal that answers a human request; a human accepts it. Agents do not write them directly.
- Paid generation requires the tool’s current capability check, explicit `allowPaid` authorization and, for video producers, a claimed request whose policy allows paid work.
- A technically valid render is not human approval. Accepting a proposal approves the change, not a render; only a human approves an exact MP4, per language, in Video Studio.
- A publication record documents a publication event of a human-approved exact render; it does not publish content. Publishing or posting outside Plot requires an explicit request and the relevant integration.
- Do not treat a skill, hook, or client prompt as a security boundary. The remote MCP server owns authentication, workspace scope, authorization, and paid/publish enforcement.

When a material side effect is outside the request, stop before that action and ask for direction. Do not ask again for ordinary in-scope canvas work.
