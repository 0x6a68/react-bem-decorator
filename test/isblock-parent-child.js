import React, { Component } from 'react';
import { expect } from 'chai';
import {
    renderIntoDocument,
    findRenderedComponentWithType
} from 'react-addons-test-utils';

import BEMDecorator from '../src';

// fixture
class Passthrough extends Component {
    render() {
        return <div {...this.props} />;
    }
}

@BEMDecorator('mockClassName', {
    isBlock: true,
    modifiers(props) {
        const { modified } = props;
        return { modified };
    },
    elements: [ 'foo', 'bar' ]
})
class Parent extends Component {
    render() {
        return <Child {...this.props} />;
    }
}

@BEMDecorator('mockChildClassName', {
    isBlock: true,
    modifiers(props) {
        const { modified } = props;
        return { modified };
    },
    elements: [ 'foo', 'bar' ]
})
class Child extends Component {
    render() {
        return <Passthrough {...this.props} />;
    }
}

//const BEMComponent = BEMDecorator('stirng', {})(SimpleFixtureComponent);
describe('parent child using context', () => {
    let stub;

    before(() => {
        const container = renderIntoDocument(<Parent />);
        stub = findRenderedComponentWithType(container, Passthrough);
    });

    it('should not BEM.className with its parent', () => {
        const { props: { BEM } } = stub;

        expect(BEM).to.be.a('object');
        expect(BEM.className).to.equal('mockChildClassName');

    });

});


