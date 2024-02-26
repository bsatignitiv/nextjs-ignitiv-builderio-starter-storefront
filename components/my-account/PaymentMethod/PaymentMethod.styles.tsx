import { Theme } from '@emotion/react'

import theme, { themeBackGround, themeBorder, grey } from '@/styles/theme'

export const PaymentMethodStyle = {
  PaymentsBox: {
    padding: '20px 15px 30px 0',
  },
  cardAction: {
    justifyContent: 'space-between',
  },

  cardActionSectionPrimary: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    padding: '0 16px',
  },
  cardActionSection: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
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
