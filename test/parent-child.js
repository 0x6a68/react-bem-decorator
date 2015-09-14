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

    it('should set props.BEM', () => {
        expect(stub.props.BEM).to.be.a('object');
    });

    it('should set props.BEM.className', () => {
        expect(stub.props.BEM.className).to.be.a('string');
        expect(stub.props.BEM.className).to.equal('mockClassName__mockChildClassName');
    });

    it('should set props.BEM.elements', () => {
        const { props: { BEM } } = stub;
        expect(BEM.elements.foo).to.equal('mockClassName__mockChildClassName__foo');
        expect(BEM.elements.bar).to.equal('mockClassName__mockChildClassName__bar');
    });

    it('should extends props.BEM.class by its modifiers', () => {
        const container = renderIntoDocument(<Parent modified />);
        stub = findRenderedComponentWithType(container, Passthrough);

        expect(stub.props.BEM.className).to.be.a('string');
        expect(stub.props.BEM.className).to.equal(
            'mockClassName__mockChildClassName mockClassName__mockChildClassName--modified'
        );
    });
});

