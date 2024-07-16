import { render, screen } from '@testing-library/react';
import URLInput from '../src/components/URLInput';

describe('URLInput', () => {
  it('renders', () => {
    render(<URLInput value="https://example.com" onChange={() => {}} />);
  });
  it('shows input element', () => {
    render(<URLInput value="" onChange={() => {}} />);
    expect(
      screen.getByPlaceholderText('https://example.com')
    ).toBeInTheDocument();
  });
});
