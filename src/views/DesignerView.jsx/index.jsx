import { createEditor } from "components/rete/";
import { createRef, useEffect } from "react";

export default function DesignerView(params) {

  const refDock = createRef();
  const refEditor = createRef();

  useEffect(() => {

    if (refEditor?.current != null && refDock?.current != null) {
      createEditor(refEditor, refDock)
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