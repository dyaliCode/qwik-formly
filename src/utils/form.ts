import type { Form, Field } from "../types";
import { validate } from "./validation";

export async function preprocessField(
  field: Field,
  fields: Field[],
  values: any
): Promise<Field> {
  const fnc = field.preprocess;
  const _field = fnc?.call(null, field, fields, values) ?? field;
  return _field;
}

export async function preprocess_and_validate_field(
  form: Form,
  field: Field,
  values: any
): Promise<Field> {
  // 1.preprocess
  if (field.preprocess) {
    field = await preprocessField(field, form.fields, values);
    values[`${field.name}`] = field.value ?? null;
  }

  // 2.validation
  if (field.rules) {
    field = await validate(field, values);
  }

  return field;
}
