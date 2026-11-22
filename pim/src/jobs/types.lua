-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
type Job = { id: string, lease_token: string, execution_seq: integer, deadline: string? }
type Lease = { token: string, execution_seq: integer }
type Completion = {
    status: "completed" | "parked" | "rearmed",
    job_id: string,
    execution_seq: integer,
    scheduled_at: string?,
    run_history_settled: boolean,
    owner_locator: { kind: string, id: string },
}
type SelfCompleted = { self_completed: boolean, completion: Completion? }
type Input<Payload> = { job: Job?, payload: Payload? }
type BatchResult = { done: boolean }

return { Job = Job, Lease = Lease, Completion = Completion, SelfCompleted = SelfCompleted, Input = Input, BatchResult = BatchResult }
