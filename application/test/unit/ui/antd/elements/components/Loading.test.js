import '../../../../setup';

import React from 'react';
import {expect} from 'chai';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {Spin} from 'antd';

import '../../../../../../src/lib/Localization';
import Loading from '../../../../../../src/ui/antd/elements/components/Loading';

Enzyme.configure({ adapter: new Adapter() });

describe("Loading", () => {
  it("should contain one <Spin />", () => {
    const wrapper = Enzyme.mount(<Loading />);
    expect(wrapper.find(Spin)).to.have.length(1);
  });
});
