import { LoadingButton } from "@mui/lab";
import { Box, Button, Container, Stack, TextareaAutosize, TextField, Typography } from "@mui/material";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { database } from "../config/firebase.config";
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';


const Create_app = () => {
   const inputFocusRef = useRef<any>(null);

   const [shopName, setShopName] = useState('');
   const [shopCategory, setShopCategory] = useState('');
   const [shopOwnerName, setShopOwnerName] = useState('');
   const [shopEmail, setShopEmail] = useState('');
   const [shopAddress, setShopAddress] = useState('');

   const [loading, setLoading] = useState(false);

   const handleFormSubmit = async (e: any) => {
      e.preventDefault();
      setLoading(true);

      const docRef = await addDoc(collection(database, 'shops'), {
         shopName,
         shopCategory,
         shopOwnerName,
         shopEmail,
         shopAddress,
         createdAt: serverTimestamp()
      });

      await updateDoc(doc(database, 'shops', docRef.id), {
         shopId: docRef.id
      }).then(() => {
         setShopName('');
         setShopCategory('');
         setShopOwnerName('');
         setShopEmail('');
         setShopAddress('');
      }).then(() => {
         setLoading(false);
      });
   };

   const handleFormReset = () => {
      setShopName('');
      setShopCategory('');
      setShopOwnerName('');
      setShopEmail('');
      setShopAddress('');
   };


   useEffect(() => {
      inputFocusRef.current.focus();
   }, []);


   return (
      <Box py={10} >
         <Container >
            <Typography variant="h4" component={'div'} gutterBottom>Create App</Typography>
            <form onSubmit={handleFormSubmit}>
               <Stack direction="column" spacing={3}>
                  <Stack direction="row" spacing={3} >
                     <TextField
                        label="Shop Name"
                        size="small"
                        fullWidth
                        value={shopName}
                        onInput={(e: any) => setShopName(e.target.value)}
                        inputRef={inputFocusRef}
                        required
                     />
                     <TextField
                        label="Shop Category"
                        size="small"
                        fullWidth
                        value={shopCategory}
                        onInput={(e: any) => setShopCategory(e.target.value)}
                        required
                     />
                  </Stack>
                  <Stack direction="row" spacing={3}>
                     <TextField
                        label="Shop Ower Name"
                        size="small"
                        fullWidth
                        value={shopOwnerName}
                        onInput={(e: any) => setShopOwnerName(e.target.value)}
                        required
                     />
                     <TextField
                        label="Email Address"
                        size="small"
                        fullWidth
                        type="shopEmail"
                        value={shopEmail}
                        onInput={(e: any) => setShopEmail(e.target.value)}
                        required
                     />
                  </Stack>
                  <Stack direction="row" spacing={3}>
                     <TextareaAutosize
                        aria-label="shop address"
                        placeholder="Shop Address"
                        minRows={8}
                        maxRows={8}
                        style={{
                           minWidth: '49%',
                           maxWidth: '49%',
                           fontSize: '15px',
                           padding: '12px',
                           borderRadius: '4px',
                           outlineColor: '#1976d2'
                        }}
                        value={shopAddress}
                        onInput={(e: any) => setShopAddress(e.target.value)}
                        required
                     />
                  </Stack>
               </Stack>
               <Stack direction={{ sm: 'column', md: 'row' }} spacing={{ sm: 1, md: 3 }} pt={4}>
                  <Button
                     variant="contained"
                     onClick={handleFormReset}
                     size='large'
                     fullWidth
                     color="error"
                  >Reset</Button>
                  <LoadingButton
                     variant="contained"
                     type="submit"
                     size='large'
                     fullWidth
                     loading={loading}
                     loadingPosition="start"
                     startIcon={<PublishRoundedIcon />}
                  >Submit</LoadingButton>
               </Stack>
            </form>
         </Container>
      </Box>
   );
};

export default Create_app;
