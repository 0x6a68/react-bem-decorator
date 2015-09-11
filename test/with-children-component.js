import React, { Component } from 'react';
import { expect } from 'chai';
import BEMDecorator from '../src';

import shallowRenderComponent from './utils/shallowRenderComponent';

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

const MOCK_ARGS_CHILD = [
    'mockChildClassName',
    {}
];

class SimpleFixtureComponent extends Component { }
class ComplexFixtureComponent extends Component { }

function renderComponent(props = {}, setupArgsParent = MOCK_ARGS, setupArgsChild = MOCK_ARGS_CHILD) {
    return shallowRenderComponent(
        BEMDecorator(...setupArgsParent)(ComplexFixtureComponent),
        props,
        shallowRenderComponent(
            BEMDecorator(...setupArgsChild)(SimpleFixtureComponent)
        )
    );
}


describe('components with context support', () => {
    it('should add BEM to the parent', () => {
        const { props: { BEM } } = renderComponent();
        expect(BEM).to.be.a('object');
    });

    it('should add BEM to the child', () => {
        const { props: { children: { props } } } = renderComponent();
        expect(props.BEM).to.be.a('object');
        expect(props.BEM.className).to.equal('mockChildClassName');
    });
});
