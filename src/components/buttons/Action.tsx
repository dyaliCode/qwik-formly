import { component$ } from "@builder.io/qwik";
import { createComponentWithPrefix } from "../../utils/helper";
import type { Btn, Prefix } from "../../types";
import Button from "./Button";

type Props = {
  btnSubmit?: Btn;
  btnReset?: Btn;
  prefix?: Prefix;
  buttonsAction?: Prefix;
};

export default component$<Props>((props: Props) => {
  const renderAction = () => {
    return (
      <>
        <Button
          type="submit"
          prefix={props.btnSubmit?.prefix}
          classes={props.btnSubmit?.classes}
          text={props.btnSubmit?.text ?? "Submit"}
        />
        <Button
          type="reset"
          prefix={props.btnReset?.prefix}
          classes={props.btnReset?.classes}
          text={props.btnReset?.text ?? "Reset"}
        />
      </>
    );
  };

  return (
    <>
      {props.prefix?.tag
        ? createComponentWithPrefix(renderAction(), props.prefix)
        : renderAction()}
    </>
  );
});


