# Security Specification - TensioBot Pro

## Data Invariants
1. A reading must consistently belong to the user who created it (`userId` immutability).
2. Users can only access their own profile and readings.
3. System timestamps (`request.time`) are used for creation and updates.
4. Blood pressure values must be within physiological limits.

## The Dirty Dozen Payloads (Rejection Tests)

1. **Identity Spoofing**: Attempt to create a reading for another user.
2. **Shadow Field injection**: Attempt to add an `isAdmin: true` field to a reading.
3. **Privilege Escalation**: Attempt to update another user's profile.
4. **Resource Poisoning**: Attempt to use a 2MB string as a `note`.
5. **Timestamp Manipulation**: Client sends a future `timestamp`.
6. **Negative Pressure**: Systolic reading of `-120`.
7. **Unverified Access**: Attempt to read data with an unverified email account.
8. **Owner Hijack**: Attempt to change the `userId` of an existing reading.
9. **Creation Date Modification**: Attempt to change `createdAt` on a user profile.
10. **Shadow Profile Creation**: Attempt to create a profile with a different UID than current auth.
11. **Excessive Range Reading**: Systolic reading of `1000`.
12. **Anonymous Write**: Attempt to write without any authentication.

## Test Cases for firestore.rules.test.ts

```typescript
// To be implemented in Phase 1
```
