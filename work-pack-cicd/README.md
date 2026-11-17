<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Release pipeline stage delivery

The unpublished `kickside/work-pack-cicd` pack uses the exact entry `kickside.work.pack.cicd:pack`. Its automated Building stage allows three total attempts with a one-second backoff and a failed outcome at exhaustion. Its Flow and Data Sync automations belong to the installation. This page records their delivery contract; the pack implementation is not included in components main.

Publish a Flow that accepts the stage-entry body (`board_id`, `item`, `state`, `visit`, `attempt`), performs the build workload and reports `passed`, `failed` or `canceled` through `kickside.work:board.report` or the `kickside.work.traits:report` virtual tool Block. Forward the locator unchanged into report-back. Credentials belong in the installation's private connection state.

Install a stage launcher through the ordinary platform installer, selecting an exact published Flow reference:

```yaml
title: Release stage execution
enabled: false
trigger:
  v: 2
  source: kickside.work.ports:stage_entered
  config: {thread_id: "<board-id>"}
  backfill: none
sink_port: kickside.workflows:run_sink
sink_config:
  flow_ref: {kind: flow, id: "<published-flow-component-id>", version: 1}
  correlation_fields: [board_id, item, visit, attempt]
transform: {kind: none}
```

Install a companion Data Sync automation for the same Flow and board so a run that fails before reporting closes its stage immediately:

```yaml
title: Release stage failure
enabled: false
trigger:
  v: 2
  source: kickside.workflows:flow_run_failed
  config: {thread_id: "<published-flow-component-id>"}
  backfill: none
sink_port: kickside.work.sink:stage_failures_port
sink_config: {board_id: "<board-id>"}
transform: {kind: none}
```

Enable both automations before admitting builds. Failed, cancelled and terminated runs close an unfinished current attempt with outcome `failed`, using the same retry count, one-second backoff and failure route as a reported failure. The stage history records the terminal run id and outputs `{error: "flow_run_failed"}`. A report that already committed wins; duplicate events, stale visits/attempts and another board's correlation change nothing. Successful silent runs still require report-back or reach the declared stage timeout. Work adds no watcher, polling loop or process.

The launcher needs board event-source and Flow destination grants. The failure consumer needs Flow event-source access and board WRITE under its stored execution principal; ordinary Work item visibility applies. Existing launchers must select `correlation_fields` and accept `board_id` in their Flow Start input. Initial and retry stage entries now supply the board id; older stored events remain valid without it.
