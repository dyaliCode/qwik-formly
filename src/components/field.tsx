import { component$, type Component, PublicProps } from "@builder.io/qwik";
import type { FieldProps, } from "../types";

// List fields type component.
import Input from "./fields/input";
import Select from "./fields/select";

// List components of fields.
const components: Record<any, Component<PublicProps<FieldProps>>> = {
  input: Input,
  select: Select,
};

export default component$<FieldProps>((props) => {
  const FieldComponent = components[props.field.type];

  return (
    <FieldComponent
      form={props.form}
      form_name={props.form.form_name}
      field={props.field}
      onChange={props.onChange} />
  );
});
