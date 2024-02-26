import { Theme } from '@emotion/react'
import { SxProps } from '@mui/material'

import theme, { themeBackGround, themeBorder, grey } from '@/styles/theme'

export const FilterOrdersStyle = {
  wrapIcon: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    cursor: 'pointer',
  },
  navBarMainMobile: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '16px',
  },
  closeIcon: {
    display: {
      md: 'none',
    },
    cursor: 'pointer',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    boxShadow: 0,
    margin: '16px 0',
  },
  viewResults: {
    width: '113px',
    height: '32px',
    textTransform: 'capitalize',
  },
  upperTotal: {
    typography: 'body2',
    color: 'grey.600',
    whiteSpace: 'nowrap',
  },
  lowerTotal: {
    display: 'flex',
    justifyContent: 'center',
    typography: 'body2',
    color: 'text.primary',
    fontWeight: 'bold',
  },
  headerSkeletonLoading: {
    height: { md: '28px', xs: '24px' },
    width: { md: '250px', xs: '172px' },
  },
}
