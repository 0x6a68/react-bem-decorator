import React, { Component } from 'react';

function filterByTruthy(obj) {
    // poormans Object.entries().filter...
    return Object.keys(obj).reduce((result, key) => {
        const value = obj[key];
        return (value) ? result.concat([[key, value]]) : result
    }, []);
}

function composeElements(className, elements = []) {
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

function BEMComposer(className, { elements, modifiers } ) {
    return (props) => {
        return {
            className: composeModifiers(className, modifiers, props),
            elements: composeElements(className, elements)
        }
    }
}

export default function BEMDecorator(className = '', settings = {}) {

    const composeBEM = BEMComposer(className, settings);

    return (TargetComponent) => class extends Component {

        render() {
            const { props } = this;

            return (
                <TargetComponent { ...props } BEM={ composeBEM(props) } />
            );
        };
    }
}
