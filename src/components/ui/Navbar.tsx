
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { AppBar, Badge, Box, Button, Chip, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';

import { CartContext, UIContext } from '@/context';

export const Navbar = () => {

  const { asPath, push } = useRouter();
  const { toggleSideMenu } = useContext( UIContext );
  const { numberOfItems } = useContext(CartContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if(!searchTerm.trim().length ) return;
    push(`/search/${searchTerm}`);
  }

  return (
    <AppBar>
      <Toolbar>
        <Link
          href="/"
          component={NextLink}
          color="text.primary"
          display="flex"
          alignItems="center"
        >
          {
            process.env.NODE_ENV === 'development' && (
              <Chip sx={{ mr: 1 }} label="DEV" size="small" color="primary" variant="outlined" />
            )
          } 
          <Typography variant="h6">BroCode |</Typography>
          <Typography sx={{ ml: 0.5 }}>Shop</Typography>
        </Link>

        <Box flex="1" />

        <Box
          className="fadeIn"
          sx={{ display: isSearchVisible ? 'none' : { xs: "none", sm: "block" } }}
        >
          <Link href="/category/men" component={NextLink} sx={{ ml: 0.5 }}>
            <Button color={asPath === "/category/men" ? "primary" : "info"}>
              Men
            </Button>
          </Link>
          <Link
            href="/category/women"
            component={NextLink}
            sx={{ ml: 0.5 }}
          >
            <Button color={asPath === "/category/women" ? "primary" : "info"}>
              Women
            </Button>
          </Link>
          <Link
            href="/category/kids"
            component={NextLink}
            sx={{ ml: 0.5 }}
          >
            <Button color={asPath === "/category/kids" ? "primary" : "info"}>
              Kids
            </Button>
          </Link>
        </Box>

        <Box flex="1" />

        {/* Tablets and Desktop */}
        
        {
          isSearchVisible
            ? (
              <Input
                sx={{ display: { xs: "none", sm: "flex" } }}
                className='fadeIn'
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" ? onSearchTerm() : null}
                type="text"
                placeholder="Buscar..."
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                    className='fadeIn'
                      onClick={() => setIsSearchVisible(false)}
                    >
                      <ClearOutlined />
                    </IconButton>
                  </InputAdornment>
                }
              />
            )
            : (
              <IconButton
                sx={{ display: { xs: 'none', sm: 'flex' }}}
                onClick={() => setIsSearchVisible(true)}
              >
                <SearchOutlined />
              </IconButton>
            )
        }
        

        {/* Mobile */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' }}}
          onClick={ toggleSideMenu }
        >
          <SearchOutlined />
        </IconButton>

        
        <Link
          href="/cart"
          component={NextLink}
          color="text.primary"
          sx={{ ml: 0.5 }}
        >
          <IconButton>
            <Badge badgeContent={numberOfItems} color="secondary">
              <ShoppingCartOutlined />
            </Badge>
          </IconButton>
        </Link>

        <Button onClick={ toggleSideMenu }>Menu</Button>
      </Toolbar>
    </AppBar>
  );
}
