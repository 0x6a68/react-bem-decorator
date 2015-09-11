import React, { Component } from 'react';
import { expect } from 'chai';
import BEMDecorator from '../src';

import shallowRenderComponent from './utils/shallowRenderComponent';

// fixture
class SimpleFixtureComponent extends Component {
    static defaultProps = {
        foo: 'bar'
    }
    render() {
        return React.createElement('p');
    }
}

class ComplexFixtureComponent {
    render() {
        return React.createElement('div', {}, this.props.children)
    }
}
const MOCK_SETTINGS = {
    modifiers(props) {
        const { modified } = props;
        return { modified };
    },
    elements: [ 'foo', 'bar' ]

};
const MOCK_ARGS = [
    'mockClassName',
    MOCK_SETTINGS
];

function renderComponent(props, setupArgs = MOCK_ARGS) {
    return shallowRenderComponent(
        BEMDecorator(...setupArgs)(SimpleFixtureComponent),
        props
    );
}
describe('single component without inheritance', () => {

    it('should set props.BEM', () => {
        expect(renderComponent().props.BEM).to.be.a('object');
        // TODO-150910 test all possible situations
        expect(renderComponent(null, ['foo']).props.BEM).to.be.a('object');
    });

    it('should set prop.BEM.className to mockClassName', () => {
        const { props: { BEM } } = renderComponent();
        expect(BEM.className).to.equal('mockClassName');
    });

    it('should set props.BEM.elements[foo and bar]', () => {
        const { props: { BEM } } = renderComponent();

        expect(BEM.elements).to.be.a('object');
        expect(BEM.elements.foo).to.equal('mockClassName__foo');
        expect(BEM.elements.bar).to.equal('mockClassName__bar');
    });

    it('should extends props.BEM.className by its modifiers', () => {
        const { props: { BEM } } = renderComponent({ modified: true });
        expect(BEM.className).to.equal('mockClassName mockClassName--modified');
    });

});
