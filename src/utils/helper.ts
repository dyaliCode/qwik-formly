import { Field } from "../types";

export function isRequired(field: Field): boolean {
  if (field.rules) {
    if (field.rules.length > 0) {
      return true;
    }
  }
  return false;
} 
