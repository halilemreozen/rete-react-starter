import React, { useEffect, useState } from "react";
import { TabPanel } from "react-tabs";

const HookedLazyTabPanel = props => {
    const [initialized, setInitialized] = useState(false);
    useEffect(
        () => {
            if (props.selected && !initialized) {
                setInitialized(true);
            }
        },
        [props.selected || initialized]
    );

    return <TabPanel forceRender={initialized} {...props} />;
};
HookedLazyTabPanel.tabsRole = "TabPanel";

export default HookedLazyTabPanel;