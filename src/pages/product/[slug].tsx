import { useContext, useState } from "react";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";

import { CartContext } from "@/context";
import { dbProducts } from "@/database";
import { ICartProduct, IProduct, ISize } from '@/interfaces';
import { ItemCounter, ProductSlideshow, ShopLayout, SizeSelector } from "@/components";

type Props = {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const router = useRouter();
  const { addProductToCart } = useContext(CartContext);

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
    inStock: product.inStock
  });

  const onSelectedSize = (size: ISize) => {
    setTempCartProduct( state => ({
      ...state,
      size
    }) )
  }

  const onUpdatedQuantity = (quantity: number) => {
    setTempCartProduct( state => ({
      ...state,
      quantity
    }) )
  }

  const onAddProduct = () => {
    if (!tempCartProduct.size) return;
    addProductToCart( tempCartProduct );
    router.push('/cart');
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">

            {/* Titles */}
            <Typography variant="h1" component="h1">{ product.title }</Typography>
            <Typography variant="subtitle1" component="h2">{`$${product.price}`}</Typography>

            {/* Amount */}
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Amount</Typography>
              <ItemCounter
                currentValue={ tempCartProduct.quantity }
                updateQuantity={onUpdatedQuantity}
                maxValue={product.inStock}
              />
              <SizeSelector
                sizes={product.sizes}
                selectSize={tempCartProduct.size}
                onSelectedSize={ onSelectedSize }
              />
            </Box>

            {/* Add to cart */}
            {
              (!!product.inStock)
                ? (
                  <Button
                    color="secondary"
                    className="circular-btn"
                    onClick={onAddProduct}
                  >
                    {
                      tempCartProduct.size
                        ? "Add to cart"
                        : "Select a size"
                    }
                  </Button>
                )
                : (
                  <Chip label="Out of stock" color="error" variant="outlined"/>
                )
            }

            {/* Description */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Description</Typography>
              <Typography variant="body2">{ product.description }</Typography>
            </Box>


          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// 1. GET STATIC PATHS
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const productSlugs = await dbProducts.getAllProductsSlugs();

  return {
    paths: productSlugs.map((slug) => ({
      params: slug
    })),
    fallback: 'blocking'
  }
}

// 2. GET STATIC PROPS
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = '' } = params as { slug: string };
  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 86400
  }
}

export default ProductPage
