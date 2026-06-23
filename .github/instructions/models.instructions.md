---
applyTo: "src/models/**"
---

# Model File Instructions

- Export a single class per file.
- Validate all constructor arguments. Throw a `TypeError` with a
  descriptive message for invalid inputs.
- Keep model schema and field validation inside the model class. Shared validators should only provide generic helpers like string, date, and enum checks.
- Each model class must implement a public `toJSON()` method that returns a plain object containing only its serializable fields.
- Generate unique IDs using `crypto.randomUUID()` wherever needed.
- Add JSDoc comments to the class and every public method.