# Visualization Summary

The visualization endpoint (`GET /api/data/:id/visualization`) returns a compact JSON summary. The front-end renders this as a simple bar-style overview.

## Summary Fields

- `rowCount`: Number of rows in the dataset.
- `columnCount`: Number of unique keys detected.
- `columns`: List of column names.
- `columnStats`: Per-column metrics.

Each column summary includes:

- `count`: Number of non-null values.
- `uniqueCount`: Number of distinct values.
- `uniqueValues`: Up to 8 sampled values (stringified).
- `min`, `max`, `mean`: Provided if the column has numeric values.

## Example

```json
{
  "rowCount": 3,
  "columnCount": 2,
  "columns": ["region", "score"],
  "columnStats": {
    "region": {
      "count": 3,
      "uniqueCount": 3,
      "uniqueValues": ["NA", "EU", "APAC"]
    },
    "score": {
      "count": 3,
      "uniqueCount": 3,
      "uniqueValues": ["95", "88", "92"],
      "min": 88,
      "max": 95,
      "mean": 91.67
    }
  }
}
```

## Extending Visualization

To add richer summaries:

1. Modify `backend/utils/visualization.js`.
2. Add tests for your computed metrics.
3. Update the UI rendering in `frontend/public/app.js`.

Consider:

- Bucketing numeric values into histograms.
- Grouping categorical values.
- Highlighting anomalies.
