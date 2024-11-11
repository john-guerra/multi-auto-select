import { html } from "htl";
import Sortable from "sortablejs";

import { uid } from "./DOM.js";
import ReactiveWidget from "reactive-widget-helper";

export default function MultiAutoSelect() {
  let config;
  // To behave like other Input.checkboxes with two parameters
  if (arguments.length === 1) {
    config = arguments[0];
  } else {
    config = arguments[1];
    config.options = arguments[0];
  }

  let {
    value = [], // The selected values, an array
    options, // An array of options
    label = "", // Label to show next to the input
    placeholder, // Placeholder text
    id = uid("autoSelect").id,
    attr = (d) => d, // an accessor on what attribute of the object to use
    title, // The title of the widget, a header on top
    description, // Small text description on the bottom
    disabled, // If the input is disabled
    format = (d) => d, // Format the value when selected
    style, // CSS style
    autocomplete = "off",
    debug = false,
  } = Array.isArray(config) ? { options: config } : config;

  let sortable = null;

  const optionsMap = new Map(options.map((o) => ["" + attr(o), o])); // We need the map with strings

  // Ensure value is an array amongst the valid options
  value = value
    ? Array.isArray(value)
      ? value.filter((d) => optionsMap.has(d))
      : [value]
    : [];

  // Adds the current input value to the selected id
  const addToSelected = () => {
    if (debug)
      console.log(
        "addToSelected",
        fmInput.value,
        optionsMap.has(fmInput.value)
      );
    if (
      optionsMap.has(fmInput.value) && // It is an option
      form.value.map((d) => "" + d).indexOf(fmInput.value) === -1 // If it hasn't been selected.  Need to convert to strings to do the comparison for numbers
    ) {
      form.setValue(form.value.concat(optionsMap.get(fmInput.value)));
      fmInput.value = "";
    }
  };

  function removeOption(d) {
    if (debug) console.log("Click remove", d, form.value);
    form.setValue(form.value.filter((old) => old !== d));
    fmInput.focus();
  }

  // Renders one option
  const renderSelected = (d) => {
    const button = html`<button type="button" class="remove">&times;</button>`;
    const ele = html`<span class="pill">${format(attr(d))} ${button}</span>`;

    button.addEventListener("click", () => removeOption(d));

    return ele;
  };

  // Renders the current value as pills
  function renderSelection() {
    if (debug) console.log("renderSelection", form.value);
    fmOutput.innerHTML = "";
    form.value.map((v) => fmOutput.appendChild(renderSelected(v)));

    fmDatalist.innerHTML = "";
    // Update remaining options
    options
      .filter((o) => !form.value.includes(o))
      .map((d) =>
        fmDatalist.appendChild(
          Object.assign(html`<option></option>`, {
            value: attr(d),
          })
        )
      );
  }

  const fmOutput = html`<output
    name="output"
    class="selected-options"
  ></output>`;
  const fmInput = html`<input
    name="input"
    type="text"
    autocomplete=${autocomplete || "off"}
    placeholder="${placeholder || ""}"
    list=${id}
  />`;
  disabled && fmInput.setAttribute("disabled", true);
  const fmDatalist = html`<datalist id="${id}"></datalist>`;
  const removeArea = html`<span id="remove-area"></span>`;

  const form = ReactiveWidget(
    html`
      <form style="min-height: 2.5em" class="multi-auto-select">
        <style>
          .sortable-ghost {
            opacity: 0.3;
          }
          .pill {
            display: inline-block;
            margin: 7px 2px;
            border: solid 1px #ccc;
            border-radius: 5px;
            padding: 3px 6px;
            cursor: move;
            box-shadow: 1px 1px 1px #777;
            background: white;
          }
          .title {
            font: 700 0.9rem sans-serif;
            margin-bottom: 3px;
          }
          .description {
            font-size: 0.85rem;
            font-style: italic;
            margin-top: 3px;
          }
          input {
            font-size: 1em;
          }
          .selected-options {
            font:
              14px Menlo,
              Consolas,
              monospace;
            margin-left: 0px;
          }
          button.remove {
            margin: 0px;
            padding: 3px;
          }
          .options #remove-area {
            display: none;
            border: 2px dashed #f60;
            height: 100%;
          }
          #remove-area::before {
            color: #ccc;
            font-size: 1.2em;
            content: 'Remove';
            text-align: center;
            padding-top: 15px;
          }

          ${style}
        </style>
        <div class="title">${title}</div>
        <div>
          ${label ? html`<label>${label}</label>` : ""} ${fmInput}${fmDatalist}
        </div>

        <div class="options">${fmOutput} ${removeArea}</div>
        <div class="description">${description}</div>
      </form>
    `,
    { value, showValue: renderSelection }
  );

  fmInput.addEventListener("input", function (e) {
    e.stopPropagation();
    if (debug) console.log("multiAutoSelect input", e);

    // Avoid adding the selection when still writing. Happens with numbers 🤷🏼‍♂️
    if (
      e.inputType === "insertReplacementText" ||
      e.inputType === undefined // triggered when selecting from the datalist
    ) {
      addToSelected();
    }
  });
  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    addToSelected();
  });

  renderSelection();

  if (sortable) sortable.destroy();
  sortable = Sortable.create(fmOutput, {
    ghostClass: "sortable-ghost",
    animation: 150,
    group: {
      name: "shared",
      pull: "clone",
    },
    onUpdate: () => {
      form.setValue(
        [...fmOutput.childNodes].map((a) => a.childNodes[0].nodeValue.trim())
      );
      removeArea.style.display = "none";
    },
  });

  fmOutput.addEventListener("dragstart", () => {
    removeArea.style.display = "inline-block";
  });
  fmOutput.addEventListener("dragend", () => {
    removeArea.style.display = "none";
  });
  Sortable.create(removeArea, {
    group: {
      name: "shared",
      put: true,
    },
    onAdd: function (evt) {
      if (debug)
        console.log(
          "removeArea",
          evt.item.childNodes[0].nodeValue.trim(),
          options.filter(
            (o) => format(attr(o)) === evt.item.childNodes[0].nodeValue.trim()
          )
        );
      removeOption(
        options.filter(
          (o) => format(attr(o)) === evt.item.childNodes[0].nodeValue.trim()
        )[0]
      );
      evt.item.remove();
      removeArea.style.display = "none";
    },
  });

  return form;
}
