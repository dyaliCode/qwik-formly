import {
  component$,
  $,
  useSignal,
  PropFunction,
} from "@builder.io/qwik";
import { isRequired } from "../../utils/helper";
import type { Field } from "../../types";

export interface FieldPropsInput {
  field: Field;
  onChange: PropFunction<(field_name: string, args?: unknown) => unknown>;
}

export default component$<FieldPropsInput>((props: FieldPropsInput) => {
  const field = useSignal<Field>(props.field);

  const onChange = $((_event: Event, element: HTMLInputElement) => {
    const field_name = element.name;
    const value = element.value;
    props.onChange(field_name, value);
  });

  return (
    <>
      <input
        name={field.value.name}
        value={field.value.value ?? null}
        type={field.value.type}
        id={field.value.attributes.id}
        class={field.value.attributes?.classes?.join(" ")}
        placeholder={field.value.attributes?.placeholder}
        required={isRequired(field.value)}
        disabled={field.value.attributes?.disabled}
        readOnly={field.value.attributes?.readonly}
        min={field.value.attributes?.min}
        max={field.value.attributes?.max}
        step={field.value.attributes?.step}
        autoComplete={field.value.attributes?.autoComplete}
        autoCorrect={field.value.attributes?.autoCorrect}
        onInput$={onChange}
      />
    </>
  );
});
