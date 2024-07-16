import { render, screen } from '@testing-library/react';
import Output from '../src/components/Output';

describe('Output', () => {
  it('renders', () => {
    render(<Output result="Example result" score={0.73424} />);
  });
  it('shows result and score', () => {
    render(<Output result="Example result" score={0.73424} />);
    expect(screen.getByText('Example result')).toBeInTheDocument();
    expect(screen.getByTestId('score')).toHaveTextContent(
      `${(0.73424).toFixed(3)}`
    );
  });
  it('shows ellipsis when there is no result', () => {
    render(<Output result="" score={0.73424} />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
