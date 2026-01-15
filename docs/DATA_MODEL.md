# Data Model

The platform uses a JSON data model stored in `data/store.json`. This file is automatically created by the backend and updated after each mutation.

## Store Layout

```json
{
  "users": [],
  "datasets": [],
  "annotations": []
}
```

## User

```json
{
  "id": "uuid",
  "username": "alex",
  "email": "alex@example.com",
  "passwordHash": "salt:hash",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

Notes:

- Passwords are stored as PBKDF2 hashes.
- The API never returns `passwordHash` in responses.

## Dataset

```json
{
  "id": "uuid",
  "name": "Customer Survey",
  "description": "Quarterly results",
  "tags": ["survey"],
  "data": [
    { "region": "NA", "score": 91 }
  ],
  "uploadedBy": "alex",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

Dataset rules:

- `name`, `uploadedBy`, and `data` are required.
- `data` is expected to be an array of objects or arrays.
- `tags` is optional and defaults to an empty array.

## Annotation

```json
{
  "id": "uuid",
  "datasetId": "uuid",
  "author": "jordan",
  "message": "Missing region code for row 2",
  "metadata": { "row": 2 },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

Annotation rules:

- `datasetId` must reference an existing dataset.
- `author` and `message` are required.
- `metadata` is optional and defaults to `{}`.

## Derived Data

Visualization summaries are computed on demand and are not stored in the JSON store. The summary object is a snapshot derived from the current dataset `data` field.
