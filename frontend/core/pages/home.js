import React from 'react'
import { AppBar, Toolbar, Typography, InputBase } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

const Home = () => {
  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          {/* Brand */}
          <Typography className={classes.title} variant='h6' noWrap>
            Fatbowl
          </Typography>

          {/* Search bar */}
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SeachIcon />
            </div>
            <InputBase
              placeholder='Search...'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Home