import { Box, Stack, TextareaAutosize, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setAppPageId } from "../../../redux/slices/pageId.slice";
import SettingsPage_layout from "../../../layouts/SettingsPage.layout";
import { selectShopDetails } from "../../../redux/slices/shopDetails.slice";
import { doc, updateDoc } from "firebase/firestore";
import { database } from "../../../config/firebase.config";
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import { LoadingButton } from "@mui/lab";


const Profile = () => {
   const dispatch = useAppDispatch();

   const shopDetails = useAppSelector(selectShopDetails);
   // console.log(shopDetails);

   const [shopName, setShopName] = useState('');
   const [shopCategory, setShopCategory] = useState('');
   const [shopOwnerName, setShopOwnerName] = useState('');
   const [shopAddress, setShopAddress] = useState('');

   const [loading, setLoading] = useState(false);


   const handleSubmit = async (e: any) => {
      e.preventDefault();
      setLoading(true);

      await updateDoc(doc(database, "shops", shopDetails?.urlName), {
         name: shopName,
         // urlName: shopUrlName,
         category: shopCategory,
         ownerName: shopOwnerName,
         address: shopAddress,
      }).then(() => {
         setLoading(false);
      });
   };

   useEffect(() => {
      setShopName(shopDetails?.name);
      setShopOwnerName(shopDetails?.ownerName);
      setShopCategory(shopDetails?.category);
      setShopAddress(shopDetails?.address);
   }, [shopDetails]);

   useEffect(() => {
      dispatch(setAppPageId('profile_page'));
   }, []);


   return (
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
   );
};

export default Profile;
