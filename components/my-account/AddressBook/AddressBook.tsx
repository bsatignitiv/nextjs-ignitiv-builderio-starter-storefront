import React, { useEffect, useState } from 'react'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import Delete from '@mui/icons-material/Delete'
import {
  Box,
  Typography,
  Divider,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Grid,
  Collapse,
  CardContent,
  CardActions,
  Card,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import getConfig from 'next/config'
import { useTranslation } from 'next-i18next'
import { useReCaptcha } from 'next-recaptcha-v3'
import { TransitionGroup } from 'react-transition-group'

import { AddressCard, AddressForm, KiboSelect, KiboPagination } from '@/components/common'
import { ConfirmationDialog } from '@/components/dialogs'
import { useModalContext, useSnackbarContext } from '@/context'
import {
  useCreateCustomerAddress,
  useUpdateCustomerAddress,
  useDeleteCustomerAddress,
  useValidateCustomerAddress,
} from '@/hooks'
import { AddressType } from '@/lib/constants'
import { userGetters } from '@/lib/getters'
import { buildAddressParams, validateGoogleReCaptcha } from '@/lib/helpers'
import type { Address, ContactForm, DeleteAddressParams } from '@/lib/types'

import type { UpdateCustomerAccountContactDetailsParams } from '@/hooks'
import type {
  CuAddress,
  CustomerAccount,
  CustomerContact,
  CustomerContactCollection,
} from '@/lib/gql/types'

interface AddressBookProps {
  user: CustomerAccount
  contacts: CustomerContactCollection
}

interface AccountAddressProps {
  customerContact: CustomerContact
  isPrimaryAddress: boolean
  addressType: string
  editAddress: (customerContact: CustomerContact) => void
  deleteAddress: (deleteAddressParams: { accountId: number; contactId: number }) => void
}

const styles = {
  addNewAddressButtonStyle: {
    maxWidth: '420px',
    '& > *:first-of-type': {
      fontSize: 'inherit',
    },
  },
}
const buildAddressProps = (customerContact: CustomerContact) => {
  const { firstName, lastNameOrSurname, address } = customerContact
  const { address1, address2, cityOrTown, stateOrProvince, postalOrZipCode } = address as CuAddress
  return {
    firstName: firstName as string,
    lastNameOrSurname: lastNameOrSurname as string,
    address1,
    address2,
    cityOrTown,
    stateOrProvince,
    postalOrZipCode,
  }
}

const AccountAddress = (props: AccountAddressProps) => {
  const { customerContact, isPrimaryAddress, addressType, editAddress, deleteAddress } = props
  const { t } = useTranslation('common')
  return (
    <Card>
      <CardContent>
        <AddressCard {...buildAddressProps(customerContact)} />
      </CardContent>
      <CardActions className="AddressBoxCardAction">
        <Box
          className={
            isPrimaryAddress ? 'AddressBoxCardActionSectionPrimary' : 'AddressBoxCardActionSection'
          }
        >
          {isPrimaryAddress && (
            <>
              {customerContact?.types?.[0]?.isPrimary && (
                <Typography variant="h4" fontWeight="500">
                  {t('primary')}
                </Typography>
              )}
            </>
          )}
          <Button sx={{}} onClick={() => editAddress(customerContact)} data-testid={`address-edit`}>
            {t('edit')}
          </Button>
          {!isPrimaryAddress && (
            <Button
              sx={{}}
              onClick={() =>
                deleteAddress({
                  accountId: customerContact?.accountId,
                  contactId: customerContact?.id as number,
                })
              }
            >
              {' '}
              {t('delete')}
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  )
}

const AddressBook = (props: AddressBookProps) => {
  const { user, contacts } = props

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'))

  const { publicRuntimeConfig } = getConfig()
  const shippingAddressPageSize = publicRuntimeConfig.shippingAddressPageSize
  const billingAddressPageSize = publicRuntimeConfig.billingAddressPageSize
  const reCaptchaKey = publicRuntimeConfig.recaptcha.reCaptchaKey
  const [isAddressModified, setIsAddressModified] = useState<boolean>(false)
  const [validateForm, setValidateForm] = useState<boolean>(false)
  const [isDefaultAddress, setIsDefaultAddress] = useState<boolean>(false)
  const [saveAsShippingBillingCheckbox, setSaveAsShippingBillingCheckbox] = useState<boolean>(false)
  const [editAddress, setEditAddress] = useState<CustomerContact>()
  const [addressType, setAddressType] = useState<string>(AddressType.SHIPPING)

  const { t } = useTranslation('common')
  const { showModal, closeModal } = useModalContext()
  const { createCustomerAddress } = useCreateCustomerAddress()
  const { updateCustomerAddress } = useUpdateCustomerAddress()
  const { deleteCustomerAddress } = useDeleteCustomerAddress()
  const { validateCustomerAddress } = useValidateCustomerAddress()
  const { executeRecaptcha } = useReCaptcha()
  const { showSnackbar } = useSnackbarContext()

  const shippingAddresses =
    userGetters.getUserShippingAddress(contacts?.items as CustomerContact[]) ?? []
  const billingAddresses =
    userGetters.getUserBillingAddresses(contacts?.items as CustomerContact[]) ?? []

  const [shippingAddressStartIndex, setShippingAddressStartIndex] = useState<number>(0)
  const [billingAddressStartIndex, setBillingAddressStartIndex] = useState<number>(0)
  const [displayShippingAddresses, setDisplayShippingAddresses] = useState<CustomerContact[]>(
    shippingAddresses?.slice(shippingAddressStartIndex, shippingAddressPageSize)
  )
  const [displayBillingAddresses, setDisplayBillingAddresses] = useState<CustomerContact[]>(
    billingAddresses.slice(billingAddressStartIndex, billingAddressPageSize)
  )

  const [isAddressFormValid, setIsAddressFormValid] = useState<boolean>(false)

  const scrollToShippingAddressHeading = () => {
    const shippingAddressHeading = document.getElementById('shipping-address')
    if (shippingAddressHeading) {
      shippingAddressHeading.scrollIntoView({ behavior: 'smooth' })
    }
  }
  const scrollToBillingAddressHeading = () => {
    const billingAddressHeading = document.getElementById('billing-address')
    if (billingAddressHeading) {
      billingAddressHeading.scrollIntoView({ behavior: 'smooth' })
    }
  }
  const handleNewAddress = () => {
    setIsAddressModified(true)
    setEditAddress(undefined)
    setAddressType(AddressType.SHIPPING)
  }

  const handleEditAddress = (contact: CustomerContact) => {
    if (contact?.types) {
      setIsDefaultAddress(contact?.types[0]?.isPrimary as boolean)
      setAddressType(contact?.types[0]?.name as string)
      setIsAddressModified(true)
    }
    setEditAddress(contact)
  }

  const handleAddressValidationAndSave = () => setValidateForm(true)

  const submitFormWithRecaptcha = (address: Address) => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available')
      return
    }
    executeRecaptcha('enquiryFormSubmit').then(async (gReCaptchaToken) => {
      const captcha = await validateGoogleReCaptcha(gReCaptchaToken)

      if (captcha?.status === 'success') {
        await handleSaveAddress(address)
      } else {
        showSnackbar(captcha.message, 'error')
      }
    })
  }

  const handleSaveAddress = async (address: Address) => {
    address = {
      ...address,
      contact: {
        ...address.contact,
        email: user.emailAddress as string,
      },
    }
    const params = buildAddressParams({
      accountId: user?.id,
      address,
      isDefaultAddress,
      addressType: addressType,
    })

    try {
      await validateCustomerAddress.mutateAsync({
        addressValidationRequestInput: { address: address?.contact?.address as CuAddress },
      })
      if (address?.contact?.id) {
        await updateCustomerAddress.mutateAsync(params as UpdateCustomerAccountContactDetailsParams)
        setIsAddressModified(false)
      } else {
        await createCustomerAddress.mutateAsync(params)
        if (saveAsShippingBillingCheckbox) {
          const addressParam = buildAddressParams({
            accountId: user?.id,
            address,
            isDefaultAddress,
            addressType:
              addressType === AddressType.SHIPPING ? AddressType.BILLING : AddressType.SHIPPING,
          })
          await createCustomerAddress.mutateAsync(addressParam)
        }
        setIsAddressModified(false)
      }

      setValidateForm(false)
    } catch (error) {
      setValidateForm(false)
      console.error('Error: add/edit saved address from my account', error)
    }
  }

  const handleCancelUpdateAddress = () => {
    setIsAddressModified(false)
  }

  const handleConfirmDeleteAddress = (deleteAddressProps: DeleteAddressParams) => {
    showModal({
      Component: ConfirmationDialog,
      props: {
        onConfirm: () => handleDeleteAddress(deleteAddressProps),
        contentText: t('delete-address-confirm-message'),
        primaryButtonText: t('delete'),
      },
    })
  }

  const handleDeleteAddress = async (deleteAddressProps: DeleteAddressParams) => {
    try {
      await deleteCustomerAddress.mutateAsync(deleteAddressProps)
      closeModal()
    } catch (error) {
      console.log('Error: delete saved address from my account', error)
    }
  }

  const shouldShowDefaultCheckbox = () => {
    if (addressType === AddressType.SHIPPING && shippingAddresses && shippingAddresses.length > 0)
      return true
    if (addressType === AddressType.BILLING && billingAddresses && billingAddresses.length > 0)
      return true
    return false
  }

  const handleFormStatusChange = (status: boolean) => setIsAddressFormValid(status)

  const handleShippingAddressPagination = (value: any) => {
    const { startIndex } = value
    setShippingAddressStartIndex(startIndex)
    setDisplayShippingAddresses(
      shippingAddresses?.slice(startIndex, startIndex + shippingAddressPageSize)
    )
    scrollToShippingAddressHeading()
  }

  const handleBillingAddressPagination = (value: any) => {
    const { startIndex } = value
    setBillingAddressStartIndex(startIndex)
    setDisplayBillingAddresses(
      billingAddresses.slice(startIndex, startIndex + billingAddressPageSize)
    )
    scrollToBillingAddressHeading()
  }

  useEffect(() => {
    setDisplayShippingAddresses(
      shippingAddresses?.slice(
        shippingAddressStartIndex,
        shippingAddressStartIndex + shippingAddressPageSize
      )
    )
  }, [JSON.stringify(shippingAddresses)])

  useEffect(() => {
    setDisplayBillingAddresses(
      billingAddresses.slice(
        billingAddressStartIndex,
        billingAddressStartIndex + billingAddressPageSize
      )
    )
  }, [JSON.stringify(billingAddresses)])

  return (
    <Box data-testid={'address-book-component'}>
      <Box pb={2}>
        {!isAddressModified &&
          !displayShippingAddresses?.length &&
          !displayBillingAddresses?.length && (
            <Typography variant="body1">{t('no-saved-addresses-yet')}</Typography>
          )}
      </Box>
      {!isAddressModified && (
        <Box>
          <TransitionGroup>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  id="shipping-address"
                  variant="h3"
                  sx={{ pb: '16px', fontWeight: '700' }}
                >
                  {t('shipping-address')}
                </Typography>
              </Grid>
              {displayShippingAddresses?.map((item: CustomerContact, index: number) => (
                <Grid
                  key={`${item?.id}address`}
                  item
                  xs={isSmallScreen ? 12 : 6}
                  md={isMediumScreen ? 6 : 4}
                >
                  <Box className="AddressBox">
                    <AccountAddress
                      customerContact={item}
                      isPrimaryAddress={index === 0}
                      addressType={AddressType.SHIPPING}
                      editAddress={handleEditAddress}
                      deleteAddress={handleConfirmDeleteAddress}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
            {displayShippingAddresses?.length > 0 && shippingAddresses.length > 3 && (
              <Box display={'flex'} justifyContent={'center'} width="100%" py={10}>
                <KiboPagination
                  count={Math.ceil(shippingAddresses?.length / shippingAddressPageSize)}
                  startIndex={shippingAddressStartIndex}
                  pageSize={shippingAddressPageSize}
                  onPaginationChange={handleShippingAddressPagination}
                />
              </Box>
            )}
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  id="billing-address"
                  variant="h3"
                  sx={{ pb: '16px', fontWeight: '700' }}
                >
                  {t('billing-address')}
                </Typography>
              </Grid>
              {displayBillingAddresses?.map((item: CustomerContact, index: number) => (
                <Grid
                  key={`${item?.id}address`}
                  item
                  xs={isSmallScreen ? 12 : 6}
                  md={isMediumScreen ? 6 : 4}
                >
                  <Box className="AddressBox">
                    <AccountAddress
                      customerContact={item}
                      isPrimaryAddress={index === 0}
                      addressType={AddressType.BILLING}
                      editAddress={handleEditAddress}
                      deleteAddress={handleConfirmDeleteAddress}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>

            {displayBillingAddresses?.length > 0 && billingAddresses?.length > 4 && (
              <Box display={'flex'} justifyContent={'center'} width="100%" py={10}>
                <KiboPagination
                  count={Math.ceil(billingAddresses?.length / billingAddressPageSize)}
                  startIndex={billingAddressStartIndex}
                  pageSize={billingAddressPageSize}
                  onPaginationChange={handleBillingAddressPagination}
                />
              </Box>
            )}
          </TransitionGroup>
        </Box>
      )}
      {!isAddressModified && (
        <Button
          className="primaryButton"
          onClick={handleNewAddress}
          startIcon={<AddCircleOutlineIcon />}
        >
          {t('add-new-address')}
        </Button>
      )}

      {isAddressModified && (
        <Box pb={'29px'}>
          <Grid item xs={12} md={6} pl={1} pb={2.5} pr={6.5}>
            <KiboSelect
              name="address-type"
              sx={{ typography: 'body2', width: '100%' }}
              value={addressType}
              onChange={(_name, value) => setAddressType(value)}
            >
              {Object.values(AddressType).map((addressTypeValue: string) => (
                <MenuItem
                  sx={{ typography: 'body2' }}
                  key={addressTypeValue}
                  value={addressTypeValue}
                >
                  {addressTypeValue}
                </MenuItem>
              ))}
            </KiboSelect>
          </Grid>

          <AddressForm
            saveAddressLabel={''}
            setAutoFocus={true}
            isUserLoggedIn={true}
            validateForm={validateForm}
            onSaveAddress={(address) =>
              reCaptchaKey ? submitFormWithRecaptcha(address) : handleSaveAddress(address)
            }
            onFormStatusChange={handleFormStatusChange}
            contact={editAddress as ContactForm}
          />

          {shouldShowDefaultCheckbox() && (
            <FormControlLabel
              label={t('make-this-my-default-address')}
              control={
                <Checkbox
                  sx={{ marginLeft: '8px' }}
                  inputProps={{
                    'aria-label': t('make-this-my-default-address'),
                  }}
                  checked={isDefaultAddress}
                  onChange={() => setIsDefaultAddress(!isDefaultAddress)}
                />
              }
            />
          )}

          <Box>
            {!editAddress && (
              <FormControlLabel
                label={
                  addressType === AddressType.SHIPPING
                    ? t('save-as-billing-address')
                    : t('save-as-shipping-address')
                }
                control={
                  <Checkbox
                    sx={{ marginLeft: '8px' }}
                    inputProps={{
                      'aria-label':
                        addressType === AddressType.SHIPPING
                          ? t('save-as-billing-address')
                          : t('save-as-shipping-address'),
                    }}
                    checked={saveAsShippingBillingCheckbox}
                    onChange={() =>
                      setSaveAsShippingBillingCheckbox(!saveAsShippingBillingCheckbox)
                    }
                  />
                }
              />
            )}
          </Box>

          <Stack pl={1} pt={1} gap={2} sx={{ width: { xs: '100%', md: '50%', maxWidth: '420px' } }}>
            <Button variant="contained" color="secondary" onClick={handleCancelUpdateAddress}>
              {t('cancel')}
            </Button>
            <Button
              className="primaryButton"
              onClick={handleAddressValidationAndSave}
              {...(!isAddressFormValid && { disabled: true })}
            >
              {t('save')}
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default AddressBook
