import { Stack, Typography } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { setAppPageId } from "../../../redux/slices/pageId.slice";
import SettingsPage_layout from "../../../layouts/SettingsPage.layout";


const Profile = () => {
   const dispatch = useAppDispatch();

   useEffect(() => {
      dispatch(setAppPageId('profile_page'));
   }, []);


   return (
      <SettingsPage_layout>
         <>
            <Stack spacing={1} direction='row' alignItems="center" pb={2} >
               <Typography variant="h5" component='div' >Settings</Typography>
               <ArrowForwardIosIcon sx={{ fontSize: '12px' }} />
               <Typography variant="h5" component='div' sx={{ color: '#757575' }} >Profile</Typography>
            </Stack>
            {/* <ProductTable /> */}
         </>
      </SettingsPage_layout>
   );
};

export default Profile;
