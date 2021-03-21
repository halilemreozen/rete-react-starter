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
import P5LineComponent from "./P5LineComponent.js";
import P5CanvasComponent from "./P5CanvasComponent.jsx";
import PerlinNoiseComponent from "./PerlinNoiseComponent.js";
import RandomNumberComponent from "./RandomNumberComponent.js";

export async function createEditor(editor, refDock, onCodeChaned) {

  var components = [new NumberComponent(), new AddComponent(), new P5LineComponent(), new P5CanvasComponent(), new PerlinNoiseComponent(), new RandomNumberComponent()];

  editor.use(ReactRenderPlugin, {
    //component: CustomReteNode // Default global node template
  });

  editor.use(ConnectionPlugin);
  editor.use(CodePlugin);

  editor.use(DockPlugin, {
    container: refDock.current,
    itemClass: 'dock-item',
    plugins: [ReactRenderPlugin]
  });

  editor.use(ContextMenuPlugin, {
    searchBar: false,
    searchKeep: title => true, // leave item when searching, optional. For example, title => ['Refresh'].includes(title)
    delay: 100,
    items: {
      'Click me': () => { console.log('Works!') }
    },
    nodeItems: function(node) {

      const contextMenuItems = {

        'Rename' : () => { 
          let newName = prompt('New Name');
          node.data.identifier = newName;
          node.update();
         },
        'Click me 2' : () => { console.log('Works for node 2!') }
      };

      if (node.name === 'Add') {
        Object.assign(contextMenuItems, {
          'Only for Add nodes': () => { console.log('Works for add node!') },
        });
      }
      
      return contextMenuItems;
    }
  });

  var engine = new Rete.Engine("demo@0.1.0");

  components.map(c => {
    editor.register(c);
    engine.register(c);
  });

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      const sourceCode = await generate(engine, editor.toJSON());
      onCodeChaned(sourceCode);
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.view.resize();
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);
}
