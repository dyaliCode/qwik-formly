import {
  component$,
  $,
  useSignal,
  useVisibleTask$,
  useStylesScoped$,
} from "@builder.io/qwik";
import type { AutoCompleteItems, FieldProps } from "../../types";

export default component$<FieldProps>((props) => {
  useStylesScoped$(`
    .autocomplete-wrapper {
      position: relative;
      width: 100%;
    }

    .autocomplete-wrapper .selected-items {
      margin-bottom: 10px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-content: flex-start;
      gap: 10px;
    }

    .autocomplete-wrapper .selected-items .item {
      font-size: 0.75rem;
      padding: 0.5rem;
      background-color: #ff3e00;
      color: white;
      border-radius: 5px;
    }

    .autocomplete-wrapper .selected-items .item .deselect {
      border-radius: 50%;
      width: 15px;
      height: 15px;
      padding: 2px 7px 3px 7px;
      font-size: 0.6rem;
      background-color: #333333;
      border: solid 1px rgba(255, 255, 255, 0.2);
      color: white;
    }
    .autocomplete-wrapper .selected-items .item .deselect:hover {
      box-shadow: 0px 0px 4px 1px rgba(255, 255, 255, 0.8);
    }

    .deselect {
      cursor: pointer;
    }

    .list-items {
      box-shadow: 0 2px 3px 0 rgba(249, 251, 253, 0.24);
      margin-bottom: 20px;
    }

    .list-items ul, .list-items ul li {
      list-style: none;
      padding: 0;
      margin: 0;
      color: black;
      background-color: rgb(201, 201, 201);
    }

    .list-items li {
      border-bottom: 1px dashed #999999;
      padding: 0.75rem;
      cursor: pointer;
    }
    .list-items li.done {
      background-color: #1f2d38 !important;
      border-bottom-color: transparent;
      color: white;
      text-align: center;
    }
    .list-items li.done:hover {
      border-bottom-color: transparent;
    }
    .list-items li:hover {
      background-color: #ff40009c;
      border-bottom: 1px dashed #ff3e00;
      color: white;
    }
  `);

  const { field } = props;

  const value = useSignal(null);
  const items = useSignal<AutoCompleteItems[]>([]);
  const itemsFiltered = useSignal<AutoCompleteItems[]>([]);
  const selectedItems = useSignal<AutoCompleteItems[]>([]);
  const filter_length = useSignal<number>(0);
  const showList = useSignal<boolean>(false);

  useVisibleTask$(() => {
    if (field.extra) {
      if (field.extra.loadItemes) {
        items.value = field.extra.loadItemes;
      }
      if (field.extra.filter_length) {
        filter_length.value = field.extra.filter_length;
      }
    }
  });

  const onFilter = $((_event: Event, element: HTMLInputElement) => {
    const keyword = element.value;

    if (keyword.length > filter_length.value) {
      const filtered = items.value.filter((item: any) => {
        return item.title.toLowerCase().includes(keyword.toLowerCase());
      });
      if (filtered.length) {
        itemsFiltered.value = filtered;
      } else {
        itemsFiltered.value = [];
      }
      itemsFiltered.value.length
        ? (showList.value = true)
        : (showList.value = false);
    } else {
      showList.value = false;
    }
  });

  const onSelectItem = $((item: any) => {
    // showList = false;
    value.value = null;
    items.value = items.value.filter((_item) => _item.value !== item.value);
    itemsFiltered.value = itemsFiltered.value.filter(
      (_item) => _item.value !== item.value
    );
    selectedItems.value = [...selectedItems.value, item];

    if (!items.value.length) {
      showList.value = false;
    }

    // props.onChange({ [props.field.name]: selectedItems.value });
    props.onChange(field.name, selectedItems.value);
  });

  const onDeselectItem = $((item: any) => {
    selectedItems.value = selectedItems.value.filter(
      (_item) => _item.value !== item.value
    );
    items.value = [...items.value, item];
    itemsFiltered.value = [...itemsFiltered.value, item];
    props.onChange(field.name, selectedItems.value);
  });

  const onClickOutside = $(() => {
    showList.value = false;
  });

  return (
    <div class="autocomplete-wrapper">
      <div class="selected-items">
        {selectedItems.value.map((item: AutoCompleteItems, index: number) => (
          <div key={index} class="item">
            <span>{item.title}</span>
            <span class="deselect" onClick$={() => onDeselectItem(item)}>
              x
            </span>
          </div>
        ))}
      </div>

      <input
        type="text"
        id={field.attributes.id}
        class={field.attributes.classes?.join(" ")}
        placeholder={field.attributes.placeholder}
        autoComplete={field.attributes.autoComplete}
        autoCorrect={field.attributes.autoCorrect}
        onInput$={onFilter}
      />

      {itemsFiltered.value.length && showList.value ? (
        <div class="list-items" onClick$={() => onClickOutside}>
          <ul>
            {itemsFiltered.value.map(
              (item: AutoCompleteItems, index: number) => (
                <li key={index} onClick$={() => onSelectItem(item)}>
                  {item.title}
                </li>
              )
            )}
            <li
              class="done"
              onClick$={() => {
                showList.value = false;
                value.value = null;
              }}
            >
              Close
            </li>
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
});
