# Data Cleaning Pipeline

The backend provides an opinionated data cleaning step. It focuses on normalizing lightweight JSON datasets without needing a heavy ETL tool.

## Goals

- Remove empty rows and nulls.
- Normalize string values (trim whitespace).
- Convert numeric strings into numbers.
- Preserve structured objects while dropping empty values.

## Pipeline Stages

1. **Normalize values**
   - Strings are trimmed.
   - Empty strings become `null`.
   - Numeric strings are converted to numbers.
2. **Row normalization**
   - Arrays are cleaned value-by-value.
   - Objects are cleaned key-by-key.
3. **Remove empty rows**
   - Null values and empty objects/arrays are dropped.

## Examples

### Input

```json
[
  { "region": " NA ", "score": "95", "note": "" },
  null,
  {},
  { "region": "EU", "score": 88 }
]
```

### Output

```json
[
  { "region": "NA", "score": 95 },
  { "region": "EU", "score": 88 }
]
```

## Extending the Cleaner

The cleaning logic lives in `backend/utils/dataCleaning.js`. You can extend it to:

- Drop columns by name.
- Normalize dates.
- Apply domain-specific rules (e.g., clamp values, canonicalize enums).

When changing the cleaner, add tests in `backend/tests/dataCleaning.test.js` to keep verification deterministic.
