# Qwik Formly

by [@kamalkech](https://github.com/kamalkech)

## Introduction

- ⚡️ Generate dynamic and reactive forms.
- 😍 Easy to extend with custom field type, custom validation.

## Documentation

For qwik it will be soon here [Link Documentation](https://www.formly-js.com/)

## Quick Installation

```shell
npm install qwik-formly
```

## Usage

```typescript
import { component$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Formly, type Field } from "qwik-formly";

export default component$(() => {
  const fields: Field[] = [
    {
      type: "input", // required
      name: "username", // required
      attributes: {
        type: 'text',
        id: "username", // required
        label: "Username", // optional
        classes: ["class-username"],
        placeholder: 'Username'
      },
    },
    {
      type: "input", // required
      name: "email", // required
      attributes: {
        type: 'email',
        id: "email", // required
        label: "Email", // optional
        classes: ["class-email"],
        placeholder: 'Email'
      },
    },
    {
      type: "checkbox", // required
      name: "checkA", // required
      attributes: {
        id: "checkA", // required
        label: "CheckboxA", // optional
        classes: ["class-checkbox"], // optional
      },
      // required
      extra: {
        items: [
          {
            name: "item1",
            value: "value1",
            title: "Value 1",
          },
          {
            name: "item2",
            value: "value2",
            title: "Value 2",
          },
        ],
      },
      prefix: {
        tag: 'fieldset',
        classes: ['class1', 'class2'],
      }
    },
  ]

  const onSubmit = $((data: any) => {
    console.log('data', data);
  })

  return (
    <>
      <h1>Formly</h1>
      <Formly form_name={'form1'} fields={fields} onSubmit={onSubmit} />
    </>
  );
});

export const head: DocumentHead = {
  title: "Qwik Formly",
  meta: [
    {
      name: "description",
      content: "Formly with qwik",
    },
  ],
};
```

