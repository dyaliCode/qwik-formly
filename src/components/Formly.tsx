import {
  component$,
  $,
  useStore,
  useSignal,
  type Component,
  type PublicProps,
  useTask$,
  type PropFunction,
} from "@builder.io/qwik";
import type { Field, FormProps, Form, FieldProps } from "../types";

// List fields type components.
import Input from "./fields/Input";
import CheckBox from "./fields/Checkbox";
import Select from "./fields/Select";
import Radio from "./fields/Radio";
import File from "./fields/File";
import Textarea from "./fields/Textarea";
import Autocomplete from "./fields/Autocomplete";
import { preprocess_and_validate_field } from "../utils/form";

// List components of fields.
const components: Record<any, Component<PublicProps<FieldProps>>> = {
  input: Input,
  checkbox: CheckBox,
  select: Select,
  radio: Radio,
  file: File,
  textarea: Textarea,
  autocomplete: Autocomplete,
};

// Import other components.
import Error from "./Error";
import { createComponentWithPrefix, isFieldDuplicated } from "../utils/helper";
import Action from "./buttons/Action";

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
  const is_field_duplicated = useSignal<boolean>(false);

  /**
   * Update fields values.
   * Validate fields.
   * Validate form.
   */
  const updateFields = $(
    async (field_name?: string, field_value?: any): Promise<void> => {
      const _fields = await Promise.all(
        current_form.fields.map(async (field: Field) => {
          if (field_name != "" && field_value != null) {
            if (field.name === field_name) {
              values["touched"] = field.name;
              field.value = field_value;
            }
          }

          values[`${field.name}`] = field.value ?? null;

          field = await preprocess_and_validate_field(
            current_form,
            field,
            current_form.values
          );

          return field;
        })
      );

      // Find dirty in the current form.
      const dirty = _fields.find((field: Field) => {
        if (field.validation) {
          // if (field.validation.dirty === true)
          // field.attributes.classes = ['invalid-feedback error']
          return field.validation.dirty === true;
        }
      });

      // Update fields, values and status form.
      current_form.fields = _fields;
      current_form.values = values;
      current_form.valid = dirty ? false : true;
    }
  );

  useTask$(async () => {
    // Check if name/id fields are duplicated.
    is_field_duplicated.value = isFieldDuplicated(current_form.fields);

    if (!is_field_duplicated.value) {
      await updateFields();
    }
  });

  const onChangeValues = $(async (field_name: any, field_value: any) => {
    await updateFields(field_name, field_value);

    // Semd data form in real time.
    if (props.realtime && props.onUpdate) {
      props.onUpdate({
        values: current_form.values,
        valid: current_form.valid,
      });
    }
  });

  // Submit form handler.
  const onSubmitHandler = $(() => {
    if (props.onSubmit) {
      props.onSubmit({
        values: current_form.values,
        valid: current_form.valid,
      });
    }
  });

  return (
    <>
      {is_field_duplicated.value ? (
        <p>
          <code>
            <b>
              A field with a conflicting ID or name attribute has been detected,
              indicating a duplication issue. Each field within the list fields
              must have a unique identifier or name for proper identification
              and functionality.
            </b>
          </code>
        </p>
      ) : (
        <form preventdefault:submit={true} onSubmit$={onSubmitHandler}>
          {current_form.fields.map((field: Field) => (
            FieldElement(field, onChangeValues)
          ))}
          <Action
            prefix={props.buttonsAction}
            btnSubmit={props.btnSubmit}
            btnReset={props.btnReset}
          />
        </form>
      )}
    </>
  );
});

const FieldElement = (field: Field, onChange: PropFunction) => {
  const FieldComponent = components[field.type];

  let fc = (
    <>
      <label for={field.attributes.id}>{field.attributes.label}</label>
      <FieldComponent field={field} onChange={onChange} />
      <Error field={field} />
    </>
  );

  if (field.prefix) {
    fc = createComponentWithPrefix(fc, field.prefix);
  }

  return fc;
};
