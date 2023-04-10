import { FC, useContext } from 'react';
import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";

import { ItemCounter } from '@/components';
import { CartContext } from '@/context';
import { ICartProduct, IOrderItem } from '@/interfaces';
import { currency } from '@/utils';

type Props = {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

  const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
    product.quantity = newQuantityValue;
    updateCartQuantity(product);
  }

  const productsToShow = products ?? cart;

  return (
    <>
      {
        productsToShow.map( product => (
          <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }} alignItems='center'>
            <Grid item xs={3}>
              {/* Go to product page */}
              <Link
                href={`/product/${product.slug}`}
                component={NextLink}
                color="text.primary"
              >
                <CardActionArea>
                  <CardMedia
                    image={`/products/${product.image}`}
                    component='img'
                    sx={{ borderRadius: '5px' }}
                  />
                </CardActionArea>
              </Link>
            </Grid>
            <Grid item xs={7}>
              <Box display='flex' flexDirection='column'>
                <Typography variant='body1'>{ product.title }</Typography>
                <Typography variant='body1'>Size: <strong>{ product.size }</strong></Typography>

                {
                  editable
                    ? (
                      <ItemCounter
                        currentValue={product.quantity}
                        maxValue={product.inStock!}
                        updateQuantity={(value) => onNewCartQuantityValue(product as ICartProduct, value)}
                      />
                    )
                    : (
                      <Typography variant='h5'>
                        { `${product.quantity} ${product.quantity > 1 ? 'items' : 'item'}`}
                      </Typography>
                    )
                }
              </Box>
            </Grid>
            <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
              <Typography variant='subtitle1'>{currency.format(product.price)}</Typography>
              {
                editable && (
                  <Button
                    variant='text'
                    color='secondary'
                    onClick={() => removeCartProduct(product as ICartProduct)}
                  >
                    Remove
                  </Button>
                )
              }
              
            </Grid>
          </Grid>
        ))
      }
    </>
  )
}
