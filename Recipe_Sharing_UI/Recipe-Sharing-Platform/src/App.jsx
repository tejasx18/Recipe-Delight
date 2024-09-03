import { Box} from "@mui/material";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";


const App = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f3f3f3' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <SideBar />
        <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 64px - 64px)'}}>
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default App;












































