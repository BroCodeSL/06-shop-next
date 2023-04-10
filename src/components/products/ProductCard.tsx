import { FC, useMemo, useState } from "react";
import NextLink from 'next/link';
import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from "@mui/material";

import { IProduct } from "@/interfaces";

type Props = {
  product: IProduct;
}

export const ProductCard: FC<Props> = ({ product }) => {

  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const productImage = useMemo(() => {
    return isHovered
      ? `/products/${product.images[1]}`
      : `/products/${product.images[0]}`
  }, [isHovered, product.images])


  return (
    <Grid
      item
      xs={6}
      sm={4}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        <Link
          href={`/product/${product.slug}`}
          component={NextLink}
          color="text.primary"
          sx={{ ml:0.5 }}
          prefetch={false}
        >
          <CardActionArea>

            {
              (!product.inStock) && (
                <Chip
                  color="primary"
                  label="Not available"
                  sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }}
                />
              )
            }
            
            <CardMedia
              component='img'
              className="fadeIn"
              image={productImage}
              alt={product.title}
              onLoad={() => setIsImageLoaded(true)}
            />
          </CardActionArea>
        </Link>
      </Card>

      <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
        <Typography fontWeight={700}>{ product.title }</Typography>
        <Typography fontWeight={500}>{`$${product.price}`}</Typography>
      </Box>
    </Grid>
  )
}
