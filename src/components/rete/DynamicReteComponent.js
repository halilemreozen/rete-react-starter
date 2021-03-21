import { Node, Socket, Control } from "../../rete/index.jsx";

export class DynamicReteComponent extends Node {

  customTemplate = <div>Loading</div>;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
   
  }

  render() {

    const { node, bindSocket, bindControl } = this.props;
    const { outputs, controls, inputs, selected } = this.state;

    let title = `${node.data.identifier} (${node.name})`;
    const isDockComponent = node.position[0] == 0 && node.position[1] == 0;
    const codeType = node.data.codeType ?? 'UnknownCodeType';

    if (isDockComponent || codeType == 'function') {
      title = node.name;
    }

    this.customTemplate = <div className={`node ${selected}`}>
      <div className="title">{title}</div>
      {inputs.map((input, index) => (
        <div className="input" key={input.key} style={{ position: "absolute", top: 35 * (index + 1) }}>
          <Socket
            type="input"
            socket={input.socket}
            io={input}
            innerRef={bindSocket}
          />
          {!input.showControl() && (
            <div className="input-title">{input.name}</div>
          )}
        </div>
      ))}
      {<div className="ctrl-canvas">{node.data.customTemplate}</div>}
    </div>;

    return this.customTemplate;
  }
}
