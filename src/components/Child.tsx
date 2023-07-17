import { PropFunction, component$ } from "@builder.io/qwik";
import { Field } from "../types";

interface MyComponentProps {
  field: Field;
  goodbye$: PropFunction<() => void>;
  hello$: PropFunction<(name: string) => void>;
}
export default component$((props: MyComponentProps) => {
  return (
    <p>
      <button onClick$={props.goodbye$}>good bye</button>
      <button onClick$={async () => await props.hello$('World')}>hello</button>
    </p>
  );
});
