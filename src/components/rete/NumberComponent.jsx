import Rete from "rete";
import { CustomReteNode } from "./CustomReteNode";
import NumberControl from "./NumberControl";
import { ReteComponentWrapper } from "./ReteComponentWrapper";
import { socketNumber, socketString } from "./ReteSockets";

export default class NumberComponent extends ReteComponentWrapper {

  constructor(key) {
    if (key == null) key = 'Number'
    super(key);
    this.component = CustomReteNode.bind({parentComponent : this});
  }

  builder(node) {
    var out1 = new Rete.Output("num", "Number", socketNumber);
    var ctrl = new NumberControl(this.editor, "num", node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }

  code(node, inputs, self) {
    self.defineVariable(node.name,`const ${node.name} = ${node.data.num};\n`);
  }
}