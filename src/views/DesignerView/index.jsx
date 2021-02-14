import { createEditor } from "components/rete/";
import { createRef, useEffect } from "react";
import Rete from "rete";

export default function DesignerView(props) {

  const refDock = createRef();
  const refEditor = createRef();
  let nodeEditor = null;

  useEffect(() => {

    if (refEditor?.current != null && refDock?.current != null) {
      nodeEditor = new Rete.NodeEditor("demo@0.1.0", refEditor.current);
      createEditor(nodeEditor, refDock, props.onCodeChaned);
    }

    return () => {
      // unmount
    }
  }, [])

  return (<div className="container">
    <div className="dock" ref={refDock}></div>
    <div className="editor" ref={refEditor} />
  </div>);
}