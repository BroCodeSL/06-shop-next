import { NextPage } from 'next';
import NextLink from 'next/link';
import { Box, Link, Typography } from '@mui/material';
import { RemoveShoppingCartOutlined } from '@mui/icons-material';

import { ShopLayout } from '@/components';

const EmptyPage: NextPage = () => {
  return (
    <ShopLayout title="Empty cart" pageDescription="No items in the cart">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography>Your cart is empty</Typography>
          <Link
            href="/"
            component={NextLink}
            typography="h4"
            color="secondary"
          >
            Return
          </Link>
        </Box>
      </Box>
    </ShopLayout>
  )
}

export default EmptyPage;