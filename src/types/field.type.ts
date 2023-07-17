import { PropFunction, type QRL } from "@builder.io/qwik";

type FieldType = keyof FieldMap;

interface FieldMap {
  input: {
    type: "text" | "password" | "email";
  };
  date: {
    type: "text";
  };
  textarea: null;
  select: null;
  range: {
    type: "number";
  };
  checkbox: null;
  radio: null;
  file: null;
  autocomplete: null;
}

export type Field = {
  [K in FieldType]: {
    name: string;
    value?: any;
    type: K;
    attributes: Attributes[K];
    prefix?: Prefix;
    rules?: RulesList[];
    messages?: any;
    extra?: any;
    preprocess?: QRL<
      (field: Field, _fields?: Field[], values?: any) => Promise<Field>
    >;
    validation?: any;
    file?: FileRules;
  };
}[FieldType];

type Attributes = {
  [K in FieldType]: {
    id: string;
    label?: string;
    classes?: string[];
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    min?: number;
    max?: number;
    step?: number;
    autoComplete?: string;
    autoCorrect?: string;
    rows?: number;
    cols?: number;
  } & ("type" extends keyof FieldMap[K] ? { type: FieldMap[K]["type"] } : {});
};

export interface Prefix {
  tag: string;
  classes?: string[];
}

export type RulesList =
  | "required"
  | `min:${number}`
  | `max:${number}`
  | "email"
  | "between"
  | "file"
  | "equal"
  | "url"
  | { name: string; fnc: QRL<(values: unknown) => Promise<boolean>> };

export type FileRules = {
  maxSize?: number;
  extensions?: string[];
};

// Props types.
export interface FieldProps {
  field: Field;
  onChange: PropFunction<(field_name: string, field_value?: unknown) => unknown>;
}

export interface AutoCompleteItems {
  title: string;
  value: any;
}
