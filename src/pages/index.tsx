import { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout, ProductList, FullScreenLoader } from '@/components';
import { useProducts } from '@/hooks';

const HomePage: NextPage = () => {

  const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout title={'Shop - Home'} pageDescription={'Find the best products'}>
      <Typography variant='h1' component='h1'>Shop</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>All the products</Typography>

      {
        isLoading
          ? <FullScreenLoader />
          : <ProductList products={products}  />
      }

    </ShopLayout>
  )
}

export default HomePage;