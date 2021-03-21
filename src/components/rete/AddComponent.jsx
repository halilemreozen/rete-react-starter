import Rete from "rete";
import { CustomReteNode } from "./CustomReteNode";
import NumberControl from "./NumberControl";
import { ReteComponentWrapper } from "./ReteComponentWrapper";
import { socketNumber } from "./ReteSockets";
import { nanoid } from 'nanoid';

export default class AddComponent extends ReteComponentWrapper {

  constructor(key) {
    if (key == null) key = `Add`;
    super(key);
  }

  builder(node) {
    super.builder(node);
    node.data.codeType = 'function';

    var inp1 = new Rete.Input("num1", "Number", socketNumber);
    var inp2 = new Rete.Input("num2", "Number2", socketNumber);
    var out = new Rete.Output("addOut", "Number", socketNumber);

    inp1.addControl(new NumberControl(this.editor, "num1", node));
    inp2.addControl(new NumberControl(this.editor, "num2", node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumberControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    super.worker(node, inputs, outputs);
    var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    var n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
    var sum = n1 + n2;

    this.editor.nodes
      .find(n => n.id == node.id)
      .controls.get("preview")
      .setValue(sum);
    outputs["addOut"] = sum;
  }

  code(node, inputs, self) {

    self.defineFunction(node.name, `const ${node.name} = function (${Object.keys(inputs).join()}) {
      var args = Array.prototype.slice.call(arguments);
      return args.reduce((accumulator, currentValue) => accumulator + currentValue)
    };`);

    const inputNodes = Array.from(Object.values( node.inputs ).map ( input => {
      return input.connections.map(connection => {
        return this.editor.nodes.find(n => n.id == connection.node)
      });
    })).flat();
    
    const params = inputNodes.map(n=>n.data.identifier).join();

    return `${node.name}(${params});`;
  }

}