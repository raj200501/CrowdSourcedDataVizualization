# Example Workflows

This document walks through complete API flows using `curl`.

> All examples assume the server is running on `http://localhost:5000`.

## Upload a Dataset

```bash
curl -X POST http://localhost:5000/api/data/upload \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sales pipeline",
    "uploadedBy": "jules",
    "description": "Mid-year update",
    "tags": ["sales", "pipeline"],
    "data": [
      {"region": "NA", "amount": 120000, "owner": "A"},
      {"region": "EU", "amount": 94000, "owner": "B"},
      {"region": "APAC", "amount": 101000, "owner": "C"}
    ]
  }'
```

## List Datasets

```bash
curl http://localhost:5000/api/data
```

## Clean a Dataset

```bash
curl -X POST http://localhost:5000/api/data/<DATASET_ID>/clean
```

## Add an Annotation

```bash
curl -X POST http://localhost:5000/api/data/<DATASET_ID>/annotations \
  -H "Content-Type: application/json" \
  -d '{
    "author": "jules",
    "message": "Spot check row 3",
    "metadata": {"row": 3}
  }'
```

## Visualization Summary

```bash
curl http://localhost:5000/api/data/<DATASET_ID>/visualization
```

## Register & Login

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jules",
    "email": "jules@example.com",
    "password": "super-secret"
  }'

curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jules",
    "password": "super-secret"
  }'
```

## SSE Quick Check

Open a browser console and run:

```js
const stream = new EventSource('/api/collaboration/stream');
stream.addEventListener('dataset:created', console.log);
```

Then upload a dataset and observe the event in the console.
