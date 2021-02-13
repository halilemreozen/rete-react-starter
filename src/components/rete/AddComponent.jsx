import Rete from "rete";
import CustomReteNode from "./CustomReteNode";
import NumberControl from "./NumberControl";
import { socketNumber } from "./ReteSockets";

export  default class AddComponent extends Rete.Component {
    constructor() {
      super("Add");
      //this.data.component = new CustomReteNode(); // optional
    }
  
    builder(node) {
      var inp1 = new Rete.Input("num1", "Number", socketNumber);
      var inp2 = new Rete.Input("num2", "Number2", socketNumber);
      var out = new Rete.Output("num", "Number", socketNumber);
  
      inp1.addControl(new NumberControl(this.editor, "num1", node));
      inp2.addControl(new NumberControl(this.editor, "num2", node));
  
      return node
        .addInput(inp1)
        .addInput(inp2)
        .addControl(new NumberControl(this.editor, "preview", node, true))
        .addOutput(out);
    }
  
    worker(node, inputs, outputs) {
      var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
      var n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
      var sum = n1 + n2;
  
      this.editor.nodes
        .find(n => n.id == node.id)
        .controls.get("preview")
        .setValue(sum);
      outputs["num"] = sum;
    }
  }