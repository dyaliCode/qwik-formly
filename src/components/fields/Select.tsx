import {
  component$,
  $,
  QwikChangeEvent,
} from "@builder.io/qwik";
import type { FieldProps } from "../../types";
import { isRequired } from "../../utils/helper";

export default component$<FieldProps>((props) => {
  const { field } = props;
  const is_multiple = field.extra?.multiple ?? false;

  const onChange = $(
    (
      _event: QwikChangeEvent<HTMLSelectElement>,
      element: HTMLSelectElement
    ) => {
      const value = element.value;
      props.onChange({ [props.field.name]: value });
    }
  );

  const checkSelected = (option_value: any, field_value: any): boolean => {
    if (is_multiple) {
      if (field_value && field_value.length) {
        const res = field_value.indexOf(option_value) != -1;
        return res;
      } else if (field.value && field.value.length) {
        const res = field.value.indexOf(option_value) != -1;
        return res;
      }
      return false;
    }
    return option_value == field_value;
  };

  return (
    <select
      name={field.name}
      id={field.attributes?.id}
      class={field.attributes?.classes?.join(" ")}
      required={isRequired(field)}
      disabled={field.attributes?.disabled}
      multiple={
        field.extra && field.extra?.multiple ? field.extra.multiple : false
      }
      onChange$={onChange}
    >
      {field.extra
        ? field.extra?.options
          ? field.extra?.options.map((item: any, key: number) => (
            <option
              key={key}
              value={item.value}
              selected={checkSelected(item.value, field.value)}
            >
              {item.title}
            </option>
          ))
          : ""
        : ""}
    </select>
  );
});
