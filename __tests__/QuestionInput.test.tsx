import { render, screen } from '@testing-library/react';
import QuestionInput from '../src/components/QuestionInput';

describe('QuestionInput', () => {
  it('renders', () => {
    render(<QuestionInput value="Example question?" onChange={() => {}} />);
  });
  it('shows input element', () => {
    render(<QuestionInput value="" onChange={() => {}} />);
    expect(
      screen.getByPlaceholderText('What is going on?')
    ).toBeInTheDocument();
  });
});
