import { component$ } from '@builder.io/qwik';
import type { Field } from '../types';

export default component$<{ field: Field }>(({ field }) => {
  return field.validation?.errors?.map((error: any, k: number) => {
    return (
      <div key={k} class='invalid-feedback error'>
        {field.messages && field.messages[error.rule]
          ? field.messages[error.rule]
          : error.message}
      </div>
    );
  });
});
