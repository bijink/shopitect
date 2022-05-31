import { Box, Typography } from "@mui/material";
import AccountDeleteModal from "../../accountDeleteModal";


const Account_tab = () => {
   return (
      <>
         <Box>
            <Typography variant="h5" component="p" gutterBottom color={'error'} >Delete account</Typography>
            <AccountDeleteModal />
         </Box>
      </>
   );
};

export default Account_tab;
