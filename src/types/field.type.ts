import { type QRL } from '@builder.io/qwik';

type FieldType = keyof FieldMap;

interface FieldMap {
  input: {
    type: 'text' | 'password' | 'email';
  };
  date: {
    type: 'text';
  };
  textarea: {
    type: 'text';
  };
  select: null;
  range: {
    type: 'number';
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
    preprocess?: QRL<(data: unknown) => Field>;
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
    autocomplete?: string;
    autocorrect?: string;
    rows?: number;
    cols?: number;
  } & ('type' extends keyof FieldMap[K] ? { type: FieldMap[K]['type'] } : {});
};

export interface Prefix {
  tag: string;
  classes?: string[];
}

const _number = 0;
export type RulesList =
  | 'required'
  | `min:${typeof _number}`
  | `max:${typeof _number}`
  | 'email'
  | 'between'
  | 'file'
  | 'equal'
  | 'url'
  | { name: string; fnc: QRL<() => Promise<boolean>> };

export type FileRules = {
  maxSize?: number;
  extensions?: string[];
};

// Props types.
export interface FieldProps {
  field: Field;
  onChange: QRL<(args?: unknown) => unknown>;
}
