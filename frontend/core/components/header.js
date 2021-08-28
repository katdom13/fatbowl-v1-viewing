/* eslint-disable react/prop-types */
import React from "react"
import { useContext, useState } from "react"

import {
  alpha,
  AppBar,
  Toolbar,
  Box,
  Collapse,
  Divider,
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
  Avatar,
} from "@material-ui/core"
import MeetingRoomOutlinedIcon from "@material-ui/icons/MeetingRoomOutlined"
import MenuIcon from "@material-ui/icons/Menu"
import PermIdentityOutlinedIcon from "@material-ui/icons/PermIdentityOutlined"
import SearchIcon from "@material-ui/icons/Search"
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined"
import Link from "next/link"
import Router from "next/router"

import { logoutUser } from "../config/axios"
import AppContext from "../contexts/AppContext"

const Header = ({ categories }) => {
  const classes = useStyles()

  const [categoryAnchor, setCategoryAnchor] = useState(null)
  const [accountAnchor, setAccountAnchor] = useState(null)
  const [isOpenMenu, setIsOpenMenu] = useState(false)

  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  const {
    context: { logout },
    state,
  } = useContext(AppContext)

  const handleCloseAll = () => {
    setIsCategoryOpen(false)
    setIsAccountOpen(false)
    setIsOpenMenu(false)
  }

  const handleUser = () => {
    if (state.loggedIn) {
      logoutUser()
        .then(() => {
          logout()
          Router.push("/login", undefined, { shallow: true })
        })
        .catch((err) => console.error("[LOGOUT ERROR]", err.response))
    } else {
      Router.push("/login", undefined, { shallow: true })
    }
  }

  return (
    <Box component="header" paddingBottom={2}>
      <HeaderContainer maxWidth="lg">
        <AppBar position="static" elevation={1} color="default">
          <Toolbar>
            <BrandWrapper component="div">
              <Link href="/">
                <a className={classes.link}>
                  <Box display="flex" alignItems="center">
                    <Avatar src="/logo.png" className={classes.logo} />
                    <Typography variant="h6" noWrap className={classes.brand}>
                      Fatbowl
                    </Typography>
                  </Box>
                </a>
              </Link>

              <Hidden smDown>
                <List className={classes.menuList}>
                  <MenuListItem
                    onClick={(event) => setCategoryAnchor(event.currentTarget)}
                  >
                    Shop
                  </MenuListItem>

                  <StyledMenu
                    anchorEl={categoryAnchor}
                    keepMounted
                    open={Boolean(categoryAnchor)}
                    onClose={() => setCategoryAnchor(null)}
                  >
                    {categories &&
                      categories.map((category) => (
                        <StyledMenuItem
                          link="true"
                          key={category.slug}
                          href={`/category/${encodeURIComponent(category.slug)}`}
                          onClick={() => setCategoryAnchor(null)}
                        >
                          {category.name}
                        </StyledMenuItem>
                      ))}
                  </StyledMenu>
                </List>
              </Hidden>
            </BrandWrapper>

            <Hidden smDown>
              <List className={classes.menuList}>
                {!state.loggedIn ? (
                  <Button
                    variant="outlined"
                    color="inherit"
                    className={classes.button}
                    disableRipple
                    onClick={handleUser}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <MeetingRoomOutlinedIcon fontSize="medium" />
                      Login
                    </Box>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      color="inherit"
                      className={classes.button}
                      disableRipple
                      onClick={(event) => setAccountAnchor(event.currentTarget)}
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <PermIdentityOutlinedIcon fontSize="medium" />
                        Account
                      </Box>
                    </Button>

                    <StyledMenu
                      anchorEl={accountAnchor}
                      keepMounted
                      open={Boolean(accountAnchor)}
                      onClose={() => setAccountAnchor(null)}
                    >
                      <StyledMenuItem
                        link="true"
                        href="/dashboard"
                        onClick={() => setAccountAnchor(null)}
                      >
                        My Account
                      </StyledMenuItem>
                      <StyledMenuItem
                        link="true"
                        href="/account/orders"
                        onClick={() => {
                          setAccountAnchor(null)
                        }}
                      >
                        Orders
                      </StyledMenuItem>
                      <StyledMenuItem
                        onClick={() => {
                          handleUser()
                          setAccountAnchor(null)
                        }}
                      >
                        Logout
                      </StyledMenuItem>
                    </StyledMenu>
                  </>
                )}
                <Link href="/cart/">
                  <a className={classes.link}>
                    <Button
                      variant="outlined"
                      color="inherit"
                      className={classes.button}
                      disableRipple
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Badge
                          badgeContent={state.totalItemQty}
                          color="secondary"
                          className={classes.cartBadge}
                        >
                          <ShoppingCartOutlinedIcon fontSize="medium" />
                        </Badge>
                        Cart
                      </Box>
                    </Button>
                  </a>
                </Link>
              </List>
              <Searchbar />
            </Hidden>

            <Hidden mdUp>
              <MenuIconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                disableRipple
                onClick={() => setIsOpenMenu(!isOpenMenu)}
              >
                <MenuIcon />
              </MenuIconButton>
            </Hidden>
          </Toolbar>
        </AppBar>

        <Collapse in={isOpenMenu} timeout="auto" unmountOnExit>
          <Hidden mdUp>
            <AppBar position="static" elevation={1} display="flex" color="default">
              <List className={classes.menuList}>
                <StyledDivider variant="middle" />

                <MenuListItem onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
                  Shop
                </MenuListItem>
                <StyledDivider variant="middle" />

                <Collapse in={isCategoryOpen} timeout="auto" unmountOnExit>
                  <CategoryMenuPaper>
                    <MenuList className={classes.menuList}>
                      {categories &&
                        categories.map((category) => (
                          <StyledMenuItem
                            link
                            href={`/category/${encodeURIComponent(category.slug)}`}
                            key={category.slug}
                            onClick={handleCloseAll}
                          >
                            {category.name}
                          </StyledMenuItem>
                        ))}
                    </MenuList>
                  </CategoryMenuPaper>
                </Collapse>
                <StyledDivider variant="middle" />

                {!state.loggedIn ? (
                  <MenuListItem
                    onClick={() => {
                      setIsOpenMenu(!isOpenMenu)
                      handleUser()
                    }}
                  >
                    <MeetingRoomOutlinedIcon />
                    <Box marginLeft={2}>Login</Box>
                  </MenuListItem>
                ) : (
                  <>
                    <MenuListItem
                      onClick={() => {
                        setIsAccountOpen(!isAccountOpen)
                      }}
                    >
                      <PermIdentityOutlinedIcon />
                      <Box marginLeft={2}>Account</Box>
                    </MenuListItem>
                    <StyledDivider variant="middle" />

                    <Collapse in={isAccountOpen} timeout="auto" unmountOnExit>
                      <CategoryMenuPaper>
                        <MenuList className={classes.menuList}>
                          <StyledMenuItem
                            link
                            href="/dashboard"
                            onClick={handleCloseAll}
                          >
                            My account
                          </StyledMenuItem>
                          <StyledMenuItem
                            link
                            href="/account/orders"
                            onClick={handleCloseAll}
                          >
                            Orders
                          </StyledMenuItem>
                          <StyledMenuItem
                            onClick={() => {
                              handleCloseAll()
                              handleUser()
                            }}
                          >
                            Logout
                          </StyledMenuItem>
                        </MenuList>
                      </CategoryMenuPaper>
                    </Collapse>
                  </>
                )}

                <StyledDivider variant="middle" />

                <MenuListItem
                  link="true"
                  href="/cart/"
                  onClick={() => {
                    setIsCategoryOpen(false)
                    setIsOpenMenu(!isOpenMenu)
                  }}
                >
                  <Badge
                    badgeContent={state.totalItemQty}
                    color="secondary"
                    className={classes.cartBadge}
                  >
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
    </Box>
  )
}

