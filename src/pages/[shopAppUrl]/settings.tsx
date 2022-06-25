// *settings page
import type { NextPage } from "next";

import { Box, capitalize, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { Account_page, Profile_page } from "../../dynamicPages/settingsPage";
import ShopPagesHead from "../../components/shopPagesHead";
import { useShop } from "../../hooks";
import { PageSkeleton_layout, Page_layout } from "../../layouts";
import Forbidden from "../403";
import NotFound from "../404";
import { useEffect, useState } from "react";
import { signIn as signInProvider } from "next-auth/react";
import { useAppDispatch } from "../../redux/hooks";
import { setAppPageId } from "../../redux/slices/pageId.slice";
import { ShopAdmin_navBar } from "../../components/navBar";
import { ShopAdmin_sideBar } from "../../components/sideBar";
import { ShopAdmin_btmNavbar } from "../../components/bottomNavBar";


interface TabPanelProps {
   children?: React.ReactNode;
   index: number;
   value: number;
}


function TabPanel(props: TabPanelProps) {
   const { children, value, index, ...other } = props;

   return (
      <div
         role="tabpanel"
         hidden={value !== index}
         id={`simple-tabpanel-${index}`}
         aria-labelledby={`simple-tab-${index}`}
         {...other}
      >
         {value === index && (
            <Box sx={{ pt: 2 }}>
               {children}
            </Box>
         )}
      </div>
   );
}

function a11yProps(index: number) {
   return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
   };
}


const SettingsPages: NextPage = () => {
   const router = useRouter();
   const { shopAppUrl, settingsPages } = router.query;

   const dispatch = useAppDispatch();

   const { secure } = useShop(shopAppUrl);

   const [value, setValue] = useState(0);


   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
   };


   useEffect(() => {
      if (secure === 401) {
         if (settingsPages === 'account') router.push(`/${shopAppUrl}`);
         else signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` });
      }
   }, [secure, shopAppUrl, settingsPages, router]);

   useEffect(() => {
      dispatch(setAppPageId('settings_page'));
   }, [dispatch]);


   return (
      <>
         <ShopPagesHead title="Settings" />

         {((secure === 'loading') && (
            <PageSkeleton_layout />
         )) || ((secure === 404) && (
            <NotFound />
         )) || ((secure === 200) && (
            <Page_layout navbar={<ShopAdmin_navBar />} sidebar={<ShopAdmin_sideBar />} btmNavbar={<ShopAdmin_btmNavbar />} title={settingsPages && capitalize(settingsPages.toString())} >
               <Stack direction='row' pb={2} >
                  <Typography variant="h5" component='p' >Settings</Typography>
               </Stack>

               <Box sx={{ width: '100%', marginTop: '-10px' }} >
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                     <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
                        <Tab label="Profile" {...a11yProps(0)} />
                        <Tab label="Account" {...a11yProps(1)} />
                     </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                     <Profile_page />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                     <Account_page />
                  </TabPanel>
               </Box>
            </Page_layout>
         )) || ((secure === 403) && (
            <Forbidden />
         ))}
      </>
   );
};

export default SettingsPages;
