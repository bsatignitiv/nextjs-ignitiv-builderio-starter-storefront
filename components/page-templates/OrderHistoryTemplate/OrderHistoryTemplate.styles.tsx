import { Theme } from '@emotion/react'

import theme, { themeBackGround, themeBorder, grey } from '@/styles/theme'

export const OrderHistoryTemplateStyle = {
  OrderHistoryItemBox: {
    padding: '30px 15px 10px 0',
  },
  ItemCard: {
    curser: 'pointer',
    height: '170px',
    '&:hover': {
      boxShadow: '0 0 10px #2ea195, 0 0 5px #2ea195',
      cursor: 'pointer',
    },
  },

  ItemCardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  primaryButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: theme?.palette.primary.main,
    border: `1px solid ${theme?.palette.primary.main}`,
    fontSize: '14px',
    color: theme?.palette.common.white,
    fontWeight: '600',
    '&:hover': {
      backgroundColor: themeBackGround.default,
      border: `1px solid ${themeBackGround.default}`,
    },
  },
}
