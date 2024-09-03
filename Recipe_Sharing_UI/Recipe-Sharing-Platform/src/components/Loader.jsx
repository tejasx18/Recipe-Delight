import { Box, CircularProgress, Typography } from "@mui/material";
const Loader = () => {
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
      <CircularProgress size={40} sx={{ color: "black" }} />
      <Typography variant="h5" sx={{ p: 2 }}>
        Loading...
      </Typography>
    </Box>
  );
};
export default Loader;
