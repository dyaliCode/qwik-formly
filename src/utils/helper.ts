import { JSXChildren, createElement } from "@builder.io/qwik";
import { Field } from "../types";

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
    attributes = { class: props.classes.join("") };
  }

  return createElement(
    props.tag ?? "div",
    attributes,
    children
  );
}


export function clickOutside(node: any) {
	const handleClick = (event: any) => {
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('click_outside', node));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

