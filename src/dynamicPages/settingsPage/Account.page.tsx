import { Box, Typography } from "@mui/material";
import AccountDeleteModal from "../../components/accountDeleteModal";


const Account_page = () => {
   return (
      <>
         <Box>
            <Typography variant="h5" component="p" gutterBottom color={'error'} >Delete account</Typography>
            <AccountDeleteModal />
         </Box>
      </>
   );
};

export default Account_page;
