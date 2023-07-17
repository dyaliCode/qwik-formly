import {
  component$,
  $,
  useVisibleTask$,
  useSignal,
  noSerialize,
  NoSerialize,
} from '@builder.io/qwik';

import type { FieldProps } from '../../types';
import { Image } from '@unpic/qwik';

export default component$<FieldProps>((props) => {
  const { field } = props;
  const files = useSignal<undefined | NoSerialize<File[]>>(undefined);
  const multiple = useSignal<boolean>(field.extra?.multiple ?? false);
  const showPreview = useSignal<boolean>(field.extra?.showPreview ?? false);
  const inputFile = useSignal<any>(null);

  useVisibleTask$(() => {
    if (field.extra) {
      multiple.value = field.extra.multiple ? field.extra.multiple : null;
      showPreview.value = field.extra.showPreview
        ? field.extra.showPreview
        : null;
    }
  });

  const onDeleteFile = $(
    (file: any) => {
      let newValue;
      files.value?.filter((i: File) => i.name != file.name);
      if (files.value?.length === 0) {
        inputFile.value = null;
        newValue = null;
      } else {
        newValue = files.value;
      }

      props.onChange({ [props.field.name]: newValue });
    }
  );

  const onChange = $((_event: Event, element: HTMLInputElement) => {
    files.value = noSerialize([]);
    if (element.files) {
      Array.from(element.files).map((file: File) => {
        files.value?.push(file);
      })

      props.onChange({ [props.field.name]: files.value });
    }
  });

  return (
    <>
      <input
        type={field.type}
        name={field.name}
        id={field.attributes.id}
        class={field.attributes.classes?.join(' ')}
        multiple={multiple.value}
        onInput$={onChange}
      />

      {field.file ? (
        <div class='file-rules'>
          <ul>{JSON.stringify(Object.entries(field.file), null, 2)}</ul>
          <ul>
            {Object.entries(field.file).map(([rule, ruleValue]: any) => (
              <li key={rule}>
                <strong>{rule}</strong>: {ruleValue}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        ''
      )}

      {showPreview.value ? (
        <div class='list-files'>
          {files.value?.map((file: any, key: number) => (
            <div class='file' key={key}>
              <div class="img">
                <Image
                  src={file.url}
                  layout="constrained"
                  width={800}
                  height={600}
                />
              </div>

              <div class='infos'>
                <ul>
                  <li>Name: {file.name}</li>
                  <li>Size: {file.size}</li>
                  <li>Type: {file.type}</li>
                  <li>
                    <button
                      type='button'
                      class='btn'
                      onClick$={() => onDeleteFile(file)}
                    >
                      Remove
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        ''
      )}
    </>
  );
});
