import { Box, Typography } from "@mui/material";
import { AccountDelete_dialog } from "../../components/dialogs";

const Account_page = () => {
   return (
      <>
         <Box>
            <Typography variant="h5" component="p" gutterBottom color={'error'} >Delete account</Typography>
            <AccountDelete_dialog />
         </Box>
      </>
   );
};

export default Account_page;
