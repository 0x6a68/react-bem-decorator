import React, { Component, PropTypes } from 'react';

import {
    invoke,
    concatAndFilterString,
    invariant,
    filterByTruthy,
    extend
} from './utils';
const BEM_ELEMENT_SEPERATOR = '__';
const BEM_MODIFIER_SEPERATOR = '--';
const EMPTY_SEPERATOR = ' ';
const CLASSNAME_KEY = '__BEMClassName__';
const typesSpec = { [CLASSNAME_KEY]: PropTypes.string };

const composeElements = (className, elements) => {
    if (!elements) {
        return;
    }
    return elements.reduce((result, value) => {
        result[value] = composeElement(className, value);
        return result;
    }, {});
}

const composeEmpty = concatAndFilterString(EMPTY_SEPERATOR);
const composeElement = concatAndFilterString(BEM_ELEMENT_SEPERATOR);
const composeModifier = concatAndFilterString(BEM_MODIFIER_SEPERATOR);

const composeStates = (fn, args) => composeEmpty(...filterByTruthy(invoke(fn, args)));
const composeModifiers = (fn, props) => {
    const modifiersAsProp = props.modifiers;
    const finalModifiers = filterByTruthy(invoke(fn, props)).concat(
        (modifiersAsProp) ? modifiersAsProp.split(' ') : null
    ).filter(str => str);

    return (className) =>
        composeEmpty(
            ...finalModifiers.map((name) => composeModifier(className, name))
        )
}

function BEMComposer(className, settings) {
    invariant(
        typeof className === 'string',
        `className must be a string, can not be %s`,
        typeof className
    );

    const { elements, modifiers, states, isBlock} = settings;

    return (props, context) => {

        const baseClassName =
            (isBlock)
            ? className
            : composeElement(context[CLASSNAME_KEY], className);

        const originalClassName = props.className;

        return {
            className: composeEmpty(
                originalClassName,
                baseClassName,
                composeModifiers(modifiers, props)(baseClassName),
                composeStates(states, props)
            ),
            elements: composeElements(baseClassName, elements)
        }
    }
}

export default function BEMDecorator(className, settings = {}) {
    const composeBEM = BEMComposer(className, settings);

    return (TargetComponent) => {

        const types = {
            propTypes: typesSpec,
            childContextTypes: typesSpec,
            contextTypes: typesSpec
        };

        const methods = {
            get BEM() {
                const { props, context } = this;
                return composeBEM(props, context);
            },

            getChildContext() {
                return {
                    [ CLASSNAME_KEY ]: className
                }
            }
        }

        extend(TargetComponent, types);
        extend(TargetComponent.prototype, methods);

        return TargetComponent;
    };
}
