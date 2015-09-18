import { expect } from 'chai';
import {
    pipeline,
    uniqueString,
    curry,
    filter,
    join
} from '../src/utils';

describe('partial', () => {
    it('should be', () => {
        const strings = ['string1', 'string1', 'string2', undefined];


        function filterAndConcatWithSeperator(seperator) {
            return curry((...strings) => pipeline(
                strings,
                filter(str => str),
                filter(uniqueString),
                join(seperator)
            ), seperator);
        };
        const curried = curry(filterAndConcatWithSeperator)('__');

        console.log(curried());

        //const filterString =
        //const curried = curry(strings)((str) => console.log())


        ////, partial() =>
                ////strings.filter(str => str).filter(uniqueString).join(seperator), '__');

        //expect(curried(strings)).to.equal('string1__string2');
    });
});

