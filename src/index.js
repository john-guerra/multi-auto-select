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
    value = [],
    title,
    description,
    disabled,
    // autocomplete = "off",
    placeholder,
    // size,
    options,
    label = "",
    list = uid("autoSelect").id,
    // list = "__autoSelect",
    attr = (d) => d, // an accessor on what attribute of the object to use
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

  // Adds the current input value to the selected list
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

  // Renders one option
  const renderSelected = (d) => {
    const button = html`<button type="button" style="margin:0px; padding:0px;">
      ✖️
    </button>`;
    const ele = html`<span
      style="display: inline-block; margin: 7px 2px; border: solid 1px #ccc; border-radius: 5px;padding: 3px 6px; cursor:move; box-shadow: 1px 1px 1px #777; background: white"
      >${attr(d)} ${button}</span
    >`;

    function removeOption() {
      if (debug)
        console.log(
          "Click remove",
          d,
          form.value,
          form.value.filter((old) => old !== d)
        );
      form.setValue(form.value.filter((old) => old !== d));
      // remove the element directly
      ele.remove();
      fmInput.focus();
    }

    button.addEventListener("click", removeOption);

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
    style="font: 14px Menlo, Consolas, monospace; margin-left: 0px;"
  ></output>`;
  const fmInput = html`<input     
    name="input"
    type="text"
    autocomplete="off"
    placeholder="${placeholder || ""}"
    style="font-size: 1em;"
    list=${list}
  />`;
  disabled && fmInput.setAttribute("disabled", true);
  const fmDatalist = html`<datalist id="${list}"></datalist>`;

  
  const form = ReactiveWidget(
    html`
      <form style="min-height: 2.5em">
        <style>
          .sortable-ghost {
            opacity: 0.3;
          }
        </style>
        <div style="font: 700 0.9rem sans-serif; margin-bottom: 3px;">
          ${title}
        </div>
        <div>${label ? html`<label>${label}</label>` : ""} ${fmInput}</div>
        ${fmDatalist} ${fmOutput}
        <div style="font-size: 0.85rem; font-style: italic; margin-top: 3px;">
          ${description}
        </div>
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
  });

  //Update event will be triggered when the user drag the selected components
  Sortable.utils.on(fmOutput, "update", () => {
    form.setValue(
      [...fmOutput.childNodes].map((a) => a.childNodes[0].nodeValue.trim())
    );
  });

  return form;
}
