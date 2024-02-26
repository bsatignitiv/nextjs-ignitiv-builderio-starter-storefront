import { Theme } from '@emotion/react'
import { SxProps } from '@mui/material'

import theme, { themeBackGround, themeBorder, grey } from '@/styles/theme'

export const B2CMyAccountStyle = {
  accordion: {
    ':before': {
      backgroundColor: 'transparent',
    },
    boxShadow: 0,
    borderRadius: 0,
  },

  accordionDetails: {
    pt: 0,
    p: { md: 0 },
  },
  myAccountChildren: {
    paddingLeft: { md: 0, xs: '16px' },
    paddingRight: { md: 0, xs: '16px' },
    marginTop: '12px',
    marginBottom: '12px',
  },
  accordionSummary: {
    padding: { md: 0 },
  },
  accountCircle: {
    fontSize: {
      md: '44px',
      xs: '53px',
    },
  },
  backButton: {
    typography: 'body2',
    textDecoration: 'none',
    color: 'text.primary',
    display: 'flex',
    alignItems: 'center',
    padding: '16px 8px',
    cursor: 'pointer',
  },
  divider: {
    height: '20px',
    borderColor: 'black',
  },

  menuBarStyle: {
    display: {
      sm: 'flex',
      xs: 'unset',
    },
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  menuBarContainerStyle: {
    borderRight: { md: '1px solid black', sm: '1px solid black', xs: 'none' },
    backgroundColor: 'transparent',
  },

  menuButtons: {
    border: 'none',
    background: 'transparent',
    paddingLeft: { lg: '50px', md: '20px', sm: '10px', xs: '16px' },
    paddingRight: { lg: '50px', md: '20px', sm: '10px', xs: '16px' },
    color: 'black',
    margin: '5px 0',
    fontSize: '14px',
    cursor: 'pointer',
    '&:hover': {
      background: 'transparent',
      border: 'none',
      color: theme?.palette?.primary?.main,
    },
  },
  menuButtonSelected: {
    border: 'none',
    background: 'transparent',
    paddingLeft: { lg: '50px', md: '20px', sm: '10px', xs: '16px' },
    paddingRight: { lg: '10px', md: '20px', sm: '10px', xs: '16px' },
    color: theme?.palette?.primary?.main,
    margin: '10px 0',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 700,
    '&:hover': {
      background: 'transparent',
      border: 'none',
    },
  },
  b2cDataSection: {
    padding: {
      md: '30px',
      xs: '10px',
    },
  },
}
