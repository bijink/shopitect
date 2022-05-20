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
      <SettingsPage_layout title={'Profile'} >
         <>

         </>
      </SettingsPage_layout>
   );
};

export default Profile;
