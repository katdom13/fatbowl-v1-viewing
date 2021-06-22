import {
  AppBar,
  Toolbar,
  Box,
  Collapse,
  Divider,
  fade,
  Hidden,
  IconButton,
  InputBase,
  ListItem,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  styled,
  Typography,
  withStyles,
  List,
  Menu,
  lighten,
  Button,
  Badge,
} from "@material-ui/core"
import { useRef, useState } from "react"
import SearchIcon from '@material-ui/icons/Search'
import MenuIcon from '@material-ui/icons/Menu'
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined'
import Link from 'next/link'

const Header = props => {
  const classes = useStyles()

  const [categoryAnchor, setCategoryAnchor] = useState(null)
  const [isOpenMenu, setIsOpenMenu] = useState(false)

  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const categoryRef = useRef(null)

  const handleCloseCategory = () => {
    setCategoryAnchor(null)
  }

  return (
    <HeaderContainer>
      <AppBar position='static' elevation={0}>
        <Toolbar>
          <BrandWrapper component='div'>
            <Brand variant='h6' noWrap>
              <Link href='/'>
                <a className={classes.link}>
                  Fatbowl
                </a>
              </Link>
            </Brand>

            <Hidden smDown>
              <List className={classes.menuList}>
                <MenuListItem onClick={ event => setCategoryAnchor(event.currentTarget)}>
                  Categories
                </MenuListItem>

                <StyledMenu
                  anchorEl={categoryAnchor}
                  keepMounted
                  open={Boolean(categoryAnchor)}
                  onClose={handleCloseCategory}
                >
                  {
                    props.categories && props.categories.map(category => (
                      <StyledMenuItem link key={category.slug} href={`/category/${encodeURIComponent(category.slug)}`} onClick={handleCloseCategory}>
                        {category.name}
                      </StyledMenuItem>
                    ))
                  }
                </StyledMenu>
              </List>
            </Hidden>
          </BrandWrapper>

          <Hidden smDown>
            {/* Add to cart button */}
            <Link href='/' passHref>
              <Button variant="outlined" color='inherit' className={classes.cartButton}>
                  <a className={classes.link}>
                    <Badge badgeContent={props.totalItemQty} color="secondary" className={classes.cartBadge}>
                      <ShoppingCartOutlinedIcon />
                    </Badge>
                    Cart
                  </a>
              </Button>
            </Link>

            <Searchbar />
          </Hidden>

          <Hidden mdUp>
            <MenuIconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              disableRipple
              onClick={() => setIsOpenMenu(!isOpenMenu)}
            >
              <MenuIcon />
            </MenuIconButton>
          </Hidden>
        </Toolbar>
      </AppBar>

      <Collapse in={isOpenMenu} timeout='auto' unmountOnExit>
        <Hidden mdUp>
          <AppBar position='static' elevation={0} display='flex'>
            <List className={classes.menuList}>
              <MenuListItem link href='/'>
                Home
              </MenuListItem>
              <StyledDivider variant='middle' />

              <MenuListItem link href='/'>
                Link
              </MenuListItem>
              <StyledDivider variant='middle' />

              <MenuListItem
                onClick={ () => setIsCategoryOpen(!isCategoryOpen) }
                ref={categoryRef}
              >
                  Dropdown
              </MenuListItem>
              <StyledDivider variant='middle' />

              <Collapse in={isCategoryOpen} timeout='auto' unmountOnExit>
                <CategoryMenuPaper>
                  <MenuList
                    autoFocusItem={isCategoryOpen}
                    id='menu-list-grow'
                    className={classes.menuList}
                  >
                    {
                      props.categories && props.categories.map(category => (
                        <StyledMenuItem
                          link
                          href={`/category/${encodeURIComponent(category.slug)}`} key={category.slug}
                          onClick={() => {
                              setIsCategoryOpen(!isCategoryOpen)
                              setIsOpenMenu(!isOpenMenu)
                            }
                          }
                        >
                          {category.name}
                        </StyledMenuItem>
                      ))
                    }
                  </MenuList>
                </CategoryMenuPaper>
              </Collapse>

              <MenuListItem link href='/'>
                <Badge badgeContent={props.totalItemQty} color="secondary" className={classes.cartBadge}>
                  <ShoppingCartOutlinedIcon />
                </Badge>
                Cart
              </MenuListItem>

              <MenuListItem>
                <Searchbar />
              </MenuListItem>

            </List>
          </AppBar>
        </Hidden>
      </Collapse>
    </HeaderContainer>
  )
}

