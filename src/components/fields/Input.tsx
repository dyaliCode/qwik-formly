import { component$, $ } from "@builder.io/qwik";
import type { FieldProps } from "../../types";
import { isRequired } from "../../utils/helper";

export default component$<FieldProps>((props) => {
  const { field } = props;

  const onChange = $(
    (
      _event: Event,
      element: HTMLInputElement
    ) => {
      const value = element.value;
      props.onChange({ [props.field.name]: value });
    }
  );

  return (
    <input
      value={field.value ?? null}
      type={field.type}
      id={field.attributes.id}
      class={field.attributes.classes?.join(" ")}
      placeholder={field.attributes.placeholder}
      required={isRequired(field)}
      disabled={field.attributes.disabled}
      readOnly={field.attributes.readonly}
      min={field.attributes.min}
      max={field.attributes.max}
      step={field.attributes.step}
      // autoComplete={field.attributes.autoComplete}
      onInput$={onChange}
    />
  );
});