const HeaderContainer = styled(Box)((props) => ({
  flexGrow: 1,
  [props.theme.breakpoints.up("md")]: {
    display: "flex",
  },
}))

const BrandWrapper = styled(Box)(() => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  height: "100%",
}))

const MenuListItem = (props) => {
  const classes = useStyles()

  return props.link ? (
    <Link href={props.href}>
      <a className={classes.link}>
        <ListItem className={classes.menuListItem} {...props}>
          {props.children}
        </ListItem>
      </a>
    </Link>
  ) : (
    <ListItem className={classes.menuListItem} {...props}>
      {props.children}
    </ListItem>
  )
}

const StyledMenu = withStyles((theme) => ({
  paper: {
    margin: theme.spacing(1, 4, 2, 4),
    alignSelf: "center",
    [theme.breakpoints.up("md")]: {
      width: "auto",
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
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))

const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 2, 1, 2),
    width: "100%",
    "&:hover": {
      backgroundColor: theme.palette.grey[400],
    },
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(1.5, 4, 1.5, 4),
    },
  },
}))((props) => {
  const classes = useStyles()
  return props.link ? (
    <Link href={props.href}>
      <a className={classes.link}>
        <MenuItem {...props}>{props.children}</MenuItem>
      </a>
    </Link>
  ) : (
    <MenuItem {...props}>{props.children}</MenuItem>
  )
})

