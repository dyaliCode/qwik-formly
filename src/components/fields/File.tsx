import {
  component$,
  $,
  useVisibleTask$,
  useSignal,
  QwikMouseEvent,
  noSerialize,
} from '@builder.io/qwik';

import type { FieldProps } from '../../types';

export default component$<FieldProps>((props) => {
  const { field } = props;
  const files = useSignal<any[]>([]);
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
    (_event: QwikMouseEvent<HTMLButtonElement, MouseEvent>, file: File) => {
      let newValue;
      files.value = files.value.filter((i) => i.name != file.name);
      if (files.value.length === 0) {
        inputFile.value = null;
        newValue = null;
      } else {
        newValue = files;
      }

      console.log('newValue', newValue);
      // props.onChange({ [props.field.name]: newValue });
    }
  );

  const onChange = $((_event: Event, element: HTMLInputElement) => {
    files.value = [
      ...files.value,
      noSerialize(element.files ? element.files[0] : []), // ArrayLike<File>,
    ];
    // props.onChange({ [props.field.name]: noSerialize(files.value) });
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
              <li>
                <strong>{rule}</strong>: {ruleValue}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        ''
      )}

      {showPreview.value && files.value.length > 0 ? (
        <div class='list-files'>
          {files.value.map((file: File) => (
            <div class='file'>
              <div class='img'>
                <img src={window.URL.createObjectURL(file)} alt={file.name} />
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
                      onClick$={(
                        event: QwikMouseEvent<HTMLButtonElement, MouseEvent>
                      ) => {
                        onDeleteFile(event, file);
                      }}
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
