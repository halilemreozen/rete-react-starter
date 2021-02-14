import { Tab, TabList, TabPanel, Tabs } from 'components/Tabs/Tabs';
import React, { useState } from 'react';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';

import { synthwave84 } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DesignerView from 'views/DesignerView';

SyntaxHighlighter.registerLanguage('jsx', jsx);

export default function MainView() {

    const [code, setCode] = useState('// Hello World!');

    const onCodeChaned = (newCode) => {
        console.log('Code Changed');
        setCode(newCode);
    }

    return (
        <Tabs>
            <TabList>
                <Tab panel="designer">Designer</Tab>
                <Tab panel="code">Code</Tab>
            </TabList>

            <TabPanel id="designer" className="MainView" default={true}>
                <DesignerView onCodeChaned={onCodeChaned}></DesignerView>
            </TabPanel>
            <TabPanel id="code">
                <SyntaxHighlighter language="javascript" style={synthwave84}>
                    {code}
                </SyntaxHighlighter>
            </TabPanel>
        </Tabs>

    );
}
