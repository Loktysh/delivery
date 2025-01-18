import { Toolbar, Typography, Link, Button } from '@mui/material';
import React from 'react';

export default function Header() {
  return (
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        <Link href="/" underline="none">
          Home
        </Link>
      </Typography>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        <Link href="/dashboard" underline="none">
          Dashboard
        </Link>
      </Typography>
      
      <Button color="error" variant="outlined">
        Logout
      </Button>
    </Toolbar>
  );
}
