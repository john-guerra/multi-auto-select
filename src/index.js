import { Runtime } from "@observablehq/runtime";
import notebookUrl from "@john-guerra/multi-auto-select";

function loader() {
  const runtime = new Runtime();
  const notebook = runtime.module(notebookUrl, (name) => {
    return ["multiAutoSelect"].includes(name);
  });

  return notebook.value("multiAutoSelect");
}

export default { loader };
