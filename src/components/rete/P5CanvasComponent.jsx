import Rete from "rete";
import NumberControl from "./NumberControl";
import { ReteComponentWrapper } from "./ReteComponentWrapper";
import { socketString } from "./ReteSockets";
import { DynamicReteComponent } from "./DynamicReteComponent";
import Sketch from "react-p5";
import { nanoid } from 'nanoid';
import { useEffect } from "react";

export default class P5CanvasComponent extends ReteComponentWrapper {

  constructor(key) {
    if (key == null) key = `P5Canvas`;
    super(key);
    this.data.component = DynamicReteComponent;
  }

  draw(p5) {



    if (this.node.data.codeSet !== 0) {
      eval(this.node.data.codeSet)
    }
  }

  builder(node) {
    super.builder(node);
    node.data.codeType = 'function';

    var codeSet = new Rete.Input("codeSet", "Generated Code", socketString);
    codeSet.addControl(new NumberControl(this.editor, "codeSet", node));

    node.data.setup = (p5, canvasParentRef) => {
      setTimeout(() => {
        p5.createCanvas(200, 200).parent(canvasParentRef);
        p5.background(0)
      }, 500)
    };

    node.data.customTemplate = <Sketch setup={node.data.setup} draw={this.draw.bind({ node: node })} />

    return node
      .addInput(codeSet);
  }

  worker(node, inputs, outputs) {
    super.worker(node, inputs, outputs);
    var codeSet = inputs["codeSet"].length ? inputs["codeSet"][0] : node.data.codeSet;

    node.data.codeSet = codeSet;
  }

  code(node, inputs, self) {
    // ToDo : Add component code generation template
  }

}