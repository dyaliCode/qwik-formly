import { $, component$, useSignal, useStore } from '@builder.io/qwik';
import { Formly } from './components/Formly';
import type { Field } from './types';

// export default () => {
export default component$(() => {
  const result = useSignal<string>('default value');
  const values = useSignal<any>({});

  const form_name = 'form1';

  const fields: Field[] = [
    {
      type: 'radio', // required
      name: 'nameRadioA', // required
      attributes: {
        id: 'idRadioA', // required
        classes: ['class-radio'], // optional
        label: 'Radio A:',
      },
      // require
      extra: {
        items: [
          {
            id: 'radio1',
            value: 1,
            title: 'radio 1',
          },
          {
            id: 'radio2',
            value: 2,
            title: 'radio 2',
          },
        ],
        aligne: 'inline', // optional
      },
    },
    {
      type: 'checkbox', // required
      name: 'checkA', // required
      attributes: {
        id: 'checkA', // required
        label: 'CheckboxA', // optional
        classes: ['class-checkbox'], // optional
      },
      // required
      extra: {
        items: [
          {
            name: 'item1',
            value: 'value1',
            title: 'Value 1',
          },
          {
            name: 'item2',
            value: 'value2',
            title: 'Value 2',
          },
        ],
      },
    },
    {
      type: 'input',
      name: 'f1',
      // value: "default-value",
      attributes: {
        type: 'email',
        id: 'f1',
      },
      rules: ['required', 'email'],
      messages: {
        required: 'The field username is required',
      },
    },
    {
      type: 'select',
      name: 'f2',
      attributes: {
        id: 'f2',
      },
      extra: {
        options: [
          {
            value: 1,
            title: 'option 1',
          },
          {
            value: 2,
            title: 'option 2',
          },
        ],
      },
    },
  ];

  // const fields2: Field[] = JSON.parse(JSON.stringify(fields));

  const onSubmit = $((data: any) => {
    console.log('data', data);
    result.value = data.values.f1;
    values.value = data;
    console.log('values', values);
  });

  const onUpdate = $((data: any) => {
    console.log('data', data.value);
    result.value = data.values.f1;
  });

  return (
    <>
      <head>
        <meta charSet='utf-8' />
        <title>Formly</title>
      </head>
      <body>
        <h1>{result.value}</h1>
        <Formly
          form_name={form_name}
          fields={fields}
          onSubmit={onSubmit}
          btnSubmit={{ text: 'Send' }}
          realtime={true}
          onUpdate={onUpdate}
        />
        <pre>{JSON.stringify(values.value, null, 2)}</pre>
      </body>
    </>
  );
});
