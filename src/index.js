import React, { Component } from 'react';

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

function composeModifiers(className, modifiers, props) {

    if (!modifiers) {
        return className;
    }

    const finalModifiers = filterByTruthy(modifiers(props));

    if (!finalModifiers.length) {
        return className;
    }

    const finalClassName = [
        className,
        finalModifiers.map(([name]) => `${className}--${name}`)
    ].join(' ');

    return finalClassName;
}

function BEMComposer(className, settings = {}) {
    _invariant(
        typeof className === 'string',
        'first Argument can not be empty'
    );

    const { elements, modifiers } = settings;

    return (props) => {
        return {
            className: composeModifiers(className, modifiers, props),
            elements: composeElements(className, elements)
        }
    }
}

export default function BEMDecorator(...args) {
    const composeBEM = BEMComposer(...args);

    return (TargetComponent) => class BEMDecorator extends Component {

        render() {
            const { props } = this;
            return (
                <TargetComponent { ...props } BEM={ composeBEM(props) } />
            );
        };
    }
}
