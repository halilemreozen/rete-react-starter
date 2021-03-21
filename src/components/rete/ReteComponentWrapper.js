import Rete from "rete";
import { nanoid } from 'nanoid';
import { CustomReteNode } from "./CustomReteNode";


export class ReteComponentWrapper extends Rete.Component {

    constructor(props) {
        super(props);

        this.data.render = 'react';
        this.data.component = CustomReteNode;
        this.data.props = {};
    }

    builder(node) {
        node.data.identifier = `${node.name}_${nanoid(11)}`
            .replace(/\s/g, '_')
            .replace(/-/g, '_');
        return node;
    }

    worker(node, inputs, outputs) {
    }

}