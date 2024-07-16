import { render, screen } from '@testing-library/react';
import Footer from '../src/components/Footer';

describe('Footer', () => {
  it('renders', () => {
    render(<Footer />);
  });

  it('shows links', () => {
    render(<Footer />);
    const githubLink = screen.getByTestId('github');
    const websiteLink = screen.getByTestId('website');
    expect(githubLink).toBeInTheDocument();
    expect(websiteLink).toBeInTheDocument();
  });

  it('shows year', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByTestId('copyright')).toHaveTextContent(year.toString());
  });
});
