import React, { Component } from 'react';
import { expect } from 'chai';
import {
    renderIntoDocument,
    findRenderedComponentWithType
} from 'react-addons-test-utils';

import BEMDecorator from '../src';

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
        return <div />;
    }
}

//const BEMComponent = BEMDecorator('stirng', {})(SimpleFixtureComponent);
describe('parent child using context', () => {
    let container;

    before(() => {
        const parent = renderIntoDocument(<Parent />);
        container = findRenderedComponentWithType(parent, Child);
    });

    it('should not BEM.className with its parent', () => {
        const { BEM } = container;

        expect(BEM).to.be.a('object');
        expect(BEM.className).to.equal('mockChildClassName');

    });

});


