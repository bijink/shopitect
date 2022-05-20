import type { ProdDetailsModalTypes } from './product.types';

import {
   Box,
   IconButton,
   Modal,
   TextField,
   Stack,
   Typography,
   Tooltip,
   Button,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from '@mui/lab';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import { doc, updateDoc } from 'firebase/firestore';
import { database } from '../../config/firebase.config';


const style = {
   position: 'absolute' as 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: '80%',
   height: '75vh',
   bgcolor: 'background.paper',
   border: '2px solid #000',
   boxShadow: 24,
   overflowY: 'scroll',
};


export default function EditModal_productTable({ shopUrlName, prodId, prodName, prodCodeName, prodBrand, prodCategory, quantity }: ProdDetailsModalTypes) {
   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);

   const [prodCodeNameInput, setProdCodeNameInput] = useState(prodCodeName);
   const [prodNameInput, setProdNameInput] = useState(prodName);
   const [prodCategoryInput, setProdCategoryInput] = useState(prodCategory);
   const [prodBrandInput, setProdBrandInput] = useState(prodBrand);
   const [quantityInput, setQuantityInput] = useState(`${quantity}`);

   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);


   const handleSubmit = async (e: any) => {
      e.preventDefault();
      setLoading(true);

      await updateDoc(doc(database, "shops", shopUrlName, "products", prodId), {
         name: prodNameInput,
         codeName: prodCodeNameInput,
         category: prodCategoryInput,
         brand: prodBrandInput,
         quantity: parseFloat(quantityInput),
      }).then(() => {
         setLoading(false);
         setOpen(false);
      });
   };


   return (
      <>
         <Tooltip title="Edit" placement="left" arrow >
            <IconButton size='small' sx={{ backgroundColor: 'orange' }}
               onClick={handleOpen}
            >
               <EditIcon />
            </IconButton>
         </Tooltip>

         <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
         >
            <Box sx={style} >
               <Box width={'100%'} height={'100%'} p={3}  >
                  <Typography variant='h5' gutterBottom textAlign='center' >Edit Product Details</Typography>

                  <Stack direction="row" spacing={2} py={1} >
                     <Stack flexGrow={1} justifyContent="center" alignItems="center" width="100%" >
                        <Typography component="p" sx={{ fontSize: '18px', fontWeight: '600' }} >Previous</Typography>
                     </Stack>
                     <Stack flexGrow={1} justifyContent="center" alignItems="center" width="100%" >
                        <Typography component="p" sx={{ fontSize: '18px', fontWeight: '600' }} >Titles</Typography>
                     </Stack>
                     <Stack flexGrow={1} justifyContent="center" alignItems="center" width="100%" >
                        <Typography component="p" sx={{ fontSize: '18px', fontWeight: '600' }} >New</Typography>
                     </Stack>
                  </Stack>

                  <form onSubmit={handleSubmit} >
                     <Stack direction="column" spacing={2}  >
                        <Stack direction="row" spacing={2} >
                           <TextField
                              size="small"
                              id="outlined-required"
                              defaultValue={prodCodeName}
                              fullWidth
                              disabled
                           />
                           <Stack flexGrow={1} justifyContent="center" alignItems="center" width="100%" >
                              <Typography component="p" sx={{ fontWeight: '500' }} >Product Code</Typography>
                           </Stack>
                           <TextField
                              size="small"
                              id="outlined-required"
                              fullWidth
                              required
                              value={prodCodeNameInput}
                              onInput={(e: ChangeEvent<HTMLInputElement>) => setProdCodeNameInput(e.target.value)}
                           />
                        </Stack>
                        <Stack direction="row" spacing={2} >
                           <TextField
                              size="small"
                              id="outlined-required"
                              defaultValue={prodName}
                              fullWidth
                              disabled
                           />
                           <Stack flexGrow={1} justifyContent="center" alignItems="center" width="100%" >
                              <Typography component="p" sx={{ fontWeight: '500' }} >Product Name</Typography>
                           </Stack>
                           <TextField
                              size="small"
                              id="outlined-required"
                              fullWidth
                              required
                              value={prodNameInput}
                              onInput={(e: ChangeEvent<HTMLInputElement>) => setProdNameInput(e.target.value)}
                           />
                        </Stack>
                        <Stack direction="row" spacing={2} >
                           <TextField
                              size="small"
                              id="outlined-required"
                              defaultValue={prodCategory}
                              fullWidth
                              disabled
                           />
                           <Stack flexGrow={1} justifyContent="center" alignItems="center" width="100%" >
                              <Typography component="p" sx={{ fontWeight: '500' }} >Category</Typography>
                           </Stack>
                           <TextField
                              size="small"
                              id="outlined-required"
                              fullWidth
                              required
                              value={prodCategoryInput}
                              onInput={(e: ChangeEvent<HTMLInputElement>) => setProdCategoryInput(e.target.value)}
                           />
                        </Stack>
                        <Stack direction="row" spacing={2} >
                           <TextField
                              size="small"
                              id="outlined-required"
                              defaultValue={prodBrand}
                              fullWidth
                              disabled
                           />
                           <Stack flexGrow={1} justifyContent="center" alignItems="center" width="100%" >
                              <Typography component="p" sx={{ fontWeight: '500' }} >Brand Name</Typography>
                           </Stack>
                           <TextField
                              size="small"
                              id="outlined-required"
                              fullWidth
                              required
                              value={prodBrandInput}
                              onInput={(e: ChangeEvent<HTMLInputElement>) => setProdBrandInput(e.target.value)}
                           />
                        </Stack>
                        <Stack direction="row" spacing={2} >
                           <TextField
                              size="small"
                              id="outlined-required"
                              defaultValue={quantity}
                              fullWidth
                              disabled
                           />
                           <Stack flexGrow={1} justifyContent="center" alignItems="center" width="100%" >
                              <Typography component="p" sx={{ fontWeight: '500' }} >Quantiy</Typography>
                           </Stack>
                           <TextField
                              size="small"
                              id="outlined-required"
                              type="number"
                              fullWidth
                              required
                              value={quantityInput}
                              onInput={(e: ChangeEvent<HTMLInputElement>) => setQuantityInput(e.target.value)}
                           />
                        </Stack>
                     </Stack>
                     <Stack direction={{ sm: 'column', md: 'row' }} spacing={{ sm: 1, md: 3 }} pt={4}>
                        <Button
                           variant="contained"
                           size='large'
                           color="error"
                           fullWidth
                           onClick={() => setOpen(false)}
                        >Cancel</Button>
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
               </Box>
            </Box>
         </Modal>
      </>
   );
}
