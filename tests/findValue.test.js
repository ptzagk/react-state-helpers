import expect from 'expect';
import { findValue } from '../src/index';

describe('findValue', () => {
  it('finds the value', () => {
    const result = findValue({ target: { value: 'string' }})

    expect(result).toEqual('string');
  });

  it('prioritizes value over checked', () => {
    const result = findValue({ target: { value: 4, checked: true }})

    expect(result).toEqual(4);
  });
});
