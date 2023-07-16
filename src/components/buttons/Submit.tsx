import { component$ } from "@builder.io/qwik";
import { createComponentWithPrefix } from "../../utils/helper";
import type { ActionBtn } from "../../types";

export default component$<ActionBtn>((props: ActionBtn) => {
  const renderButton = () => {
    return (
      <button class={props.classes ?? undefined} type="submit">
        {props.text ?? "Submit"}
      </button>
    );
  };

  return (
    <>
      {props.prefix?.tag
        ? createComponentWithPrefix(renderButton(), props.prefix)
        : renderButton()}
    </>
  );
});

