import Rete from "rete";

export class ReteComponentWrapper extends Rete.Component {

    builder(node) {
        throw 'ReteComponentWrapper::builder not implemented'
    }

    worker(node, inputs, outputs) {
        throw 'ReteComponentWrapper::builder not implemented'
    }

}