# multi-auto-select

A simple [reactive widget](https://johnguerra.co/reactiveWidgets) for selecting an ordered list of multiple elements out of a list.

You can also use it [directly from Observable as seen on this example](https://observablehq.com/@john-guerra/import-observable-notebook-libraries-in-vanila-js)

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
