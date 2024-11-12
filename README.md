# multi-auto-select

A simple [reactive widget](https://johnguerra.co/reactiveWidgets) for selecting an ordered list of multiple elements out of a list.

You can also use it [directly from Observable as seen on this example](https://observablehq.com/@john-guerra/import-observable-notebook-libraries-in-vanila-js)

## Usage

npm install multi-auto-select

## Options


```js
{
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
  sortable = true, // Enable or disable sorting
  debug = false
}
```    

## Example Usage

```js
<div id="target"></div>
<div id="status"></div>

<script src="https://cdn.jsdelivr.net/npm/sortablejs"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-format"></script>
<script src="https://cdn.jsdelivr.net/npm/multiAutoSelect.js"></script>

<script>
  // create your input, returns an html input element
  const myInput = MultiAutoSelect(["a", "b", "c"], {
    label: "Select some options",
    value: ["b", "a"],
  });

  // Listen to input events
  const onInput = () => {
    document.getElementById("status").innerText =
      `Current Selection ${myInput.value.join(", ")}`;
  };
  myInput.addEventListener("input", onInput);
  onInput();

  // Append your input element to the page
  document.getElementById("target").appendChild(myInput);
</script>
``
```

