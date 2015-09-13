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

@BEMDecorator('mockChildClassName')
class Child extends Component {
    render() {
        return <Passthrough {...this.props} />;
    }
}

//const BEMComponent = BEMDecorator('stirng', {})(SimpleFixtureComponent);
describe('single component without inheritance', () => {
    let stub;

    before(() => {
        const container = renderIntoDocument(<Parent />);
        stub = findRenderedComponentWithType(container, Passthrough);
    });

    it('should set props.BEM', () => {
        expect(stub.props.BEM).to.be.a('object');
    });

    it('should set props.BEM.className', () => {
        expect(stub.props.BEM.className).to.be.a('string');
        expect(stub.props.BEM.className).to.equal('mockClassName__mockChildClassName');
    });

});

