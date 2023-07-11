import {
  component$,
  type Component,
  PublicProps,
  $,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { Field, FieldProps, FormProps, Form } from "../types";

// List fields type components.
import Input from "./fields/Input";
import Select from "./fields/Select";
import CheckBox from "./fields/Checkbox";
import Radio from "./fields/Radio";
import File from "./fields/File";
import { preprocess_and_validate_field } from "../utils/form";

// List components of fields.
const components: Record<any, Component<PublicProps<FieldProps>>> = {
  input: Input,
  select: Select,
  checkbox: CheckBox,
  radio: Radio,
  file: File,
};

// Import other components.
import Error from "./Error";

export const Formly = component$<FormProps>((props) => {
  // Current form.
  const current_form = useStore<Form>({
    form_name: props.form_name,
    fields: props.fields,
    values: {},
    valid: true,
  });

  // Values fields.
  const values = useStore<any>({});

  /**
   * Update fields values.
   * Validate fields.
   * Validate form.
   */
  const updateFields = $(async (field_name?: string, field_value?: any): Promise<void> => {
    console.log(field_name, field_value);
    const _fields = await Promise.all(
      current_form.fields.map(async (field: Field) => {
        if (field_name != '' && field_value != null) {
          if (field.name === field_name) {
            field.value = field_value;
          }
        }

        field = await preprocess_and_validate_field(
          current_form,
          field,
          current_form.values
        );

        values[`${field.name}`] = field.value ?? null;

        return field;
      })
    );

    // Find dirty in the current form.
    const dirty = _fields.find((field: Field) => {
      if (field.validation) {
        return field.validation.dirty === true;
      }
    });

    // Update fields, values and status form.
    current_form.fields = _fields;
    current_form.values = values;
    current_form.valid = dirty ? false : true
  });

  useVisibleTask$(async () => {
    console.log(111);
    await updateFields();
  });

  const onChangeValues = $(async (data: any) => {
    console.log(222);
    const field_name = Object.keys(data)[0];
    const field_value = data[field_name];

    await updateFields(field_name, field_value);

    // Semd data form in real time.
    if (props.realtime && props.onUpdate) {
      props.onUpdate({
        values: current_form.values,
        valid: current_form.valid
      });
    }
  });


  // Submit form handler.
  const onSubmitHandler = $(() => {
    if (props.onSubmit) {
      props.onSubmit({
        values: current_form.values,
        valid: current_form.valid
      });
    }
  })

  return (
    <>
      <form preventdefault: submit={true} onSubmit$={onSubmitHandler}>
        {current_form.fields?.map((field: Field, index: number) => {
          const FieldComponent = components[field.type];
          return (
            <>
              <FieldComponent
                field={field}
                key={index}
                onChange={onChangeValues}
              />
              <Error field={field} />
              <hr />
            </>
          );
        })}
        <button type="submit">{props.btnSubmit?.text ?? 'Submit'}</button>
        <button type="reset">{props.btnReset?.text ?? 'Reset'}</button>
      </form>
    </>
  );
});

