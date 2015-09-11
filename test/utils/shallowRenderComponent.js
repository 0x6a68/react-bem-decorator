import React from 'react';
import TestUtils from 'react-addons-test-utils';

export default function shallowRenderComponent(component, props, children = false) {
    const shallowRenderer = TestUtils.createRenderer();
    const childs = (children) ?children : null;

    shallowRenderer.render(React.createElement(component, props, childs));

    return shallowRenderer.getRenderOutput();
}
