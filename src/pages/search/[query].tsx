import { NextPage, GetServerSideProps } from 'next';
import { Box, Typography } from '@mui/material';

import { ShopLayout, ProductList } from '@/components';
import { dbProducts } from '@/database';
import { IProduct } from '@/interfaces';

type Props = {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout title={'Shop - Search'} pageDescription={'Find the best products'}>
      <Typography variant='h1' component='h1'>Search</Typography>

      {
        foundProducts
          ? <Typography variant='h2' sx={{ mb: 1 }} textTransform="capitalize">{ query }</Typography>
          : (
            <Box display="flex">
              <Typography variant='h2' sx={{ mb: 1 }}>
                {"We didn't find any"}
              </Typography>
              <Typography variant='h2' sx={{ ml: 1 }}  color="secondary" textTransform="capitalize">
                { query }
              </Typography>
            </Box>
          )
      }

      <ProductList products={products}  />

    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const { query = '' } = params as { query: string };

  if ( !query.length ) {
    return {
        redirect: {
            destination: '/',
            permanent: true
        }
    }
  }

  let products = await dbProducts.getProductsByTerm(query);
  const foundProducts = !!products.length;

  if (!foundProducts) {
    products = await dbProducts.getAllProducts();
  }

  return {
    props: {
      products,
      foundProducts,
      query
    }
  }
}

export default SearchPage;