const Searchbar = () => {
  const classes = useStyles()

  return (
    <Box component="div" className={classes.search}>
      <Box component="div" className={classes.searchIcon}>
        <SearchIcon />
      </Box>
      <InputBase
        placeholder="Search..."
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
      />
    </Box>
  )
}

const MenuIconButton = withStyles((theme) => ({
  root: {
    border: `${theme.spacing(0.3)}px solid transparent`,
    padding: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      background: "none",
    },
    "&:focus": {
      border: `${theme.spacing(0.3)}px solid white`,
    },
  },
}))((props) => <IconButton {...props} />)

const StyledDivider = withStyles((theme) => ({
  root: {
    background: lighten(theme.palette.common.black, 0.9),
  },
}))((props) => <Divider {...props} />)

const CategoryMenuPaper = styled(Paper)((props) => ({
  margin: props.theme.spacing(1, 4, 2, 4),
  alignSelf: "center",
  [props.theme.breakpoints.up("md")]: {
    width: "auto",
    borderRadius: 0,
    margin: 0,
  },
}))

const useStyles = makeStyles((theme) => ({
  brand: {
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  button: {
    border: "none",
    textTransform: "none",
    background: "none",
    "&:hover": {
      background: "none",
      color: theme.palette.secondary.main,
      transition: "color 0.2s",
    },
    "&:focus": {
      background: "none",
      color: theme.palette.secondary.main,
      transition: "color 0.2s",
    },
    "&:active": {
      background: "none",
      color: theme.palette.secondary.main,
      transition: "color 0.2s",
    },
  },
  cartBadge: {
    [theme.breakpoints.down("sm")]: {
      marginRight: theme.spacing(2),
    },
  },
  cartButton: {
    padding: theme.spacing(1.5, 2, 1.5, 2),
    marginRight: theme.spacing(1.5),
    fontWeight: 900,
  },
  inputInput: {
    border: "1px solid black",
    background: alpha(theme.palette.common.black, 0.08),
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 1, 1, 0),

    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,

    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("md")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  link: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      alignItems: "center",
    },
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "none",
      "-webkit-tap-highlight-color": "transparent",
    },
    "&:focus": {
      backgroundColor: "none",
      "-webkit-tap-highlight-color": "transparent",
    },
  },
  logo: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    padding: theme.spacing(1),
  },
  menuList: {
    padding: 0,
    [theme.breakpoints.up("md")]: {
      display: "flex",
      flexDirection: "row",
    },
  },
  menuListItem: {
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2, 2, 2, 2),
    },
    [theme.breakpoints.up("md")]: {
      cursor: "pointer",
      "&::after": {
        backgroundColor: theme.palette.common.white,
        content: "''",
        width: 0,
        height: "5px",
        left: 0,
        bottom: 0,
        position: "absolute",
      },
      "&:hover::after": {
        width: "100%",
      },
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: "100%",
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}))

export default Header
