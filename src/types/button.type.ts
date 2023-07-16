import { Prefix } from "./field.type";

export interface ActionBtn {
  text?: string;
  classes?: string[];
  prefix?: Prefix;
}

export interface ButtonProps extends ActionBtn {
  type: "submit" | "reset";
}
