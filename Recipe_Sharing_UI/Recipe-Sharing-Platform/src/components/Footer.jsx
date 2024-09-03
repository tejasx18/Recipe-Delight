import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: '#673ab7', color: '#fff', padding: 2, mt: 'auto',borderTop:'1px solid white' }}>
        <Typography variant="body2" align="center">
          &copy; 2024 Recipe Delight. All rights reserved.
        </Typography>
      </Box>
  );
}

export default Footer;