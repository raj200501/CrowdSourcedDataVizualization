# API Reference

This API is served by the backend HTTP server. All responses are JSON and use standard HTTP status codes.

Base URL (local):

```
http://localhost:5000
```

## Conventions

- Successful responses return a JSON body.
- Errors return `{ "message": "Human readable message" }`.
- All POST requests use `Content-Type: application/json`.

## Health

### `GET /api/health`

Returns a simple health payload.

**Response**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Datasets

### `GET /api/data`

List all datasets.

**Response**

```json
{
  "datasets": [
    {
      "id": "uuid",
      "name": "Customer Survey",
      "description": "Quarterly results",
      "tags": ["survey"],
      "data": [{ "region": "NA", "score": 91 }],
      "uploadedBy": "alex",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### `POST /api/data/upload`

Create a new dataset.

**Request**

```json
{
  "name": "Customer Survey",
  "description": "Quarterly results",
  "uploadedBy": "alex",
  "tags": ["survey"],
  "data": [
    { "region": "NA", "score": 91, "owner": "team-a" },
    { "region": "EU", "score": 87, "owner": "team-b" }
  ]
}
```

**Response**

```json
{
  "dataset": {
    "id": "uuid",
    "name": "Customer Survey",
    "description": "Quarterly results",
    "tags": ["survey"],
    "data": [
      { "region": "NA", "score": 91, "owner": "team-a" },
      { "region": "EU", "score": 87, "owner": "team-b" }
    ],
    "uploadedBy": "alex",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### `GET /api/data/:id`

Fetch a dataset and its annotations.

**Response**

```json
{
  "dataset": {
    "id": "uuid",
    "name": "Customer Survey",
    "description": "Quarterly results",
    "tags": ["survey"],
    "data": [
      { "region": "NA", "score": 91, "owner": "team-a" }
    ],
    "uploadedBy": "alex",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "annotations": [
    {
      "id": "uuid",
      "datasetId": "uuid",
      "author": "jordan",
      "message": "Missing region code for row 2",
      "metadata": {},
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### `POST /api/data/:id/clean`

Normalize and clean the dataset.

Cleaning behavior includes:

- Trim string values.
- Convert numeric strings to numbers.
- Remove `null`, `undefined`, or empty strings.
- Drop empty rows/objects.

**Response**

```json
{
  "dataset": {
    "id": "uuid",
    "name": "Customer Survey",
    "data": [
      { "region": "NA", "score": 91 }
    ]
  },
  "cleanedRows": 1
}
```

### `POST /api/data/:id/annotations`

Attach a comment to a dataset.

**Request**

```json
{
  "author": "jordan",
  "message": "Missing region code for row 2",
  "metadata": { "row": 2 }
}
```

**Response**

```json
{
  "annotation": {
    "id": "uuid",
    "datasetId": "uuid",
    "author": "jordan",
    "message": "Missing region code for row 2",
    "metadata": { "row": 2 },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### `GET /api/data/:id/visualization`

Returns a summary that the UI renders as a basic visualization.

**Response**

```json
{
  "datasetId": "uuid",
  "summary": {
    "rowCount": 2,
    "columnCount": 3,
    "columns": ["region", "score", "owner"],
    "columnStats": {
      "region": {
        "count": 2,
        "uniqueCount": 2,
        "uniqueValues": ["NA", "EU"]
      },
      "score": {
        "count": 2,
        "uniqueCount": 2,
        "uniqueValues": ["91", "87"],
        "min": 87,
        "max": 91,
        "mean": 89
      },
      "owner": {
        "count": 2,
        "uniqueCount": 2,
        "uniqueValues": ["team-a", "team-b"]
      }
    }
  }
}
```

---

## Users

### `POST /api/users/register`

Create a new user stored in the JSON data store.

**Request**

```json
{
  "username": "alex",
  "email": "alex@example.com",
  "password": "super-secret"
}
```

**Response**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "username": "alex",
    "email": "alex@example.com"
  }
}
```

### `POST /api/users/login`

Authenticate and receive a signed token.

**Request**

```json
{
  "username": "alex",
  "password": "super-secret"
}
```

**Response**

```json
{
  "token": "eyJ1c2VySWQiOiJ1dWlkIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMzYwMDB9.signed"
}
```

---

## Server-Sent Events (SSE)

Subscribe to the collaboration stream:

```
GET /api/collaboration/stream
```

The server emits the following SSE events when data changes:

| Event | Payload | Description |
| --- | --- | --- |
| `dataset:created` | dataset object | New dataset uploaded |
| `dataset:updated` | dataset object | Dataset cleaned or updated |
| `annotation:created` | annotation object | New annotation posted |

Each SSE message is formatted as:

```
event: dataset:created
data: {"id":"uuid","name":"Customer Survey"}
```
