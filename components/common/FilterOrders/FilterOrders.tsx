import React, { useState } from 'react'

import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { FilterOrdersStyle } from './FilterOrders.styles'
import { FacetList } from '@/components/product-listing'

import type { Facet as FacetType, FacetValue } from '@/lib/gql/types'
interface FilterOrdersProps {
  facetList?: FacetType[]
  appliedFilters: FacetValue[]
  onFilterApply: (selectedFilters: string) => void
  onFilterByClose: () => void
  onSelectedTileRemoval: (tile: string) => void
}

const FilterOrders = (props: FilterOrdersProps) => {
  const { facetList, appliedFilters, onFilterApply, onFilterByClose, onSelectedTileRemoval } = props

  const { t } = useTranslation('common')
  const [selectedFacetItems, setSelectedFacetItems] = useState<string>('')

  const handleFilterByClose = () => onFilterByClose()
  const handleFilterApply = () => {
    selectedFacetItems && onFilterApply(selectedFacetItems)
    onFilterByClose()
  }
  const handleFacetItemSelection = (selectedItems: string) => setSelectedFacetItems(selectedItems)

  return (
    <Box>
      <Box sx={FilterOrdersStyle.wrapIcon} onClick={handleFilterByClose}>
        <ArrowBackIos fontSize="inherit" sx={FilterOrdersStyle.wrapIcon} />
        <Typography variant="body2">{t('order-history')}</Typography>
      </Box>
      <Box sx={{ py: '1.2rem' }}>
        <FacetList
          facetList={facetList}
          appliedFilters={appliedFilters}
          showSearchAndCount={false}
          shouldRouteUpdate={false}
          onFilterByClose={onFilterByClose}
          onSelectedTileRemoval={onSelectedTileRemoval}
          onFacetItemSelection={handleFacetItemSelection}
        />
        <Box sx={{ ...FilterOrdersStyle.buttons }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ ...FilterOrdersStyle.viewResults }}
            onClick={handleFilterApply}
          >
            {t('apply')}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default FilterOrders
