import { Node, Socket, Control } from "../../rete/index.jsx";

export class CustomReteNode extends Node {

  constructor(props) {
    super(props);
  }

  render() {
    const { node, bindSocket, bindControl } = this.props;
    const { outputs, controls, inputs, selected } = this.state;

    let title = `${node.data.identifier} (${node.name})`;
    const isDockComponent = node.position[0] == 0 && node.position[1] == 0;
    const codeType = node.data.codeType ?? 'UnknownCodeType';

    if(isDockComponent || codeType == 'function'){
      title = node.name;
    }

    return (
      <div className={`node ${selected}`}>
        <div className="title">{title}</div>
        {/* Outputs */}
        {outputs.map(output => (
          <div className="output" key={output.key}>
            <div className="output-title">{output.name}</div>
            <Socket
              type="output"
              socket={output.socket}
              io={output}
              innerRef={bindSocket}
            />
          </div>
        ))}
        {/* Controls */}
        {controls.map(control => (
          <Control
            className="control"
            key={control.key}
            control={control}
            innerRef={bindControl}
          />
        ))}
        {/* Inputs */}
        {inputs.map(input => (
          <div className="input" key={input.key}>
            <Socket
              type="input"
              socket={input.socket}
              io={input}
              innerRef={bindSocket}
            />
            {!input.showControl() && (
              <div className="input-title">{input.name}</div>
            )}
            {input.showControl() && (
              <Control
                className="input-control"
                control={input.control}
                innerRef={bindControl}
              />
            )}
          </div>
        ))}
      </div>
    );
  }
}
