import React from 'react'

import { composeStories } from '@storybook/testing-react'
import { render, screen } from '@testing-library/react'

import * as stories from './SmallBanner.stories'

const { Common } = composeStories(stories)

describe('[Component] - small banner', () => {
  const setup = () => render(<Common {...Common.args} />)
  it('should render component', () => {
    setup()

    const title = Common?.args?.smallBannerProps?.[0]?.title as string
    const subtitle = Common?.args?.smallBannerProps?.[0]?.callToAction?.title as string

    const titleTest = screen.getAllByText(title)
    const subtitleTest = screen.getAllByText(subtitle)

    expect(titleTest[0]).toBeVisible()
    expect(subtitleTest[0]).toBeVisible()
  })
})
