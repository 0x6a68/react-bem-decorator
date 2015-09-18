import React, { Component } from 'react';
import { expect } from 'chai';
import {
    renderIntoDocument,
    findRenderedComponentWithType
} from 'react-addons-test-utils';

import BEMDecorator from '../src';

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
        return <div />;
    }
}

describe('parent child using context', () => {
    let container;

    before(() => {
        const parent = renderIntoDocument(<Parent />);
        container = findRenderedComponentWithType(parent, Child);
    });

    it('should set props.BEM', () => {
        expect(container.BEM).to.be.a('object');
    });

    it('should set props.BEM.className', () => {
        expect(container.BEM.className).to.be.a('string');
        expect(container.BEM.className).to.equal('mockClassName__mockChildClassName');
    });

    it('should set props.BEM.elements', () => {
        const { BEM } = container;
        expect(BEM.elements.foo).to.equal('mockClassName__mockChildClassName__foo');
        expect(BEM.elements.bar).to.equal('mockClassName__mockChildClassName__bar');
    });

    it('should extends props.BEM.class by its modifiers', () => {
        const parent = renderIntoDocument(<Parent modified />);
        container = findRenderedComponentWithType(parent, Child);

        expect(container.BEM.className).to.be.a('string');
        expect(container.BEM.className).to.equal(
            'mockClassName__mockChildClassName mockClassName__mockChildClassName--modified'
        );
    });
});
