import React from 'react';
import { render } from '@testing-library/react';
import FooterSocialItem from '../FooterSocialItem';

describe('FooterSocialItem', () => {
  it('renders all social', () => {
    const social = {
      name: 'twitter',
      title: 'Twitter',
      url: 'http://example.com',
    };
    const { getByTestId } = render(<FooterSocialItem social={social} />);

    expect(getByTestId(social.name)).toBeInTheDocument();
  });
});
