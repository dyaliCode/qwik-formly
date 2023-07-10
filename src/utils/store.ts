import { type QRL, createContextId, Signal } from "@builder.io/qwik";
import { Form } from "../types";

export type FormsStore = {
  forms: Form[];
  save: QRL<(this: FormsStore, newForm: Form) => void>,
};

export const  formsContext = createContextId<Signal<Form>>("formly-forms-context");

