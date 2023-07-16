import { component$ } from "@builder.io/qwik";
import { createComponentWithPrefix } from "../../utils/helper";
import type { ButtonProps } from "../../types";

export default component$<ButtonProps>((props: ButtonProps) => {
  const renderButton = () => {
    return (
      <button class={props.classes ?? undefined} type="submit">
        {props.text}
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


