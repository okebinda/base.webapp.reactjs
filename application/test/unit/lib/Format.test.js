import {expect} from 'chai';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import Format from '../../../src/lib/Format';

Enzyme.configure({ adapter: new Adapter() });

describe("Format", () => {

  it("should format a number with a thousands separator", () => {
    expect(Format.number(8192)).to.equal("8,192");
  });

  it("should format a number with a thousands separator and three fractional digits", () => {
    expect(Format.number(52197.925853, 3)).to.equal("52,197.926");
  });
});
