import Rete from "rete";
import { CustomReteNode } from "./CustomReteNode";
import NumberControl from "./NumberControl";
import { ReteComponentWrapper } from "./ReteComponentWrapper";
import { socketNumber, socketString } from "./ReteSockets";
export default class RandomNumberComponent extends ReteComponentWrapper {

    constructor(key) {
        if (key == null) key = `RandomNumber`;
        super(key);
        this.timer = null;
    }

    builder(node) {
        super.builder(node);
        node.data.codeType = 'function';

        var minValue = new Rete.Input("min", "Min Value", socketNumber);
        minValue.addControl(new NumberControl(this.editor, "min", node));

        var maxValue = new Rete.Input("max", "Max Value", socketNumber);
        maxValue.addControl(new NumberControl(this.editor, "max", node));

        var perSecond = new Rete.Input("second", "Per Second", socketNumber);
        perSecond.addControl(new NumberControl(this.editor, "second", node));

        var out1 = new Rete.Output("num", "Number", socketNumber);
        var ctrl = new NumberControl(this.editor, "num", node);

        return node
            .addControl(ctrl)
            .addOutput(out1)
            .addInput(minValue)
            .addInput(maxValue)
            .addInput(perSecond);
    }

    worker(node, inputs, outputs) {
        super.worker(node, inputs, outputs);

        const second = (node.data.second == 0 ? 1 : node.data.second) * 1000;
       
        node.data.timer = setTimeout(() => {

            const min = Math.ceil(node.data.min);
            const max = Math.floor(node.data.max);
            const rand = Math.floor(Math.random() * (max - min + 1) + min);

            if (rand == node.data.num) return;
            node.data.num = rand;
            
            console.info('TIMER', node.data.timer, min, max, rand);

            this.editor.nodes
                .find(n => n.id == node.id)
                .controls.get("num")
                .setValue(rand);

            this.editor.trigger('process');
        }, second);

        outputs["num"] = node.data.num;
    }

    setDeceleratingTimeout(callback, factor) {
        var internalCallback = function (tick, counter) {
            return function () {
                if (--tick >= 0) {
                    window.setTimeout(internalCallback, ++counter * factor);
                    callback();
                }
            }
        }();

        window.setTimeout(internalCallback, factor);
    };

    code(node, inputs, self) {
        /*self.defineVariable(node.data.identifier,`const ${node.data.identifier} = ${node.data.num};`);*/
    }
}