const HeaderContainer = styled(Box)((props) => ({
  flexGrow: 1,
  [props.theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}))

const BrandWrapper = styled(Box)((props) => ({
  flexGrow: 1,
  [props.theme.breakpoints.up('md')]: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    height: '100%',
  },
}))

const Brand = styled(Typography)({
  alignSelf: 'center'
})

const MenuListItem = props => {
  const classes = useStyles()

  return (
    <ListItem className={classes.menuListItem} {...props}>
      {
        props.link ? (
          <Link href={props.href}>
            <a className={classes.link}>{props.children}</a>
          </Link>
        ) : props.children
      }
    </ListItem>
  )
}

const StyledMenu = withStyles((theme) => ({
  paper: {
    margin: theme.spacing(1, 4, 2, 4),
    alignSelf: 'center',
    [theme.breakpoints.up('md')]: {
      width: 'auto',
      borderRadius: 0,
      margin: 0,
    },
  },
  list: {
    padding: 0,
  },
}))((props) => (
  <Menu
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
))

const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 2, 1, 2),
    '&:hover': {
      backgroundColor: theme.palette.grey[400],
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(1.5, 4, 1.5, 4),
    },
  },
}))((props) => {
  const classes = useStyles()
  return (
    <MenuItem {...props}>
      {
        props.link ? (
          <Link href={props.href}>
            <a className={classes.link}>{props.children}</a>
          </Link>
        ) : props.children
      }
    </MenuItem>
  )
})


const Searchbar = props => {
  const classes = useStyles()

  return (
    <Box component='div' className={classes.search}>
      <Box component='div' className={classes.searchIcon}>
        <SearchIcon />
      </Box>
      <InputBase
        placeholder='Search...'
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
      />
    </Box>
  )
}

const MenuIconButton = withStyles((theme) => ({
  root: {
    border: `${theme.spacing(0.3)}px solid transparent`,
    padding: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      background: 'none',
    },
    '&:focus': {
      border: `${theme.spacing(0.3)}px solid white`,
    }
  }
}))((props) => (
  <IconButton {...props} />
))

const StyledDivider = withStyles((theme) => ({
  background: lighten(theme.palette.common.black, 0.70)
}))((props) => (<Divider {...props} />))

const CategoryMenuPaper = styled(Paper)((props) => ({
  margin: props.theme.spacing(1, 4, 2, 4),
  alignSelf: 'center',
  [props.theme.breakpoints.up('md')]: {
    width: 'auto',
    borderRadius: 0,
    margin: 0,
  },
}))

const useStyles = makeStyles((theme) => ({
  cartBadge: {
    marginRight: theme.spacing(2),
  },
  cartButton: {
    padding: theme.spacing(1.5, 2, 1.5, 2),
    marginRight: theme.spacing(1.5),
    fontWeight: 900,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),

    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,

    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('md')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'none',
      '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
      '-webkit-tap-highlight-color': 'transparent',
    },
    '&:focus': {
      backgroundColor: 'none',
      '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
      '-webkit-tap-highlight-color': 'transparent',
    }
  },
  menuList: {
    padding: 0,
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'row',
      marginLeft: theme.spacing(2),
    },
  },
  menuListItem: {
    padding: theme.spacing(2, 3, 2, 3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2, 2, 2, 2)
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      cursor: 'pointer',
      '&::after': {
        backgroundColor: theme.palette.common.white,
        content: '""',
        width: 0,
        height: '5px',
        left: 0,
        bottom: 0,
        // transition: 'width 0.35s ease 0s',
        position: 'absolute',
      },
      '&:hover::after': {
        width: '100%',
      },
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    width: '100%',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}))

export default Header