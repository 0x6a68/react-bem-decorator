import chai from 'chai';
import BEMDecorator from '../';

chai.should();

describe('BEMDecorator', () => {
    it('s true', () => {
        console.log(BEMDecorator(true));
        BEMDecorator(true).should.equal(true);
    });
});

