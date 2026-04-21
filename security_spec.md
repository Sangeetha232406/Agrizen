# Security Specification: AgriZen

## Data Invariants
1. A user can only access their own profile.
2. A crop recommendation must be linked to the user who requested it.
3. A pest detection must be linked to the user who uploaded it.
4. Timestamps must be server-generated.
5. All IDs must follow a strict format.

## The "Dirty Dozen" Payloads

### 1. Identity Spoofing (Recommendation)
```json
{
  "userId": "SOMEONE_ELSES_UID",
  "recommendedCrop": "Rice",
  "inputs": { ... },
  "timestamp": "2024-04-21T05:00:00Z"
}
```
**Expected Result:** PERMISSION_DENIED (userId mismatch with request.auth.uid)

### 2. Identity Spoofing (Detection)
```json
{
  "userId": "SOMEONE_ELSES_UID",
  "pestName": "Aphid",
  "timestamp": "2024-04-21T05:00:00Z"
}
```
**Expected Result:** PERMISSION_DENIED (userId mismatch)

### 3. Resource Poisoning (Giant ID)
Path: `/detections/a`.repeat(2000)
**Expected Result:** PERMISSION_DENIED (isValidId fails)

### 4. Resource Poisoning (Giant Field)
```json
{
  "userId": "MY_UID",
  "pestName": "A".repeat(1000000),
  "timestamp": "2024-04-21T05:00:00Z"
}
```
**Expected Result:** PERMISSION_DENIED (isValidDetection check fails on size)

### 5. Type Poisoning (String as Number)
```json
{
  "userId": "MY_UID",
  "recommendedCrop": "Rice",
  "inputs": { "n": "Not a number" },
  "timestamp": "2024-04-21T05:00:00Z"
}
```
**Expected Result:** PERMISSION_DENIED (is number validation fails)

### 6. Temporal Integrity Violation (Client Timestamp)
```json
{
  "userId": "MY_UID",
  "recommendedCrop": "Rice",
  "timestamp": "2010-01-01T00:00:00Z"
}
```
**Expected Result:** PERMISSION_DENIED (timestamp != request.time)

### 7. Global Consistency (Missing User Document)
Attempt to create a recommendation for a user that doesn't have a profile.
**Expected Result:** PERMISSION_DENIED (exists() check on /users/uid fails)

### 8. Shadow Update (Detection)
```json
{
  "pestName": "Aphid",
  "isVerifiedByAdmin": true
}
```
**Expected Result:** PERMISSION_DENIED (affectedKeys().hasOnly() violation)

### 9. Unauthorized Reading (Recommendation)
Attempt to 'get' a recommendation belonging to another user.
**Expected Result:** PERMISSION_DENIED (resource.data.userId == request.auth.uid)

### 10. Unauthorized Reading (User Profile)
Attempt to 'get' another user's profile.
**Expected Result:** PERMISSION_DENIED (isOwner(userId) fails)

### 11. Malicious PII Write
Attempt to update another user's email.
**Expected Result:** PERMISSION_DENIED (isOwner(userId) fails)

### 12. Orphaned Write (Deleted User)
Attempt to write a detection after the user document has been deleted.
**Expected Result:** PERMISSION_DENIED (exists() check fails)
