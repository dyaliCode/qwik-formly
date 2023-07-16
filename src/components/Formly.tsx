import {
  component$,
  type Component,
  PublicProps,
  $,
  useStore,
  useVisibleTask$,
  QRL,
  useSignal,
} from "@builder.io/qwik";
import type { Field, FieldProps, FormProps, Form } from "../types";

// List fields type components.
import Input from "./fields/Input";
import Select from "./fields/Select";
import CheckBox from "./fields/Checkbox";
import Radio from "./fields/Radio";
import File from "./fields/File";
import Textarea from "./fields/Textarea";
import Autocomplete from "./fields/Autocomplete";
import { preprocess_and_validate_field } from "../utils/form";

// List components of fields.
const components: Record<any, Component<PublicProps<FieldProps>>> = {
  input: Input,
  select: Select,
  checkbox: CheckBox,
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
  const updateFields = $(async (field_name?: string, field_value?: any): Promise<void> => {
    const _fields = await Promise.all(
      current_form.fields.map(async (field: Field) => {
        if (field_name != '' && field_value != null) {
          if (field.name === field_name) {
            values['touched'] = field.name;
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
        return field.validation.dirty === true;
      }
    });

    // Update fields, values and status form.
    current_form.fields = _fields;
    current_form.values = values;
    current_form.valid = dirty ? false : true
  });

  useVisibleTask$(async () => {
    // Check if name/id fields are duplicated.
    is_field_duplicated.value = isFieldDuplicated(current_form.fields);
    if (!is_field_duplicated.value) {
      await updateFields();
    }
  });

  const onChangeValues = $(async (data: any) => {
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
      {is_field_duplicated.value ? (
        <p>
          <code>
            <b>
              A field with a conflicting ID or name attribute has been detected, indicating a duplication issue. Each field within the list fields must have a unique identifier or name for proper identification and functionality.
            </b>
          </code>
        </p>
      ) : (
        <form preventdefault: submit={true} onSubmit$={onSubmitHandler}>
          {current_form.fields?.map((field: Field, index: number) => {
            const fc = <FieldWithoutTag key={index} field={field} onChangeHandler={onChangeValues} />

            return (
              <>
                {field.prefix?.tag
                  ? createComponentWithPrefix(fc, field.prefix)
                  : fc
                }
              </>
            )
          })}
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

interface FieldCompProps {
  field: Field;
  onChangeHandler: QRL<(data: unknown) => void>;
}

// Without TAG.
const FieldWithoutTag = component$<FieldCompProps>((props) => {
  const { field } = props;

  const FieldComponent = components[field.type];

  return (
    <>
      {field.attributes.label && (
        <label for={field.attributes.id}>
          {field.attributes.label}
        </label>
      )}
      <FieldComponent
        field={field}
        onChange={props.onChangeHandler}
      />
      <Error field={field} />
    </>
  )
})
