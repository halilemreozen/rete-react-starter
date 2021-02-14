import Rete from "rete";

var socketNumber = new Rete.Socket("Number value");
var socketString = new Rete.Socket("String value");

export {
    socketNumber,
    socketString
};