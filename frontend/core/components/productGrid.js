import {
  CardMedia,
  Container,
  styled,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from "@material-ui/core"
import Link from 'next/link'

const ProductGrid = ({category, products}) => {
  return (
    <CardGrid>
      <Box component='h5' fontSize={22}>
        {`${category} (${products.length})`}
      </Box>
      <Grid container spacing={2}>
        {
          products && products.map(product => (
            <Link key={product.id} href={`/product/${encodeURIComponent(product.slug)}`}>
                <Grid item xs={6} sm={4} md={3}>
                  <Card elevation={1}>
                    <ProductImage
                      image={product.product_image[0].image}
                      alt={product.product_image[0].alt_text}
                    />
                    <CardContent>
                      <Typography gutterBottom component="p">
                        { product.title }
                      </Typography>
                      <Box component="p" fontSize={16} fontWeight={900}>
                        ₱{ product.regular_price }
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
            </Link>
          ))
        }
      </Grid>
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