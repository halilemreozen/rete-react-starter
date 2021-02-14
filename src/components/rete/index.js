import Rete from "rete";
import ReactRenderPlugin from "../../rete/index.jsx";
import ConnectionPlugin from "rete-connection-plugin";
import AreaPlugin from "rete-area-plugin";
import NumberComponent from "components/rete/NumberComponent";
import AddComponent from "components/rete/AddComponent";
import DockPlugin from 'rete-dock-plugin';
import ContextMenuPlugin, { Menu, Item, Search } from 'rete-context-menu-plugin';
import { CustomReteNode } from "./CustomReteNode";
import CodePlugin, { generate } from "./CodePlugin.js";

export async function createEditor(editor, refDock, onCodeChaned) {

  var components = [new NumberComponent(), new AddComponent()];

  editor.use(ReactRenderPlugin, {
    component: CustomReteNode
  });

  editor.use(ConnectionPlugin);
  editor.use(CodePlugin);


  console.log(ConnectionPlugin)
  console.log(DockPlugin)

  editor.use(DockPlugin, {
    container: refDock.current,
    itemClass: 'dock-item', // default: dock-item 
    plugins: [ReactRenderPlugin] // render plugins
  });

  editor.use(ContextMenuPlugin, {
    searchBar: false, // true by default
    searchKeep: title => true, // leave item when searching, optional. For example, title => ['Refresh'].includes(title)
    delay: 100,
    items: {
      'Click me': () => { console.log('Works!') }
    },
    nodeItems: node => {
      if (node.name === 'Add') {
        return {
          'Only for Add nodes': () => { console.log('Works for add node!') },
        };
      }
      return {
        'Rename' : () => { 
          let newName = prompt('New Name');
          node.name = newName;
          node.update();
         },
        'Click me 2' : () => { console.log('Works for node 2!') }
      }
    }
  });

  var engine = new Rete.Engine("demo@0.1.0");

  components.map(c => {
    editor.register(c);
    engine.register(c);
  });

  var n1 = await components[0].createNode({ num: 2 });
  var n2 = await components[0].createNode({ num: 3 });
  var add = await components[1].createNode();

  n1.position = [80, 200];
  n2.position = [80, 400];
  add.position = [500, 240];

  editor.addNode(n1);
  editor.addNode(n2);
  editor.addNode(add);

  editor.connect(n1.outputs.get("num"), add.inputs.get("num1"));
  editor.connect(n2.outputs.get("num"), add.inputs.get("num2"));

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      console.log("process");
      const sourceCode = await generate(engine, editor.toJSON());
      console.log(sourceCode);
      onCodeChaned(sourceCode);
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.view.resize();
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);
}
