# multi-auto-select

A simple [reactive widget](https://johnguerra.co/reactiveWidgets) for selecting an ordered list of multiple elements out of a list.

You can also use it [directly from Observable as seen on this example](https://observablehq.com/@john-guerra/import-observable-notebook-libraries-in-vanila-js)

## Example Usage

```js
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>multiAutoSelect test</title>
  </head>
  <body>
    <div id="target"></div>

    <div id="status"></div>
    <script src="https://unpkg.com/multi-auto-select/dist/multiAutoSelect.js"></script>

    <script>
      // create your input, returns an html input element
      const myInput = MultiAutoSelect(["a", "b", "c"], {
        label: "Select some options",
        value: ["a"],
      });

      // Listen to input events
      const onInput = (e) => {
        if (DEBUG) console.log("onInput", myInput.value);
        document.getElementById("status").innerText =
          `Current Selection ${myInput.value.join(", ")}`;
      };
      myInput.addEventListener("input", onInput);
      onInput();

      // Append your input element to the page
      document.getElementById("target").appendChild(myInput);

    </script>
  </body>
</html>
``
```
