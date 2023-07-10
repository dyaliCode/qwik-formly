import {
  component$,
  $,
  useVisibleTask$,
  useSignal,
} from "@builder.io/qwik";
import type { FieldProps } from "../../types";
import { isRequired } from "../../utils/helper";

interface Item {
  name: string;
  value: any;
  title: string;
  checked: boolean;
}

export default component$<FieldProps>((props) => {
  const { field } = props;
  const values = useSignal<any[]>([]);

  // Init.
  // useVisibleTask$(() => {
  //   if (field.extra.items.length > 0) {
  //     field.extra.items.map((item: any) => {
  //       if (item.checked) {
  //         values.value = [...values.value, item.value];
  //         field.value = field.value ? [...field.value, item.value] : values;
  //       }
  //     });
  //   }
  // })

  const onInput = $(
    async (
      _event: any,
      element: HTMLInputElement
    ): Promise<void> => {
      if (field.extra?.items?.length > 0) {
        field.extra.items.map((item: any) => {
          if (item.name === element.name) {
            if (element.checked) {
              values.value = [...values.value, item.value];
            } else {
              values.value = values.value.filter((value) => value !== item.value);
            }
          }
        });

        props.onChange({ [props.field.name]: values.value });
      }
    });


  return (
    <>
      {field.extra?.items?.map((item: Item) => (
        <>
          <input
            type={field.type}
            class={field.attributes.classes?.join(' ')}
            value={item.value}
            name={item.name}
            checked={item.checked ?? false}
            required={isRequired(field)}
            disabled={field.attributes.disabled}
            onChange$={onInput}
          />
          <span>{item.title}</span>
        </>
      ))}
    </>
  );
});

