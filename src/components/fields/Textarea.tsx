import { component$, $ } from "@builder.io/qwik";
import type { FieldProps } from "../../types";
import { isRequired } from "../../utils/helper";

export default component$<FieldProps>((props) => {
  const { field } = props;

  const onChange = $((_event: Event, element: HTMLTextAreaElement) => {
    const value = element.value;
    props.onChange(field.name, value);
  });

  return (
    <textarea
      value={field.value ?? null}
      id={field.attributes.id}
      class={field.attributes.classes?.join(" ")}
      placeholder={field.attributes.placeholder}
      required={isRequired(field)}
      disabled={field.attributes.disabled}
      readOnly={field.attributes.readonly}
      rows={field.attributes.rows}
      cols={field.attributes.cols}
      onInput$={onChange}
    />
  );
});
