import { type JSXChildren, createElement } from "@builder.io/qwik";
import type { Field } from "../types";

export function isFieldDuplicated(fields: Field[]): boolean {
  const seen: any = {};
  return fields.some(function (currentObject: any) {
    if (
      seen.hasOwnProperty(currentObject.name) ||
      seen.hasOwnProperty(currentObject.attributes.id)
    ) {
      // Current name or id is already seen
      return true;
    }

    // Current name and id is being seen for the first time
    return (
      (seen[currentObject.name] = false),
      (seen[currentObject.attributes.id] = false)
    );
  });
}

export function isRequired(field: Field): boolean {
  if (field.rules) {
    if (field.rules.length > 0) {
      return true;
    }
  }
  return false;
}

export function createComponentWithPrefix(
  children: JSXChildren,
  props: { tag?: string; classes?: string[] }
) {
  let attributes = {};
  if (props.classes?.length) {
    attributes = { class: props.classes.join(" ") };
  }

  return createElement(props.tag ?? "div", attributes, children);
}

export function clickOutside(node: any) {
  const handleClick = (event: any) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent("click_outside", node));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
}
