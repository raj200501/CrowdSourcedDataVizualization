# Example Datasets

These datasets are provided to exercise the upload, cleaning, and visualization flows.

## Files

- `customer-feedback.json` — representative customer survey results.
- `supply-chain-snapshot.json` — logistics data with numeric metrics.
- `cleaning-edge-cases.json` — values that demonstrate the cleaning pipeline.

## Usage

Upload with curl:

```bash
curl -X POST http://localhost:5000/api/data/upload \
  -H "Content-Type: application/json" \
  -d @examples/customer-feedback.json
```

> The JSON files contain full payloads including `name`, `uploadedBy`, and `data`.
