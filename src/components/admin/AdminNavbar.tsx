
import { useContext } from 'react';
import NextLink from 'next/link';
import { AppBar, Box, Button, Link, Toolbar, Typography } from '@mui/material';

import { UIContext } from '@/context';

export const AdminNavbar = () => {

  const { toggleSideMenu } = useContext( UIContext );

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
          <Typography variant="h6">BroCode |</Typography>
          <Typography sx={{ ml: 0.5 }}>Shop</Typography>
        </Link>

        <Box flex="1" />

        <Button onClick={ toggleSideMenu }>Menu</Button>
      </Toolbar>
    </AppBar>
  );
}
