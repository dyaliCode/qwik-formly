import { component$, $ } from "@builder.io/qwik";
import type { FieldProps } from "../../types";

interface Item {
  name: string;
  value: any;
  title: string;
  checked: boolean;
  id: string;
}

export default component$<FieldProps>((props) => {
  const { field } = props;

  const onInput = $(
    async (
      _event: any,
      element: HTMLInputElement
    ): Promise<void> => {
      const value = element.value;
      props.onChange({ [props.field.name]: value });
    });

  return (
    <>
      {field.extra?.items?.map((item: Item) => (
        <>
          <input
            type={field.type}
            class={field.attributes?.classes?.join(' ')}
            id={item.id}
            name={field.name}
            value={item.value}
            checked={item.value == field.value}
            onInput$={onInput}
          />
          <span>{item.title}</span>
        </>
      ))}
    </>
  );
});


