# Intent-Driven Starter for Claude Code

A small reusable Claude Code plugin distilled from the working patterns proven in LocationMaster.

It is intentionally **not** a copy of the LocationMaster application. It packages the parts that should travel across projects:

- repo-aware onboarding before editing,
- the Intent Creator standard,
- Plan → refine → delta → implement → validate execution,
- minimum-sufficient architecture,
- minimum-sufficient context passing,
- narrowly justified subagents,
- one generic deterministic secret guard,
- optional location/map guidance based on the tested LocationMaster rules.

It does **not** install an MCP server, workflow engine, database, map provider, framework, or cloud dependency. Those belong in a project only when the project actually needs them.

## Fastest test

From the directory containing the plugin:

```bash
claude --plugin-dir ./plugins/intent-driven-starter
```

Then try:

```text
/intent-driven-starter:start
/intent-driven-starter:intent-creator
/intent-driven-starter:execute-intent
```

For a map/location project:

```text
/intent-driven-starter:location-story
```

## Install once for all projects

### Option A — local marketplace from this bundle

From the directory containing this README, start Claude Code and run:

```text
/plugin marketplace add .
/plugin install intent-driven-starter@kendall-intent-plugins
```

Choose **User** scope during installation. User scope makes the plugin available across your projects.

If Claude Code tells you to reload:

```text
/reload-plugins
```

### Option B — put this marketplace in GitHub

Push this whole folder to its own repository, for example:

```text
kendallmark3/intent-driven-starter
```

Then add it once:

```text
/plugin marketplace add kendallmark3/intent-driven-starter
/plugin install intent-driven-starter@kendall-intent-plugins
```

Choose **User** scope.

## Everyday onboarding

Open Claude Code in any repository and say what you want to accomplish normally. The plugin's skills may be selected from context, or invoke them explicitly.

Recommended first pass:

```text
/intent-driven-starter:start
```

Then either give Claude an existing feature/intent file or create one with:

```text
/intent-driven-starter:intent-creator <your goal>
```

Execute with:

```text
/intent-driven-starter:execute-intent
```

The expected operating sequence is:

```text
repo/current state
      ↓
intent + constraints + success criteria
      ↓
smallest safe delta
      ↓
implementation
      ↓
repository-native validation
      ↓
STOP
```

## What the plugin deliberately does not do

It does not automatically create:

- MCP servers
- durable workflows
- coordinator agents
- shared services
- databases
- cloud infrastructure
- map APIs
- project-specific hooks

Those are added only when the current project requires them.

That is the central rule: **use the right capability for the job and give it only the context it needs.**

## Included skills

### `start`
Understands the current repository before touching it. Finds guidance, current state, the smallest implementation surface, and the real validation path.

### `intent-creator`
Produces the standard implementation contract: Goal, Inputs/Context, Outputs, Success Criteria, constraints, acceptance criteria, evidence, and stop conditions.

### `execute-intent`
Runs the tested repo-aware cycle: understand → refine only blockers → delta → implement → validate → stop.

### `location-story`
Optional map/location guidance. It carries forward the rules that worked in LocationMaster: no fabricated coordinates, provenance, deterministic geocoding, user-over-AI presentation overrides, and validated export boundaries.

## Included agents

### `architecture-reviewer`
Read-only. Use only for real architecture expansion: new external systems, persistence/auth topology, queues/workflows, rendering pipelines, tenant/billing boundaries, or promotion into shared infrastructure.

### `intent-normalizer`
Isolated conversion of bounded free text into a compact implementation contract. It intentionally avoids carrying unrelated context.

## Included hook

The plugin runs a lightweight dependency-free secret scan at Stop. It checks newly added git-diff content for common credential patterns. It is intentionally narrow so it can work across Python, TypeScript, .NET, Java, and other repositories without imposing a toolchain.

Runtime/application safety still belongs in the application. A Claude Code hook is not a replacement for server-side validation.

## Validation before publishing

Run:

```bash
claude plugin validate ./plugins/intent-driven-starter
```

For stricter validation:

```bash
claude plugin validate ./plugins/intent-driven-starter --strict
```

Then smoke-test:

```bash
claude --plugin-dir ./plugins/intent-driven-starter
```

Verify:

1. `/intent-driven-starter:start` appears and reads the repo before proposing changes.
2. `/intent-driven-starter:intent-creator` produces the required pillars.
3. `/intent-driven-starter:execute-intent` stays inside the requested scope.
4. `architecture-reviewer` is available under custom agents.
5. The secret hook runs without requiring project dependencies.
6. Location guidance activates only for map/location work.

## Version 1 posture

Keep v1 small.

Promote something into the plugin only after it proves reusable across projects. Keep project-specific capability inside the project until repetition proves it belongs here.

That preserves the progress from LocationMaster without turning a successful focused architecture into a giant universal framework.
