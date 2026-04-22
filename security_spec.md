# Security Specification

## Data Invariants
- Each `researcher` document ID must match the user's UID.
- A `Project` must have a valid `authorUid` matching the creator's UID.
- `createdAt` timestamps must be set upon creation and never modified.
- `authorUid` and `uid` fields are immutable once set.
- Status transitions for projects (e.g., to "Aprovado") are restricted to admin users only.
- Messages must be linked to a project and an authorized author.

## The "Dirty Dozen" Payloads

1. **Identity Spoofing (Profile)**: Creating a researcher profile where `uid` does not match `request.auth.uid`.
2. **Immutability Breach (Profile)**: Updating the `uid` field in an existing researcher profile.
3. **Identity Spoofing (Project)**: Creating a project where `authorUid` does not match `request.auth.uid`.
4. **Immutability Breach (Project)**: Updating the `authorUid` field in an existing project.
5. **Horizontal Privilege Escalation**: Reading a project document that belongs to another researcher.
6. **State Shortcut**: Updating a project's `status` to "Aprovado" from a non-admin account.
7. **Message Spoofing**: Sending a message where `authorUid` is not the sender's UID.
8. **Orphaned Message**: Creating a message without a corresponding `projectId`.
9. **Resource Exhaustion**: Sending a payload with a name field exceeding 100 characters.
10. **Admin Configuration Leak**: Reading the `system_config/admins` document without admin privileges.
11. **Unauthorized Deletion**: Deleting a project document without admin privileges.
12. **Temporal Integrity Breach**: Overwriting the `createdAt` timestamp with a custom client-side date.

## Test Runner Verification
A `firestore.rules.test.ts` will be implemented to ensure all these payloads are rejected by the security rules.
