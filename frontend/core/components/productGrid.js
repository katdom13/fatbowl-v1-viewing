/* eslint-disable react/prop-types */
import React from "react"

import {
  CardMedia,
  Container,
  styled,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Link as ALink,
} from "@material-ui/core"
import Link from "next/link"

import PageTitle from "./pageTitle"

const ProductGrid = ({ category, products }) => {
  return (
    <CardGrid maxWidth="lg">
      <PageTitle component="h1" variant="h5">
        {`${category} (${products.length})`}
      </PageTitle>
      {products.length <= 0 ? (
        category === "All" ? (
          <Typography variant="body1" gutterBottom>
            There are currently no active products
          </Typography>
        ) : (
          <>
            <Typography variant="body1" gutterBottom>
              There are currently no active products
            </Typography>
            <Link href="/" passHref>
              <ALink>Go to homepage</ALink>
            </Link>
          </>
        )
      ) : (
        <Grid container spacing={2}>
          {products &&
            products.map((product) => {
              let product_image = product.product_image.find(
                (product_image) => product_image.is_feature === true
              )
              return (
                <Link
                  key={product.id}
                  href={`/product/${encodeURIComponent(product.slug)}`}
                  passHref
                >
                  <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={1}>
                      <ProductImage
                        image={product_image.image}
                        alt={product_image.alt_text}
                      />
                      <CardContent>
                        <Typography gutterBottom component="p">
                          {product.title}
                        </Typography>
                        <Box component="p" fontSize={16} fontWeight={900}>
                          ₱{product.regular_price}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Link>
              )
            })}
        </Grid>
      )}
    </CardGrid>
  )
}

const CardGrid = styled(Container)((props) => ({
  paddingBottom: props.theme.spacing(8),
}))

const ProductImage = styled(CardMedia)((props) => ({
  height: props.theme.spacing(40),
}))

export default ProductGrid
