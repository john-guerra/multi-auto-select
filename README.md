# multi-auto-select

A simple [reactive widget](https://johnguerra.co/reactiveWidgets) for selecting an ordered list of multiple elements out of a list.

* [See it in action in CodePen](https://codepen.io/duto_guerra/pen/dyxwwdv)
* [Or use it in Observable](https://observablehq.com/@john-guerra/multi-auto-select)

## Usage

```js
<script src="https://cdn.jsdelivr.net/npm/multiAutoSelect.js"></script>
```

then

```js
const domElement = MultiAutoSelect(arrayOfOptions, {...options} )
```

Where _domElement_ will be a DOM Element that you can insert in your DOM using methods like appendChild and _domElement.value_ will be an array of the selected attributes. _domElement_ will dispatch an _input_ event every time the selection changes.

If you are using Observable notebooks you can use the handy _viewof_ operator to get reactive value 

```js
MultiAutoSelect = require("multi-auto-select")

//on a different cell
viewof selection = MultiAutoSelect(arrayOfOptions, {...options} )
```


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
```

[See the demo in CodePen](https://codepen.io/duto_guerra/pen/dyxwwdv)

