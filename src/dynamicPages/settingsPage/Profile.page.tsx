import { Box, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { setAppShopDetailsAsync } from "../../redux/slices/shopDetails.slice";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { database, storage } from "../../config/firebase.config";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import UpdateIcon from '@mui/icons-material/Update';
import { useShop } from "../../hooks";
import { ImageCropper } from "../../components/dialogs";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


const Profile_page = () => {
   const router = useRouter();
   const { shopAppUrl } = router.query;

   const dispatch = useAppDispatch();

   const { data: shop } = useShop(shopAppUrl);

   const [shopName, setShopName] = useState('');
   const [shopCategory, setShopCategory] = useState('');
   const [shopOwnerName, setShopOwnerName] = useState('');
   const [shopAddress, setShopAddress] = useState('');
   const [shopAbout, setShopAbout] = useState('');
   const [shopLogo, setShopLogo] = useState<Blob | null>(null);

   const [loading, setLoading] = useState(false);


   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      const logoRef = ref(storage, `/${shop?.urlName!}/shop-logo`);

      if (shopLogo) {
         await updateDoc(doc(database, "shops", shop?.urlName!), {
            name: shopName,
            category: shopCategory,
            ownerName: shopOwnerName,
            address: shopAddress,
            about: shopAbout,
         }).then(() => {
            uploadBytes(logoRef, shopLogo!).then(() => {
               getDownloadURL(logoRef).then(url => {
                  updateDoc(doc(database, 'shops', shop?.urlName!), {
                     logoUrl: url,
                  }).then(() => {
                     setLoading(false);
                  });
               });
            });
         }).catch((err) => {
            console.error(err.message);
         });
      } else {
         await updateDoc(doc(database, "shops", shop?.urlName!), {
            name: shopName,
            category: shopCategory,
            ownerName: shopOwnerName,
            address: shopAddress,
            about: shopAbout,
         }).then(() => {
            setLoading(false);
         }).catch((err) => {
            console.error(err.message);
         });
      }
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
            setShopAbout(obj.data().about);

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


   return (
      <>
         <form onSubmit={handleSubmit} >
            <Stack direction="column" spacing={2} >
               <Box>
                  <Typography variant="body1" fontWeight={500} gutterBottom >Shop Name</Typography>
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
                  <Typography variant="body1" fontWeight={500} gutterBottom >Owner Name</Typography>
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
                  <Typography variant="body1" fontWeight={500} gutterBottom >Category</Typography>
                  <TextField
                     size="small"
                     id="outlined-required"
                     fullWidth
                     required
                     value={shopCategory}
                     onInput={(e: ChangeEvent<HTMLInputElement>) => setShopCategory(e.target.value)}
                  />
               </Box>
               <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2, sm: 0 }} >
                  <Box width={'100%'} >
                     <Typography variant="body1" fontWeight={500} gutterBottom >Address</Typography>
                     <TextField
                        size="small"
                        id="outlined-required"
                        placeholder="Shop Address*"
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={5}
                        value={shopAddress}
                        onInput={(e: ChangeEvent<HTMLInputElement>) => setShopAddress(e.target.value)}
                        required
                     />
                  </Box>
                  <Box width={'100%'} pl="1%" >
                     <Typography variant="body1" fontWeight={500} gutterBottom >About</Typography>
                     <TextField
                        size="small"
                        id="outlined-required"
                        placeholder="About Shop"
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={5}
                        value={shopAbout}
                        onInput={(e: ChangeEvent<HTMLInputElement>) => setShopAbout(e.target.value)}
                     />
                  </Box>
               </Stack>
               <Box>
                  <Typography variant="body1" fontWeight={500} gutterBottom >Shop Logo</Typography>
                  <ImageCropper getBlob={setShopLogo} />
               </Box>

               <Box pt={2} >
                  <LoadingButton
                     variant="contained"
                     type="submit"
                     color={'success'}
                     size="medium"
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
