import React, { useCallback, useState } from 'react'

import AccountCircle from '@mui/icons-material/AccountCircle'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
  Link,
  Grid,
  Button,
} from '@mui/material'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useReCaptcha } from 'next-recaptcha-v3'

import { B2CMyAccountStyle } from './MyAccountTemplate.styles'
import { FullWidthDivider } from '@/components/common'
import { MyProfile, PaymentMethod, AddressBook } from '@/components/my-account'
import { useAuthContext, useSnackbarContext } from '@/context'
import {
  useGetCards,
  useGetCustomerAddresses,
  useCreateCustomerCard,
  useUpdateCustomerCard,
  useCreateCustomerAddress,
  useUpdateCustomerAddress,
  useValidateCustomerAddress,
} from '@/hooks'
import { validateGoogleReCaptcha } from '@/lib/helpers'
import type { BillingAddress, CardType } from '@/lib/types'

import type { CuAddress, CustomerAccount } from '@/lib/gql/types'

interface MyAccountTemplateProps {
  user?: CustomerAccount
}

const MyAccountTemplate = (props: MyAccountTemplateProps) => {
  const { user } = props
  const { t } = useTranslation('common')
  const { publicRuntimeConfig } = getConfig()
  const isSubscriptionEnabled = publicRuntimeConfig.isSubscriptionEnabled
  const reCaptchaKey = publicRuntimeConfig.recaptcha.reCaptchaKey
  const router = useRouter()
  const theme = useTheme()
  const mdScreen = useMediaQuery(theme.breakpoints.up('md'))
  const { logout } = useAuthContext()

  const { data: cards } = useGetCards(user?.id as number)
  const { data: contacts } = useGetCustomerAddresses(user?.id as number)

  const { createCustomerCard } = useCreateCustomerCard()
  const { updateCustomerCard } = useUpdateCustomerCard()
  const { createCustomerAddress } = useCreateCustomerAddress()
  const { updateCustomerAddress } = useUpdateCustomerAddress()
  const { validateCustomerAddress } = useValidateCustomerAddress()

  const [selectedOption, setSelectedOption] = useState('my-profile-content')

  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value)
    if (window.innerWidth <= 600) {
      window.scrollTo({
        top: window.scrollY + 400,
        behavior: 'smooth',
      })
    }
  }

  const handleGoToOrderHistory = () => {
    router.push('/my-account/order-history')
  }

  const handleGoToSubscription = useCallback(() => {
    router.push('/my-account/subscription')
  }, [router])

  const handleSave = async (
    address: BillingAddress,
    card: CardType,
    isUpdatingAddress: boolean
  ) => {
    try {
      let response
      await validateCustomerAddress.mutateAsync({
        addressValidationRequestInput: {
          address: address?.customerContactInput?.address as CuAddress,
        },
      })
      // Add update address
      if (isUpdatingAddress) {
        response = await updateCustomerAddress.mutateAsync(address)
      } else {
        response = await createCustomerAddress.mutateAsync(address)
      }
      const params = {
        accountId: card.accountId,
        cardId: card.cardId,
        cardInput: card.cardInput,
      }
      params.cardInput.contactId = response.id
      // Add update card
      if (card.cardId) {
        await updateCustomerCard.mutateAsync(params)
      } else {
        await createCustomerCard.mutateAsync(params)
      }
    } catch (error: any) {
      console.error(error)
    }
  }

  const { executeRecaptcha } = useReCaptcha()
  const { showSnackbar } = useSnackbarContext()

  const submitFormWithRecaptcha = (
    address: BillingAddress,
    card: CardType,
    isUpdatingAddress: boolean
  ) => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available')
      return
    }
    executeRecaptcha('enquiryFormSubmit').then(async (gReCaptchaToken: any) => {
      const captcha = await validateGoogleReCaptcha(gReCaptchaToken)

      if (captcha?.status === 'success') {
        await handleSave(address, card, isUpdatingAddress)
      } else {
        showSnackbar(captcha.message, 'error')
      }
    })
  }

  return (
    <Box>
      {!mdScreen && (
        <Link aria-label={t('back')} sx={{ ...B2CMyAccountStyle.backButton }} href="/">
          <ChevronLeft />
          {t('back')}
        </Link>
      )}
      <Grid container>
        <Grid
          item
          md={12}
          xs={12}
          sx={{
            display: { md: 'flex', xs: 'block' },
            alignItems: 'center',
            ...B2CMyAccountStyle.myAccountChildren,
          }}
        >
          <Box sx={{ display: { xs: 'flex' }, justifyContent: { xs: 'center' } }}>
            <AccountCircle sx={{ ...B2CMyAccountStyle.accountCircle }} />
          </Box>
          <Typography
            variant={mdScreen ? 'h1' : 'h2'}
            sx={{ paddingLeft: { md: '0.5rem', xs: 0 } }}
          >
            {t('my-account')}
          </Typography>
        </Grid>
        <Grid item md={2} sm={3} xs={12} sx={{ ...B2CMyAccountStyle.menuBarContainerStyle }}>
          <Box sx={{ ...B2CMyAccountStyle.menuBarStyle }}>
            <Divider />
            <Button
              sx={
                selectedOption && selectedOption === 'my-profile-content'
                  ? { ...B2CMyAccountStyle.menuButtonSelected }
                  : { ...B2CMyAccountStyle.menuButtons }
              }
              onClick={handleSelectChange}
              value="my-profile-content"
            >
              {t('my-profile')}
            </Button>
            <Divider />
            <Button
              sx={
                selectedOption && selectedOption === 'address-book-content'
                  ? { ...B2CMyAccountStyle.menuButtonSelected }
                  : { ...B2CMyAccountStyle.menuButtons }
              }
              onClick={handleSelectChange}
              value="address-book-content"
            >
              {t('address-book')}
            </Button>
            <Divider />
            <Button
              sx={
                selectedOption && selectedOption === 'payment-method-content'
                  ? { ...B2CMyAccountStyle.menuButtonSelected }
                  : { ...B2CMyAccountStyle.menuButtons }
              }
              onClick={handleSelectChange}
              value="payment-method-content"
            >
              {t('payment-method')}
            </Button>
            <Divider />
            <Button
              sx={{
                ...B2CMyAccountStyle.menuButtons,
              }}
              onClick={handleGoToOrderHistory}
            >
              {t('order-history')}
            </Button>
            <Divider />
            {isSubscriptionEnabled && (
              <>
                <Button
                  sx={{
                    ...B2CMyAccountStyle.menuButtons,
                  }}
                  onClick={handleGoToSubscription}
                >
                  {t('my-subscription')}
                </Button>
                <Divider />
              </>
            )}
            <Button sx={{ ...B2CMyAccountStyle.menuButtons }} onClick={logout} value="option2">
              {t('logout')}
            </Button>
            <Divider />
          </Box>
        </Grid>
        <Grid item md={10} sm={9} xs={12}>
          <Box sx={{ ...B2CMyAccountStyle.b2cDataSection }}>
            {selectedOption && (
              <div>
                {selectedOption === 'my-profile-content' && (
                  <MyProfile user={user as CustomerAccount} />
                )}
                {selectedOption === 'address-book-content' && (
                  <AddressBook user={user as CustomerAccount} contacts={contacts} />
                )}
                {selectedOption === 'payment-method-content' && (
                  <PaymentMethod
                    user={user as CustomerAccount}
                    cards={cards}
                    contacts={contacts}
                    onSave={(address, card, isUpdatingAddress) =>
                      reCaptchaKey
                        ? submitFormWithRecaptcha(address, card, isUpdatingAddress)
                        : handleSave(address, card, isUpdatingAddress)
                    }
                  />
                )}
              </div>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default MyAccountTemplate
