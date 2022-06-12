import {
   Box,
   Typography,
} from "@mui/material";
import AccountDeleteDialog from "../../components/accountDeleteDialog";


const Account_page = () => {
   return (
      <>
         <Box>
            <Typography variant="h5" component="p" gutterBottom color={'error'} >Delete account</Typography>
            <AccountDeleteDialog />
         </Box>
      </>
   );
};

export default Account_page;
