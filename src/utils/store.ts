import { type QRL, createContextId, type Signal } from "@builder.io/qwik";
import type { Form } from "../types";

export type FormsStore = {
  forms: Form[];
  save: QRL<(this: FormsStore, newForm: Form) => void>;
};

export const formsContext = createContextId<Signal<Form>>(
  "formly-forms-context"
);
