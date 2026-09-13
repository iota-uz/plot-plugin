# Domain routing

- Use `plot-canvas` when the person expects a screen, interface, interactive prototype, report, diagram, document, or spatial canvas.
- Use `plot-video` when the primary output depends on motion, timing, acting, voice, sound, editing, or a video render.
- Use both when timed media contains designed interface frames or canvas artifacts. `plot-video` owns the final timeline/render; `plot-canvas` owns the embedded visual artifact.
- A simple continuation on an already-open Plot ref does not require broad discovery. Load only the domain and server resources needed for the current change.
