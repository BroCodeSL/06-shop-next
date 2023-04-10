import { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout, ProductList, FullScreenLoader } from '@/components';
import { useProducts } from '@/hooks';

const WomenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=women');

  return (
    <ShopLayout title={'Shop - Women'} pageDescription={'Find the best men products'}>
      <Typography variant='h1' component='h1'>Shop</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Women</Typography>

      {
        isLoading
          ? <FullScreenLoader />
          : <ProductList products={products}  />
      }

    </ShopLayout>
  )
}

export default WomenPage;