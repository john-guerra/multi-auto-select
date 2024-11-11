# multi-auto-select
A simple reactive input component for selecting an ordered list of multiple elements out of a list

This is a temporary NPM wrap up of the [multi-auto-select Observable Input](https://observablehq.com/@john-guerra/multi-auto-select). I might consider rewriting all the code to js if there is enough interest.

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
      
      async function runtIt() {
        // the loader function returns a promise with the constructor
        const multiAutoSelectConstructor = await multiAutoSelect.loader();

        // create your input, returns an html input element
        const myInput = multiAutoSelectConstructor(["a", "b", "c"], {
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
      }

      runtIt();
    </script>
  </body>
</html>
``