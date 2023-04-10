import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";
import Cookies from 'js-cookie';

import { CartContext } from '@/context';
import { ShopLayout, CartList, OrderSummary } from "@/components";


const SummaryPage = () => {

  const router = useRouter();
  const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);

  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if ( !Cookies.get('shippingAddress') ) {
      router.push('/checkout/address');
    }
  }, [ router ]);

  const onCreateOrder = async () => {
    setIsPosting(true);
    const { hasError, message } = await createOrder();

    if ( hasError ) {
      setIsPosting(false);
      setErrorMessage(message);
      return;
    }

    router.replace(`/orders/${message}`);
  }
  

  if ( !shippingAddress ) {
    return (<></>);
  };

  const { firstName, lastName, address, address2 = '', city, country, phone, zip } = shippingAddress;

  return (
    <ShopLayout title="Purchase summary" pageDescription="purchase summary">
      <Typography variant="h1" component="h1">Purchase</Typography>
      <Grid container spacing={2} sx={{ pt: 2 }}>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Summary ({numberOfItems} {numberOfItems === 1 ? 'product' : 'products'})</Typography>
              <Divider sx={{ my: 1.5 }} />

              <Box display="flex" justifyContent="space-between" alignItems="baseline">
                <Typography variant="subtitle1">Shipping Address</Typography>
                <Link
                  href="/checkout/address"
                  component={NextLink}
                  color="text.primary"
                  underline="always"
                >
                  Editar
                </Link>
              </Box>

              
              <Typography>{firstName} {lastName}</Typography>
              <Typography>{ address }{ address2 ? `, ${address2}` : '' }</Typography>
              <Typography>{ city }, { zip }</Typography>
              <Typography>{ country }</Typography>
              <Typography>{ phone }</Typography>

              <Divider sx={{ my: 1.5 }} />

              <Box display="flex" justifyContent="end">
                <Link
                  href="/cart"
                  component={NextLink}
                  color="text.primary"
                  underline="always"
                >
                  Editar
                </Link>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  onClick={onCreateOrder}
                  disabled={isPosting}
                >
                  Confirm order
                </Button>

                <Chip
                  color='error'
                  label={ errorMessage }
                  sx={{ mt: 1, display: errorMessage ? 'flex' : 'none' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage;