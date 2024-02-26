import React from 'react'

import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos'
import {
  Box,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material'
import { useTranslation } from 'next-i18next'

import { FullWidthDivider, Price } from '@/components/common'
import { OrderHistoryTemplateStyle } from '@/components/page-templates/OrderHistoryTemplate/OrderHistoryTemplate.styles'
export interface OrderHistoryItemProps {
  id: string
  submittedDate: string
  productNames: string
  orderTotal: number
  orderStatus: string
  onHistoryItemClick: (id: string) => void
}

const styles = {
  stack: {
    pt: 2,
    pb: 3,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  box: {
    width: '5%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
}

const OrderHistoryItem = (props: OrderHistoryItemProps) => {
  const { id, submittedDate, productNames, orderTotal, orderStatus, onHistoryItemClick } = props
  const { t } = useTranslation('common')

  const givenString = productNames
  const productNamesArray = givenString.split(',')
  const firstItem = productNamesArray[0].trim() // Get the first item and remove leading/trailing whitespace
  const totalItems = productNamesArray.length

  const handleHistoryItemClick = () => {
    onHistoryItemClick(id)
  }

  return (
    <>
      <Card
        sx={{ ...OrderHistoryTemplateStyle.ItemCard }}
        data-testid="history-item"
        onClick={handleHistoryItemClick}
      >
        <CardContent sx={{ ...OrderHistoryTemplateStyle.ItemCardContent }}>
          <Typography variant="body1" fontWeight="bold">
            {submittedDate}
          </Typography>
          <Typography variant="body1" color={'text.secondary'}>
            {firstItem}{' '}
            {totalItems > 1 && (
              <Typography component="span">and {totalItems - 1} more item</Typography>
            )}
          </Typography>
          <Price price={t('currency', { val: orderTotal })} />

          <Typography variant="body2" color={'primary'}>
            {orderStatus}
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}

export default OrderHistoryItem
