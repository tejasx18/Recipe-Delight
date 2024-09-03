import { Box, Typography } from "@mui/material";

// eslint-disable-next-line react/prop-types
const Error = ({message}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 5,
      }}
    >
      <Typography variant="h5" sx={{ p: 2 }}>
        {message}
      </Typography>
    </Box>
  );
}

export default Error;