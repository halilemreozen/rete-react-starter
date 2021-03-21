import Rete from "rete";
import NumberControl from "./NumberControl";
import { ReteComponentWrapper } from "./ReteComponentWrapper";
import { socketNumber, socketString } from "./ReteSockets";

export default class P5LineComponent extends ReteComponentWrapper {

  constructor(key) {
    if (key == null) key = `DrawLine`;
    super(key);
  }

  builder(node) {
    super.builder(node);
    node.data.codeType = 'function';

    var startX = new Rete.Input("startX", "Start X", socketNumber);
    var startY = new Rete.Input("startY", "Start Y", socketNumber);
    var endX = new Rete.Input("endX", "End X", socketNumber);
    var endY = new Rete.Input("endY", "End Y", socketNumber);
    var out = new Rete.Output("generatedCode", "Generated Code", socketString);

    startX.addControl(new NumberControl(this.editor, "startX", node));
    startY.addControl(new NumberControl(this.editor, "startY", node));
    endX.addControl(new NumberControl(this.editor, "endX", node));
    endY.addControl(new NumberControl(this.editor, "endY", node));


    return node
      .addInput(startX)
      .addInput(startY)
      .addInput(endX)
      .addInput(endY)
      .addControl(new NumberControl(this.editor, "generatedCode", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    super.worker(node, inputs, outputs);
    var startX = inputs["startX"].length ? inputs["startX"][0] : node.data.startX;
    var startY = inputs["startY"].length ? inputs["startY"][0] : node.data.startY;
    var endX = inputs["endX"].length ? inputs["endX"][0] : node.data.endX;
    var endY = inputs["endY"].length ? inputs["endY"][0] : node.data.endY;
    var generatedCode = `
    p5.stroke(255);
    p5.line(${startX},${startY},${endX},${endY});
    `;

    const realNode = this.editor.nodes
      .find(n => n.id == node.id)
      .controls.get("generatedCode");

    realNode.setValue(generatedCode);

    outputs["generatedCode"] = generatedCode;
  }

  code(node, inputs, self) {
    // ToDo : Add component code generation template
  }

}