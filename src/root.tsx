import { $, component$, useSignal } from "@builder.io/qwik";
import { Formly } from "./components/Formly";
import type { Field } from "./types";

import "./global.css";

// export default () => {

export default component$(() => {
  const values = useSignal<any>({});

  // Fetch Users
  const fetchUsers = $(async (): Promise<any> => {
    const res = await fetch(
      "https://jsonplaceholder.cypress.io/users?_limit=10"
    );
    const data = await res.json();
    return data.map((item: any) => ({
      value: item.id,
      title: item.name.length > 6 ? item.name.substring(0, 10) : item.name,
    }));
  });

  // Fetch posts
  const fetchPosts = $(async (): Promise<any> => {
    const res = await fetch(
      "https://jsonplaceholder.cypress.io/posts?_limit=10"
    );
    const data = await res.json();
    return data.map((item: any) => ({
      value: item.id,
      title: item.title.length > 6 ? item.title.substring(0, 10) : item.title,
    }));
  });

  const form_name = "form1";

  const fields: Field[] = [
    {
      type: "input", // required
      name: "nameText2", // required
      attributes: {
        type: "text", // default = text, or password, email, number, tel, optional
        id: "idTexts", // required
      },
    },
    {
      type: "input", // required
      name: "nameText", // required
      attributes: {
        type: "text", // default = text, or password, email, number, tel, optional
        id: "idText", // required
      },
    },
    {
      type: "select",
      name: "category",
      attributes: {
        id: "category",
        classes: ["select select-bordered w-full max-w-xs"], // optional
      },
      rules: ["required"],
      extra: {
        options: [
          {
            value: null,
            title: "None",
          },
          {
            value: 1,
            title: "Users",
          },
          {
            value: 2,
            title: "Posts",
          },
        ],
      },
      prefix: {
        tag: "div",
        classes: ["form-group"],
      },
    },
    {
      type: "select",
      name: "items",
      attributes: {
        id: "items",
        classes: ["select select-bordered w-full max-w-xs"],
      },
      extra: {},
      preprocess: $(async (field: Field, _fields, _values) => {
        if (_values.touched === "category") {
          field.extra.options =
            _values.category == 1 ? await fetchUsers() : await fetchPosts();
        }
        return field;
      }),
      prefix: {
        tag: "div",
        classes: ["form-group"],
      },
    },
  ];

  // const fields2: Field[] = JSON.parse(JSON.stringify(fields));

  const onSubmit = $((data: any) => {
    values.value = data;
    console.log("values", values);
  });

  const onUpdate = $((data: any) => {
    console.log("data", data);
  });

  return (
    <>
      <head>
        <meta charSet="utf-8" />
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
                  btnSubmit={{ text: "Send" }}
                  realtime={true}
                  onUpdate={onUpdate}
                  buttonsAction={{
                    classes: ['class-btn-action'],
                    tag: 'div'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <pre>{JSON.stringify(values.value, null, 2)}</pre>
      </body>
    </>
  );
});
