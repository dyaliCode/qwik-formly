import type { Field } from "../../types";
import * as CoreRules from "./rules/index";

const coreRules: any = CoreRules;

type Error = {
  rule: string;
  message: string;
};

type Validation = {
  errors: Error[];
  dirty: boolean;
};

const rulesMessages: Error[] = [
  { rule: "required", message: "This field is required" },
  { rule: "min", message: "This field must be more characters long" },
  { rule: "max", message: "This field must be less characters long" },
  { rule: "between", message: "This field must be between values defined" },
  { rule: "equal", message: "This field must be equal to value defined" },
  { rule: "email", message: "This email format is not valid" },
  { rule: "extensions", message: "Must to allowed file types" },
  { rule: "maxSize", message: "This file has size more than max size" },
  { rule: "custom_rule", message: "Error" },
];

const getMessageByRule = (rule: string) => {
  const data = rulesMessages.find((r: Error) => r.rule === rule);
  return data
    ? data.message
    : rulesMessages.find((r: Error) => r.rule === "custom_rule")?.message;
};

/**
 * Validate field by rule.
 * @param {configs field} field
 */
export async function validate(field: Field, values: unknown): Promise<Field> {
  const { value, rules } = field;

  let valid = true;
  let rule: string;
  let errors: Error[] = [];
  let validation: Validation;

  if (rules) {
    await Promise.all(
      rules.map(async (validator: any) => {
        rule = validator.name as string;
        // For file type.
        if (validator === "file") {
          if (value) {
            Object.keys(value).map((i) => {
              if (field.file) {
                Object.entries(field.file).map(([key, val]) => {
                  const _coreRules = coreRules[key];
                  valid = _coreRules.call(null, value[i], val);
                });
              }
            });
          }
        } else {
          // For custom rule.
          if (typeof validator === "function") {
            valid = await validator.call;
          } else if (typeof validator === "object") {
            valid = await validator.fnc(values);
          } else {
            const args = validator.split(/:/g);
            rule = args.shift();
            valid = coreRules[rule].call(null, value, args);
          }
        }
        if (!valid) {
          const err = {
            rule,
            message: getMessageByRule(rule) ?? "",
          };
          errors = [...errors, err];
        }
      })
    );
    validation = { errors, dirty: errors.length > 0 };
  } else {
    validation = { errors, dirty: false };
  }

  field.validation = validation;

  return field;
}
