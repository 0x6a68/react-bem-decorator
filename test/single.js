import React, { Component } from 'react';
import { expect } from 'chai';
import {
    renderIntoDocument
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
        return <div />;
    }
}


//const BEMComponent = BEMDecorator('stirng', {})(SimpleFixtureComponent);
describe('single component without inheritance', () => {
    let container;

    before(() => {
        container = renderIntoDocument(<Container />);
    });

    it('should set props.BEM', () => {
        expect(container.BEM).to.be.a('object');
    });

    it('should set prop.BEM.className to mockClassName', () => {
        const { BEM } = container;
        expect(BEM.className).to.equal('mockClassName');
    });

    it('should set props.BEM.elements[foo and bar]', () => {
        const { BEM } = container;

        expect(BEM.elements).to.be.a('object');
        expect(BEM.elements.foo).to.equal('mockClassName__foo');
        expect(BEM.elements.bar).to.equal('mockClassName__bar');
    });

    it('should extends props.BEM.className by its modifiers', () => {
        const container = renderIntoDocument(<Container modified />);

        const { BEM } = container;
        expect(BEM.className).to.equal('mockClassName mockClassName--modified');
    });

    it('should handle a property modifers', () => {

        const container = renderIntoDocument(<Container modifiers="foo bar" />);

        const { BEM } = container;
        expect(BEM.className).to.equal(
            'mockClassName mockClassName--foo mockClassName--bar');
    });

    it('should handle a duplicate modifers', () => {

        const container = renderIntoDocument(<Container modified modifiers="modified" />);

        const {  BEM } = container;
        expect(BEM.className).to.not.equal(
            'mockClassName mockClassName--modified mockClassName--modified'
        );
        expect(BEM.className).to.equal('mockClassName mockClassName--modified');
    });

    it('should set modifier classnames even no modifier func is defined', () => {
        @BEMDecorator('mockClassName', {
            elements: [ 'foo', 'bar' ]
        })
        class ContainerWithoutModifierFunc extends Component {
            render() {
                return <div />;
            }
        }
        const container = renderIntoDocument(<ContainerWithoutModifierFunc modifiers="modified" />);

        const { BEM } = container;
        expect(BEM.className).to.equal('mockClassName mockClassName--modified');
    });

    it('should prepend components className', () => {
        const container = renderIntoDocument(<Container className="container" />);

        const { BEM } = container;
        expect(BEM.className).to.equal('container mockClassName');
    });

    it('should use state function', () => {
        const container = renderIntoDocument(<Container active />);

        const { BEM } = container;
        expect(BEM.className).to.equal('mockClassName active');
    });

    it('should use only states', () => {
        @BEMDecorator('', {
            states(props) {
                const { active, disabled } = props;
                return {
                    active,
                    disabled
                }
            }
        })
        class Container extends Component {
            render() {
                return <div />;
            }
        }
        const container = renderIntoDocument(<Container active disabled/>);

        const { BEM } = container;
        expect(BEM.className).to.equal('active disabled');
    });

    it('should handle array className', () => {
        @BEMDecorator('', {
            states() {
                return ['active', 'disabled']
            }
        })
        class Container extends Component {
            render() {
                return <div />;
            }
        }
        const container = renderIntoDocument(<Container active disabled/>);

        const { BEM } = container;
        expect(BEM.className).to.equal('active disabled');
    });

});
