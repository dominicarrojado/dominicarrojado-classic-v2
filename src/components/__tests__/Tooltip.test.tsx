import React from 'react';
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import Tooltip from '../Tooltip';

const children = "I'm a tooltip";

describe('Tooltip', () => {
  it('does not render its children by default', () => {
    const { queryByText } = render(<Tooltip>{children}</Tooltip>);

    expect(queryByText(new RegExp(children))).not.toBeInTheDocument();
  });

  it('does render its children on prop "isMounted"', () => {
    const { queryByText } = render(
      <Tooltip isMounted={true}>{children}</Tooltip>
    );

    expect(queryByText(new RegExp(children))).toBeInTheDocument();
  });

  it('does render its children on event "mouseEnter"', async () => {
    const { getByRole, queryByText } = render(<Tooltip>{children}</Tooltip>);

    fireEvent.mouseEnter(getByRole('tooltip'));

    expect(queryByText(new RegExp(children))).toBeInTheDocument();
  });

  it('does unmount its children on event "mouseLeave"', async () => {
    const { getByRole, queryByText } = render(<Tooltip>{children}</Tooltip>);
    const tooltipEl = getByRole('tooltip');

    fireEvent.mouseEnter(tooltipEl);
    fireEvent.mouseLeave(tooltipEl);

    const regex = new RegExp(children);

    await waitForElementToBeRemoved(() => queryByText(regex));

    expect(queryByText(regex)).not.toBeInTheDocument();
  });
});
