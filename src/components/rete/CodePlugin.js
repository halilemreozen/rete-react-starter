import { camel } from 'case';
import { nanoid } from 'nanoid';
const beautify = require('js-beautify').js;

function install(editor, params) { }

function getVarName(node) {
    return camel(`${node.name}${node.id}`);
}

export async function generate(engine, data) {

    engine = engine.clone();

    const definedStatements = [];

    const codeGenerator = {};
    codeGenerator.defineCode = function (name, value) {
        if (definedStatements.filter(r => r.name == name).length == 0) {
            definedStatements.push({
                type: this.type,
                name: name,
                value: value
            });
        }
    }

    codeGenerator.defineVariable = codeGenerator.defineCode.bind({ 'type': 'variable' });
    codeGenerator.defineFunction = codeGenerator.defineCode.bind({ 'type': 'function' });

    let usages = '';
    Array.from(engine.components.values()).forEach(c => {
        c = Object.assign(Object.create(Object.getPrototypeOf(c)), c)

        c.worker = (node, inputs, outputs) => {
            let output = c.code(node, inputs, codeGenerator);
            if (output && output.length > 0)
                usages += output;
        }
        c.worker.bind(c);

        engine.components.set(c.name, c);
    })

    await engine.process(data);

    const codeFile = `
    // Functions
    ${definedStatements.filter(r => r.type == 'function').map(r => r.value).join('\n')}
    // Variables
    ${definedStatements.filter(r => r.type == 'variable').map(r => r.value).join('\n')}
    // Usages
    ${usages}
    `;

    let evalResult = '';
    try {
        evalResult = eval(codeFile)
    } catch (exception) {
        evalResult = 'Exception : ' + exception;
    }

    const result = `
    /**
    // Result
    ${evalResult}
    */
    `;

    const codeFilePretty = beautify(codeFile + result);


    return codeFilePretty;
}

export default {
    install
}