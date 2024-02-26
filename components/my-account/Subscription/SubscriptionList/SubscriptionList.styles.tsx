import { Theme } from '@emotion/react'

import theme, { themeBackGround, themeBorder, grey } from '@/styles/theme'

export const SubscriptionListStyle = {
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
    width: '100%',
    mt: '5%',
    ml: '0.5%',
    px: {
      xs: 1,
      sm: 4,
    },
  },
  wrapIcon: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    cursor: 'pointer',
  },
  card: {
    maxWidth: '100%',
    border: 1,
    borderRadius: 1,
    mt: '1%',
  },
  subscriptionNumber: {
    pt: {
      xs: '2%',
      md: '0',
    },
    justifyContent: {
      xs: 'flex-start',
      md: 'space-between',
    },
  },
  subscriptionItem: {
    pt: {
      xs: '2%',
      md: '1%',
    },
    justifyContent: 'space-between',
  },
}
