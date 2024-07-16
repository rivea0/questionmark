import { render, screen } from '@testing-library/react';
import TextInput from '../src/components/TextInput';

describe('TextInput', () => {
  it('renders', () => {
    render(<TextInput value="Example text" onChange={() => {}} />);
  });
  it('shows input element', () => {
    render(<TextInput value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });
});
