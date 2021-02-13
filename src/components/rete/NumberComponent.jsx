import Rete from "rete";
import NumberControl from "./NumberControl";
import { socketNumber } from "./ReteSockets";

export default class NumberComponent extends Rete.Component {
  constructor() {
    super("Number");
  }
  builder(node) {
    var out1 = new Rete.Output("num", "Number", socketNumber);
    var ctrl = new NumberControl(this.editor, "num", node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }
}