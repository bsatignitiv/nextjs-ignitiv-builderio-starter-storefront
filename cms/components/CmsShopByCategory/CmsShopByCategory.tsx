import * as React from 'react'
import { useState, useEffect } from 'react'

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import {
  Box,
  Container,
  Grid,
  Link,
  IconButton,
  useMediaQuery,
  useTheme,
  Typography,
} from '@mui/material'

import { ShopByCategoryStyle } from './CmsShopByCategory.styles'
import { useCategorySearchQueries } from '@/hooks'
import { categorySearchGetters, productGetters } from '@/lib/getters'
import { uiHelpers } from '@/lib/helpers'

interface Item {
  link: string
  imageUrl: string
  imageAlt: string
  categoryName: string
}
interface ShopByCategoryProp {
  title: string
  categoryItems: Item[]
}

interface HomePageProps {
  shopByCategory: ShopByCategoryProp
  categoryCodes: Array<string>
}

const CmsHomePageCategory = (props: HomePageProps) => {
  const kiboTheme = useTheme()
  const { shopByCategory, categoryCodes } = props

  const { getCategoryLink } = uiHelpers()
  const { data: categorySearchResult } = useCategorySearchQueries(categoryCodes)
  const categories = categorySearchResult?.items || []

  const [items, setItems] = useState(categories)
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const isMobile = useMediaQuery(kiboTheme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(kiboTheme.breakpoints.down('md'))
  const itemsPerPage = isMobile ? 1 : isTablet ? 3 : 8

  const handleItemClick = (item: Item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((selectedItem) => selectedItem !== item)
        : [...prevSelected, item]
    )
  }

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - itemsPerPage : prevIndex - itemsPerPage
    )
  }

  const handleNextClick = () => {
    setCurrentIndex((nextIndex) =>
      nextIndex + itemsPerPage >= items.length ? 0 : nextIndex + itemsPerPage
    )
  }

  useEffect(() => {
    setItems(categories)
  }, [categories])

  const isPrevDisabled = currentIndex === 0
  const isNextDisabled = currentIndex + itemsPerPage >= items.length

  return (
    <Container maxWidth={'xl'} sx={ShopByCategoryStyle.container}>
      <Box sx={ShopByCategoryStyle.navigationContainer}>
        <Typography variant="h1" gutterBottom sx={ShopByCategoryStyle.mainTitle}>
          {shopByCategory?.title}
        </Typography>
        <Box sx={ShopByCategoryStyle.navigationIconContainer}>
          <IconButton
            onClick={handleNextClick}
            sx={
              isNextDisabled ? ShopByCategoryStyle.disabledButton : ShopByCategoryStyle.prevButton
            }
            disabled={isNextDisabled}
          >
            <NavigateNextIcon />
          </IconButton>
          <IconButton
            onClick={handlePrevClick}
            sx={
              isPrevDisabled ? ShopByCategoryStyle.disabledButton : ShopByCategoryStyle.nextButton
            }
            disabled={isPrevDisabled}
          >
            <NavigateBeforeIcon />
          </IconButton>
        </Box>
      </Box>
      <Grid container spacing={4} sx={ShopByCategoryStyle.gridContainer}>
        {items.slice(currentIndex, currentIndex + itemsPerPage).map((item: any) => (
          <Grid
            item
            md={3}
            sm={4}
            xs={12}
            onClick={() => handleItemClick(item)}
            sx={ShopByCategoryStyle.categoryMainItem}
            key={item?.categoryCode}
          >
            <Box sx={ShopByCategoryStyle.categoryItem}>
              <Link
                href={getCategoryLink(item?.categoryCode as string)}
                sx={ShopByCategoryStyle.categoryLink}
              >
                <Box sx={ShopByCategoryStyle.categoryItemWrapper}>
                  <Box sx={ShopByCategoryStyle.categoryImageWrapper}>
                    <Box
                      component="img"
                      src={productGetters.handleProtocolRelativeUrl(
                        categorySearchGetters.getCoverImage(item)
                      )}
                      sx={ShopByCategoryStyle.categoryImage}
                    />
                  </Box>
                  <Box sx={ShopByCategoryStyle.categoryText}>
                    {categorySearchGetters.getName(item) as string}
                  </Box>
                </Box>
              </Link>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default CmsHomePageCategory
