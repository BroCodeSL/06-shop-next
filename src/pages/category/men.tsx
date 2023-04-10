import { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout, ProductList, FullScreenLoader } from '@/components';
import { useProducts } from '@/hooks';

const MenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=men');

  return (
    <ShopLayout title={'Shop - Men'} pageDescription={'Find the best men products'}>
      <Typography variant='h1' component='h1'>Shop</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Men</Typography>

      {
        isLoading
          ? <FullScreenLoader />
          : <ProductList products={products}  />
      }

    </ShopLayout>
  )
}

export default MenPage;