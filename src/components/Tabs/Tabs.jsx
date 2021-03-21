import React, { useContext } from "react";
import { useState } from "react";

const TabsContext = React.createContext({
    selectedTabId: null,
    OnTabClick: (selectedTabId) => { }
});

const TabsContextProvider = TabsContext.Provider;

export function Tabs(props) {

    const [tabsState, setTabsState] = useState({
        selectedTabId: null,
        OnTabClick: (selectedTabId) => {
            console.info('Tab Clicked', selectedTabId);
            setTabsState({
                ...tabsState,
                selectedTabId: selectedTabId
            })
        }
    });

    return <>
        <TabsContextProvider value={tabsState}>
            {props.children}
        </TabsContextProvider>
    </>
}

export function TabList(props) {
    return <div className="TabList" {...props}>
        {props.children}
    </div>
}

export function Tab(props) {
    const tabsContext = useContext(TabsContext);

    let isActive = tabsContext.selectedTabId != null ? tabsContext.selectedTabId == props.panel : props.default;

    const onClick = () => {
        tabsContext.OnTabClick(props.panel);
    }

    return <div className={`Tab ${isActive ? "TabActive" : ''}`} {...props} onClick={ onClick }>
        {props.children}
    </div>
}

export function TabPanel(props) {

    const tabsContext = useContext(TabsContext);

    const displayDefault = props.displayDefault ?? 'block';
    let isVisible = tabsContext.selectedTabId != null ? tabsContext.selectedTabId == props.id : props.default;
    
    let display = isVisible ? displayDefault : 'none';

    return <div className="TabPanel" style={{ display: display }}  {...props}>
        {props.children}
    </div>
}