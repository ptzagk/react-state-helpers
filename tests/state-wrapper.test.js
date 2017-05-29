import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import expect from 'expect';

import stateWrapper from '../src/index';

class TestEverything extends Component {
  constructor(props) {
    super(props);

    this.state = { someWithValue: '', foundValue: '' };
  }

  render() {
    const {
      state: { someWithValue, foundValue },
      props: {
        mut, toggle, withValue, findValue, handleSumbit,
        values: { mutValue, toggleValue, mutTransformValue }
      }
    } = this;

    return (
      <div>
        {/* toggle */}
        <span dataToggleTest>{toggleValue}</span>
        <button dataToggleButton onClick={toggle('toggleValue')}>toggle button</button>

        {/* mut */}
        <span dataMutTest>{mutValue}</span>
        <input dataMutInput type='text' value={mutValue} onChange={mut('mutValue')} />

        {/* mut with transform */}
        <span dataMutTransformTest>{mutTransformValue}</span>
        <input dataMutTransformInput type='text'
          value={mutTransformValue}
          onChange={mut('mutTransformValue', parseInt)} />

        {/* withValue */}
        <span dataWithValueTest>{someWithValue}</span>
        <input dataWithValueInput type='text'
          value={someWithValue}
          onChange={withValue(v => this.setState({ someWithValue: `hi: ${v}` }))} />

        {/* findValue */}
        <span dataFindValueTest>{foundValue}</span>
        <input dataFindValueInput type='text'
          value={foundValue}
          onChange={e => this.setState({ foundValue: `hi: ${findValue(e)}` })} />
      </div>
    );
  }
}

function makeWrappedComponent() {
  return React.createElement(stateWrapper(TestEverything));
}

describe('mut', () => {
  it('changes a value', () => {
    const wrapper = mount(makeWrappedComponent());

    wrapper.find('[dataMutInput]').simulate('change', { target: { value: 'changed' } });
    wrapper.update();

    const state = wrapper.state();

    expect(state.mutValue).toEqual('changed');
    expect(wrapper.find('[dataMutTest]').text()).toEqual('changed');
  });


  it('transforms a value', () => {
    const wrapper = mount(makeWrappedComponent());

    wrapper.find('[dataMutTransformInput]').simulate('change', { target: { value: '2.3' } });
    wrapper.update();

    const state = wrapper.state();

    expect(state.mutTransformValue).toEqual(2);
    expect(wrapper.find('[dataMutTransformTest]').text()).toEqual('2');
  });
});

describe('toggle', () => {
  it('inverts the value', () => {
    const wrapper = mount(makeWrappedComponent());

    wrapper.find('[dataToggleButton]').simulate('click');
    wrapper.update();

    expect(wrapper.state().toggleValue).toEqual(true);
  });
});

describe('withValue', () => {
  it('changes the value', () => {
    const wrapper = mount(makeWrappedComponent());

    wrapper.find('[dataWithValueInput]').simulate('change', { target: { value: 'someValue' } });
    wrapper.update();

    expect(wrapper.find('[dataWithValueTest]').text()).toEqual('hi: someValue');
  });
});


describe('findValue', () => {
  it('is used to change the state', () => {
    const wrapper = mount(makeWrappedComponent());

    wrapper.find('[dataFindValueInput]').simulate('change', { target: { value: 'aFoundValue' } });
    wrapper.update();

    expect(wrapper.find('[dataFindValueTest]').text()).toEqual('hi: aFoundValue');
  });
});