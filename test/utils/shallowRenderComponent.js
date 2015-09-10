import React from 'react';
import TestUtils from 'react-addons-test-utils';

export default function shallowRenderComponent(component, props, ...children) {
    const shallowRenderer = TestUtils.createRenderer();
    const childs = (children.length > 1) ? children : children[0];

    shallowRenderer.render(React.createElement(component, props, childs));

    return shallowRenderer.getRenderOutput();
}
