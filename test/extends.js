import sinon from 'sinon';

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
    states(props) {
        const { active } = props;
        return { active };
    },
    elements: [ 'foo', 'bar' ]
})
class Container extends Component {
    render() {
        return (
            <div>
                { this.extendedFn() }
            </div>
        )
    }

    extendedFn() {
        return (
            <div>foo</div>
        );
    }
}

class Extended extends Container {
    extendedFn() {
        this.props.spy();
        return (
            <div>bar</div>
        )
    }
}

//const BEMComponent = BEMDecorator('stirng', {})(SimpleFixtureComponent);
describe('extending classes', () => {
    let stub, spy;

    before(() => {
        spy = sinon.spy();
        stub = renderIntoDocument(<Extended spy={ spy }/>);
    });

    it('should set props.BEM', () => {
        expect(spy.called).to.equal(true);
        expect(stub.BEM).to.be.a('object');
    });
});
