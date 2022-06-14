import { Box, Stack, TextareaAutosize, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setAppPageId } from "../../redux/slices/pageId.slice";
import { selectShopDetails, setAppShopDetailsAsync } from "../../redux/slices/shopDetails.slice";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { database } from "../../config/firebase.config";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import UpdateIcon from '@mui/icons-material/Update';


const Profile_page = () => {
   const router = useRouter();
   const { shopAppUrl } = router.query;

   const dispatch = useAppDispatch();

   const shop = useAppSelector(selectShopDetails);
   // console.log(shop);

   const [shopName, setShopName] = useState('');
   const [shopCategory, setShopCategory] = useState('');
   const [shopOwnerName, setShopOwnerName] = useState('');
   const [shopAddress, setShopAddress] = useState('');

   const [loading, setLoading] = useState(false);


   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      await updateDoc(doc(database, "shops", shop?.data?.urlName), {
         name: shopName,
         category: shopCategory,
         ownerName: shopOwnerName,
         address: shopAddress,
      }).then(() => {
         setLoading(false);
         // router.reload();
      });
   };


   useEffect(() => {
      shopAppUrl && onSnapshot(query(collection(database, 'shops'), where('urlName', '==', shopAppUrl)), (snapshot) => {
         let docsLength = null;
         let doc = null;

         if (snapshot.docs.length === 0) docsLength = 0;
         else if (snapshot.docs.length === 1) docsLength = 1;

         snapshot.forEach(obj => {
            setShopName(obj.data().name);
            setShopOwnerName(obj.data().ownerName);
            setShopCategory(obj.data().category);
            setShopAddress(obj.data().address);

            doc = obj.data();
         });

         const shopDetails = {
            data: doc,
            length: docsLength,
         };

         sessionStorage.setItem('shop-details', JSON.stringify(shopDetails));

         dispatch(setAppShopDetailsAsync(shopAppUrl));
      });
   }, [shopAppUrl, database]);

   // useEffect(() => {
   //    (secure === '401') && signInProvider('google', { redirect: false, callbackUrl: `/auth/signup` });
   // }, [secure]);

   // useEffect(() => {
   //    dispatch(setAppPageId('profile_page'));
   // }, []);


   return (
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
                     startIcon={<UpdateIcon />}
                  >Update Profile</LoadingButton>
               </Box>
            </Stack>
         </form>
      </>
   );
};

export default Profile_page;
