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
class Container extends Component {
    render() {
        return <Passthrough {...this.props} modified />;
    }
}

//const BEMComponent = BEMDecorator('stirng', {})(SimpleFixtureComponent);
describe('single component without inheritance', () => {
    let stub;

    before(() => {
        const container = renderIntoDocument(<Container />);
        stub = findRenderedComponentWithType(container, Passthrough);
    });

    it('should set props.BEM', () => {
        expect(stub.props.BEM).to.be.a('object');
    });

    it('should set prop.BEM.className to mockClassName', () => {
        const { props: { BEM } } = stub;
        expect(BEM.className).to.equal('mockClassName');
    });

    it('should set props.BEM.elements[foo and bar]', () => {
        const { props: { BEM } } = stub;

        expect(BEM.elements).to.be.a('object');
        expect(BEM.elements.foo).to.equal('mockClassName__foo');
        expect(BEM.elements.bar).to.equal('mockClassName__bar');
    });

    it('should extends props.BEM.className by its modifiers', () => {
        const container = renderIntoDocument(<Container modified />);
        stub = findRenderedComponentWithType(container, Passthrough);

        const { props: { BEM } } = stub;
        expect(BEM.className).to.equal('mockClassName mockClassName--modified');
    });

});
