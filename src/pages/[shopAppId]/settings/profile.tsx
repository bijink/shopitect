import type { NextPage } from "next";

import { Box, Stack, TextareaAutosize, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setAppPageId } from "../../../redux/slices/pageId.slice";
import SettingsPage_layout from "../../../layouts/SettingsPage.layout";
import { selectShopDetails, setAppShopDetailsAsync } from "../../../redux/slices/shopDetails.slice";
import { doc, updateDoc } from "firebase/firestore";
import { database } from "../../../config/firebase.config";
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import useSecurePage from "../../../hooks/useSecurePage";
import PageLoading_layout from "../../../layouts/PageLoading.layout";
import { signIn as signInProvider } from "next-auth/react";
import Forbidden from "../../403";
import NotFound from "../../404";


const Profile: NextPage = () => {
   const router = useRouter();
   const { shopAppId } = router.query;

   const dispatch = useAppDispatch();

   const shop = useAppSelector(selectShopDetails);
   // console.log(shop);

   const secure = useSecurePage(shopAppId);
   // console.log(secure);


   const [shopName, setShopName] = useState('');
   const [shopCategory, setShopCategory] = useState('');
   const [shopOwnerName, setShopOwnerName] = useState('');
   const [shopAddress, setShopAddress] = useState('');

   const [loading, setLoading] = useState(false);


   const handleSubmit = async (e: any) => {
      e.preventDefault();
      setLoading(true);

      await updateDoc(doc(database, "shops", shop?.data?.urlName), {
         name: shopName,
         category: shopCategory,
         ownerName: shopOwnerName,
         address: shopAddress,
      }).then(() => {
         setLoading(false);
         router.reload();
      });
   };

   useEffect(() => {
      setShopName(shop?.data?.name);
      setShopOwnerName(shop?.data?.ownerName);
      setShopCategory(shop?.data?.category);
      setShopAddress(shop?.data?.address);
   }, [shop]);

   useEffect(() => {
      dispatch(setAppPageId('profile_page'));
   }, []);


   return (
      <>
         {((secure === 'loading') && (
            <PageLoading_layout />
         )) || ((secure === '200') && (
            <SettingsPage_layout title={'Profile'} >
               <>
                  <form onSubmit={handleSubmit} >
                     <Stack direction="column" spacing={2} >
                        <Box>
                           <Typography variant="body1" sx={{ fontWeight: '500' }} gutterBottom >Shop Name</Typography>
                           <TextField
                              size="small"
                              id="outlined-required"
                              fullWidth
                              required
                              value={shopName}
                              onInput={(e: ChangeEvent<HTMLInputElement>) => setShopName(e.target.value)}
                           />
                        </Box>
                        {/* <Box>
                       <Typography variant="body1" sx={{ fontWeight: '500' }} gutterBottom >Shop Url Name</Typography>
                       <TextField
                          size="small"
                          id="outlined-required"
                          fullWidth
                          required
                          value={shopUrlName}
                          onInput={(e: ChangeEvent<HTMLInputElement>) => setShopUrlName(e.target.value)}
                       />
                    </Box> */}
                        <Box>
                           <Typography variant="body1" sx={{ fontWeight: '500' }} gutterBottom >Owner Name</Typography>
                           <TextField
                              size="small"
                              id="outlined-required"
                              fullWidth
                              required
                              value={shopOwnerName}
                              onInput={(e: ChangeEvent<HTMLInputElement>) => setShopOwnerName(e.target.value)}
                           />
                        </Box>
                        <Box>
                           <Typography variant="body1" sx={{ fontWeight: '500' }} gutterBottom >Category</Typography>
                           <TextField
                              size="small"
                              id="outlined-required"
                              fullWidth
                              required
                              value={shopCategory}
                              onInput={(e: ChangeEvent<HTMLInputElement>) => setShopCategory(e.target.value)}
                           />
                        </Box>
                        <Box width={'100%'} >
                           <Typography variant="body1" sx={{ fontWeight: '500' }} gutterBottom >Address</Typography>
                           <TextareaAutosize
                              aria-label="shop address"
                              placeholder="Shop Address*"
                              minRows={5}
                              maxRows={5}
                              style={{
                                 minWidth: '50%',
                                 maxWidth: '50%',
                                 // minWidth: '80%',
                                 // maxWidth: '80%',
                                 fontSize: '15px',
                                 padding: '12px',
                                 borderRadius: '4px',
                                 borderColor: 'lightgray',
                                 outlineColor: '#1976d2',
                              }}
                              value={shopAddress}
                              onInput={(e: ChangeEvent<HTMLTextAreaElement>) => setShopAddress(e.target.value)}
                              required
                           />
                        </Box>
                        <Box>
                           <LoadingButton
                              variant="contained"
                              type="submit"
                              color={'success'}
                              size="small"
                              sx={{ textTransform: 'none' }}
                              loading={loading}
                              loadingPosition="start"
                              startIcon={<PublishRoundedIcon />}
                           >Update Profile</LoadingButton>
                        </Box>
                     </Stack>
                  </form>
               </>
            </SettingsPage_layout>
         )) || ((secure === '401') && (
            // signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` })
            <Forbidden />
         )) || ((secure === '403') && (
            <Forbidden />
         )) || ((secure === '404') && (
            <NotFound />
         ))}
      </>
   );
};

export default Profile;
