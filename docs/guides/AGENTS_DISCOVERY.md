# AGENTS.md Discovery

Codex uses `AGENTS.md` files to gather helpful guidance before it starts assisting you. This page explains how those files are discovered and combined, so you can decide where to place your instructions.

## Global Instructions (`~/.codex`)

- Codex looks for global guidance in your Codex home directory (usually `~/.codex`; set `CODEX_HOME` to change it)
- If an `AGENTS.override.md` file exists there, it takes priority. If not, Codex falls back to `AGENTS.md`
- Only the first non-empty file is used. Other filenames have no effect unless specifically configured
- Global instructions remain active for the entire session and combine with project-specific instructions

## Project Instructions (per-repository)

When working inside a project, Codex builds on global instructions by collecting project docs:

- Search begins at repository root and continues to current directory (if no Git root is found, only current directory is checked)
- In each directory along the path, Codex checks:
  1. `AGENTS.override.md`
  2. `AGENTS.md`
  3. Any configured fallback names (see `project_doc_fallback_filenames`)
- Files are read from root to leaf, joined with blank lines
- Empty files are skipped
- Files are truncated at 32 KiB combined (default `project_doc_max_bytes` limit)

## How Instructions Combine

Instructions are processed in precedence order:

1. Global guidance from `~/.codex`
2. Project docs from repository root down to current directory
3. Deeper directory instructions override earlier layers

### Priority Order

1. Global `AGENTS.override.md` (if present), otherwise global `AGENTS.md`
2. For each directory from repo root to working directory:
   - `AGENTS.override.md`
   - `AGENTS.md`
   - Configured fallback names

## Configuring Fallback Filenames

You can configure additional instruction filenames via `project_doc_fallback_filenames` in your Codex configuration. These are checked after the default files in each directory.

Example configuration in `~/.codex/config.toml`:

```toml
project_doc_fallback_filenames = ["TEAM_GUIDE.md", ".agents.md"]
```

With this config, files are checked in this order per directory:

1. `AGENTS.override.md`
2. `AGENTS.md`
3. `TEAM_GUIDE.md`
4. `.agents.md`

### Example Scenario

If your repository has:

- Root: `TEAM_GUIDE.md`
- `backend/AGENTS.override.md`

The final instructions will combine:

1. Root `TEAM_GUIDE.md` (no override/default present)
2. `backend/AGENTS.override.md` (takes precedence over fallbacks)

For more details, see:

- [Config Documentation](../docs/config.md)
- [Memory with AGENTS.md Guide](../docs/getting-started.md#memory-with-agentsmd)