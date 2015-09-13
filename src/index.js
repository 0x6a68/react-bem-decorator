import React, { Component, PropTypes } from 'react';

const BEM_ELEMENT_SEPERATOR = '__';
const BEM_MODIFIER_SEPERATOR = '--';
const CLASSNAME_KEY = '__BEMClassName__';
const typesSpec = { [CLASSNAME_KEY]: PropTypes.string };

function _invariant(condition, format = '', ...vars) {
    if (condition) {
        return;
    }

    let index = 0;
    throw new Error(
        `Invariant Violation: ${format.replace(/%s/g, () => vars[index++])}`
    );
}

function filterByTruthy(obj) {
    // poormans Object.entries().filter...
    return Object.keys(obj).reduce((result, key) => {
        const value = obj[key];
        return (value) ? result.concat([[key, value]]) : result
    }, []);
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

    if (!modifiers) {
        return className;
    }

    const finalModifiers = filterByTruthy(modifiers(props));

    if (!finalModifiers.length) {
        return className;
    }

    const finalClassName = [
        className,
        finalModifiers.map(([name]) => `${className}${BEM_MODIFIER_SEPERATOR}${name}`)
    ].join(' ');

    return finalClassName;
}

function BEMComposer(className, settings) {
    _invariant(
        typeof className === 'string',
        'first Argument can not be empty'
    );

    const { elements, modifiers } = settings;

    return (props, context) => {
        const finalClassName = [context[CLASSNAME_KEY], className]
            .filter(str => str)
            .join(BEM_ELEMENT_SEPERATOR)

        return {
            className: composeModifiers(finalClassName, modifiers, props),
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
            return {
                [CLASSNAME_KEY]: className
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
