import React, { Component, PropTypes } from 'react';

const BEM_ELEMENT_SEPERATOR = '__';
const BEM_MODIFIER_SEPERATOR = '--';
const CLASSNAME_KEY = '__BEMClassName__';
const typesSpec = { [CLASSNAME_KEY]: PropTypes.string };

function _uniqueString(value, index, self) {
    return self.indexOf(value) === index;
}

function _invariant(condition, format = '', ...vars) {
    if (condition) {
        return;
    }

    let index = 0;
    throw new Error(
        `Invariant Violation: ${format.replace(/%s/g, () => vars[index++])}`
    );
}

function filterByTruthy(objOrArr, defaultModifiers = []) {
    // poormans Object.entries().filter...
    if (Array.isArray(objOrArr)) {
        return objOrArr;
    }
    return Object.keys(objOrArr).reduce((result, key) => {
        const value = objOrArr[key];
        return (value) ? result.concat([key]) : result
    }, defaultModifiers);
}

function composeElements(className, elements) {
    if (!elements) {
        return;
    }
    return elements.reduce((result, value) => {
        result[value] = `${className}__${value}`;
        return result;
    }, {});
}

function composeModifiers(className, modifiers, props, context) {
    const modifiersAsProp = props.modifiers;

    // TODO-150914
    // oh boy... really ugly
    const finalModifiers = filterByTruthy(
        (modifiers) ? modifiers(props) : {},
        (modifiersAsProp) ? modifiersAsProp.split(' ') : []
    );

    if (!finalModifiers.length) {
        return className;
    }

    const finalClassName = [
        className,
        finalModifiers
            .filter(_uniqueString)
            .map((name) => `${className}${BEM_MODIFIER_SEPERATOR}${name}`)
            .join(' ')
    ].join(' ');

    return finalClassName;
}

function composeStates(className, states, props) {
    const finalStates = filterByTruthy(
        (states) ? states(props) : {}
    );

    const finalClassName = finalStates.map(name => `${name}`).join(' ');

    return finalClassName;
}

function composeFinalClassName(...strings) {
    return strings.filter(str => str).join(BEM_ELEMENT_SEPERATOR);
}

function BEMComposer(className, settings) {
    _invariant(
        typeof className === 'string',
        `className must be a string, can not be %s`,
        typeof className
    );

    const { elements, modifiers, states, isBlock} = settings;

    return (props, context) => {
        const finalClassName =
            (isBlock)
            ? className
            : composeFinalClassName(context[CLASSNAME_KEY], className);

        const originalClassName = props.className;

        return {
            className: [
                originalClassName,
                composeModifiers(finalClassName, modifiers, props),
                composeStates(finalClassName, states, props)
            ].filter(str => str)
            .join(' '),
            elements: composeElements(finalClassName, elements)
        }
    }
}

export default function BEMDecorator(className, settings = {}) {
    const composeBEM = BEMComposer(className, settings);

    return (TargetComponent) => class BEMDecorator extends Component {

        static propTypes = typesSpec;
        static contextTypes = typesSpec;
        static childContextTypes = typesSpec;

        getChildContext() {
            const { isBlock } = settings;
            const currentClassName = this.context[CLASSNAME_KEY];

            return {
                [CLASSNAME_KEY]: (isBlock)
                    ? className
                    : composeFinalClassName(currentClassName, className)
            }
        }

        render() {
            const { props, context } = this;

            return (
                <TargetComponent { ...props } BEM={ composeBEM(props, context) } />
            );
        };
    }
}
