import { $, component$, useSignal } from '@builder.io/qwik';
import { Formly } from './components/Formly';
import type { Field } from './types';

import "./global.css";

// export default () => {

export default component$(() => {
  const result = useSignal<string>('default value');
  const values = useSignal<any>({});

  const itemLength = $(async (values: any) => {
    if (values['name-field-autocomplete']?.length > 2) {
      return true
    }
    return false;
  })

  const form_name = 'form1';

  const fields: Field[] = [
    {
      type: "textarea", // required
      name: "nameTextarea", // required
      value: "", // optional
      attributes: {
        id: "idTextarea", // required
        classes: ["input input-bordered"], // optional
      },
      prefix: {
        tag: 'div',
        classes: ['class1']
      }
    },
    // {
    //   type: 'input',
    //   name: 'f1',
    //   // value: "default-value",
    //   attributes: {
    //     id: 'f1',
    //     type: 'email',
    //     classes: ["input input-bordered"], // optional
    //   },
    // },

    {
      type: "autocomplete", // required
      name: "name-field-autocomplete", // required
      attributes: {
        id: "id-field-autocomplete", // required
        placeholder: "Tap item to select", // optional
        autocomplete: "off", // optional
        classes: ['input input-bordered']
      },
      extra: {
        filter_lenght: 3, // optional and by default = 0
        loadItemes: [
          // required
          // list items with id and title attributes.
          {
            value: 1,
            title: "item 1",
          },
          {
            value: 2,
            title: "item 2",
          },
          {
            value: 3,
            title: "item 3",
          },
          {
            value: 4,
            title: "item 4",
          },
        ],
      },
      rules: [
        {
          name: 'itemLength',
          fnc: itemLength,
        }
      ]
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
    // console.log('data', data.values['name-field-autocomplete'][0].title);
    // result.value = data.values.f1;
    console.log('data', data)
  });

  return (
    <>
      <head>
        <meta charSet='utf-8' />
        <title>Formly</title>
      </head>
      <body data-theme="dark">
        <div class="hero min-h-screen bg-base-200">
          <div class="hero-content flex-col lg:flex-row-reverse">
            <div class="text-center lg:text-left">
              <h1 class="text-5xl font-bold">Qwik Formly</h1>
            </div>
            <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <div class="card-body">
                <Formly
                  form_name={form_name}
                  fields={fields}
                  onSubmit={onSubmit}
                  btnSubmit={{ text: 'Send' }}
                  realtime={true}
                  onUpdate={onUpdate}
                />
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Email</span>
                  </label>
                  <input type="text" placeholder="email" class="input input-bordered" />
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Password</span>
                  </label>
                  <input type="text" placeholder="password" class="input input-bordered" />
                  <label class="label">
                    <a href="#" class="label-text-alt link link-hover">Forgot password?</a>
                  </label>
                </div>
                <div class="form-control mt-6">
                  <button class="btn btn-primary">Login</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <pre>{JSON.stringify(values.value, null, 2)}</pre>
      </body>
    </>
  );
});
