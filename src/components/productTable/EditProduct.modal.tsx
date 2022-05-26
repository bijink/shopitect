import type { EditProductModalProps } from './product.types';

import {
   Box,
   IconButton,
   Modal,
   TextField,
   Stack,
   Typography,
   Tooltip,
   Button,
   InputAdornment,
   FormControl,
   FormLabel,
   RadioGroup,
   FormControlLabel,
   Radio,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from '@mui/lab';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import { doc, updateDoc } from 'firebase/firestore';
import { database } from '../../config/firebase.config';
import amountCalculate from '../../utility/amountCalculate';


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


export default function EditProduct_modal({ shopUrlName, prodId, prodName, prodCodeName, prodBrand, prodCategory, quantity, getPrice, sellPrice, profitAmount, profitPercentage }: EditProductModalProps) {
   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);

   const [prodCodeNameInput, setProdCodeNameInput] = useState(prodCodeName);
   const [prodNameInput, setProdNameInput] = useState(prodName);
   const [prodCategoryInput, setProdCategoryInput] = useState(prodCategory);
   const [prodBrandInput, setProdBrandInput] = useState(prodBrand);
   const [quantityInput, setQuantityInput] = useState(quantity.toString());

   const [getPriceInput, setGetPriceInput] = useState<string>(getPrice.toString());
   const [sellPriceInput, setSellPriceInput] = useState<string>(sellPrice.toString());
   const [profitAmountInput, setProfitAmountInput] = useState<string>(profitAmount.toString());
   const [profitPercentageInput, setProfitPercentageInput] = useState<string>(profitPercentage.toString());

   const [calcMethod, setCalcMethod] = useState('method-1');
   const [canCalcuProceed, setCanCalcuProceed] = useState(false);


   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);

   const calculate = () => {
      setCanCalcuProceed(true);

      if (calcMethod === 'method-1') {
         // #(getPrice, sellPrice) =>> (profitAmount, profitPercentage)
         const [profitAmount, profitPercentage] = amountCalculate(calcMethod, getPriceInput, sellPriceInput);
         setProfitAmountInput(profitAmount);
         setProfitPercentageInput(profitPercentage);
      } else if (calcMethod === 'method-2') {
         // #(getPrice, profitPercentage) =>> (profitAmount, sellPrice)
         const [profitAmount, sellPrice] = amountCalculate(calcMethod, getPriceInput, profitPercentageInput);
         setProfitAmountInput(profitAmount);
         setSellPriceInput(sellPrice);
      } else if (calcMethod === 'method-3') {
         // #(getPrice, profitAmount) =>> (sellPrice, profitPercentage)
         const [sellPrice, profitPercentage] = amountCalculate(calcMethod, getPriceInput, profitAmountInput);
         setSellPriceInput(sellPrice);
         setProfitPercentageInput(profitPercentage);
      }
   };

   const calculateReset = () => {
      setGetPriceInput('');
      setSellPriceInput('');
      setProfitAmountInput('');
      setProfitPercentageInput('');
   };

   const handleSubmit = async (e: any) => {
      e.preventDefault();
      setLoading(true);

      await updateDoc(doc(database, "shops", shopUrlName, "products", prodId), {
         name: prodNameInput,
         codeName: prodCodeNameInput,
         category: prodCategoryInput,
         brand: prodBrandInput,
         quantity: parseFloat(quantityInput),
         getPrice: parseFloat(getPriceInput),
         sellPrice: parseFloat(sellPriceInput),
         profitAmount: parseFloat(profitAmountInput),
         profitPercentage: parseFloat(profitPercentageInput),
      }).then(() => {
         setLoading(false);
         setOpen(false);
      });
   };


   useEffect(() => {
      setCanCalcuProceed(false);

      if (!canCalcuProceed) {
         if (calcMethod === 'method-1') {
            if (((getPrice.toString()) != getPriceInput) || ((sellPrice.toString()) != sellPriceInput)) {
               setProfitAmountInput('');
               setProfitPercentageInput('');
            }
         } else if (calcMethod === 'method-2') {
            if (((getPrice.toString()) != getPriceInput) || ((profitPercentage.toString()) != profitPercentageInput)) {
               setSellPriceInput('');
               setProfitAmountInput('');
            }
         } else if (calcMethod === 'method-3') {
            if (((getPrice.toString()) != getPriceInput) || ((profitAmount.toString()) != profitAmountInput)) {
               setSellPriceInput('');
               setProfitPercentageInput('');
            }
         }
      }
   }, [getPriceInput, sellPriceInput, profitAmountInput, profitPercentageInput]);


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
                        <Box>
                           <Stack direction="row" spacing="auto" pb={1} sx={{ alignItems: 'center' }}>
                              <FormControl>
                                 <FormLabel id="row-radio-buttons-group-label">Calculation Method</FormLabel>
                                 <RadioGroup
                                    row
                                    aria-labelledby="row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={calcMethod}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCalcMethod(e.target.value)}
                                 >
                                    <FormControlLabel value="method-1" control={<Radio />} label="Method 1" />
                                    <FormControlLabel value="method-2" control={<Radio />} label="Method 2" />
                                    <FormControlLabel value="method-3" control={<Radio />} label="Method 3" />
                                 </RadioGroup>
                              </FormControl>
                              <Stack direction="row" spacing={2} >
                                 <Button variant="contained" size="small" color="error" onClick={calculateReset}>Reset</Button>
                                 <Button variant="contained" size="small" onClick={calculate}>Calculate</Button>
                              </Stack>
                           </Stack>
                           <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: 'center' }} spacing={1} >
                              {(calcMethod == 'method-1') &&
                                 <>
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                                       <TextField label="Get Price" size="small" fullWidth type="number"
                                          helperText="*helper text"
                                          InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                                          value={getPriceInput}
                                          onInput={(e: ChangeEvent<HTMLInputElement>) => setGetPriceInput(e.target.value)}
                                          required
                                       />
                                       <TextField label="Sell Price" size="small" fullWidth type="number"
                                          helperText="*helper text"
                                          InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                                          value={sellPriceInput}
                                          onInput={(e: ChangeEvent<HTMLInputElement>) => setSellPriceInput(e.target.value)}
                                          required
                                       />
                                    </Stack>
                                    <Typography height={60} variant="h6" component="div" className="btn" >»</Typography>
                                    {/* <Typography variant="h6" sx={{ transform: 'rotate(90deg)' }} component="Box" className="btn">»</Typography> */}
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                                       <TextField label="Profit Percentage" size="small" fullWidth type="number"
                                          helperText="*helper text"
                                          InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                                          value={profitPercentageInput}
                                          color="warning"
                                          required
                                       />
                                       <TextField label="Profit Amount" size="small" fullWidth type="number"
                                          helperText="*helper text"
                                          InputProps={{
                                             startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                             endAdornment: <InputAdornment position="end">+</InputAdornment>,
                                          }}
                                          value={profitAmountInput}
                                          color="warning"
                                          required
                                       />
                                    </Stack>
                                 </>}
                              {(calcMethod == 'method-2') &&
                                 <>
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                                       <TextField label="Get Price" size="small" fullWidth type="number"
                                          helperText="*helper text"
                                          InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                                          value={getPriceInput}
                                          onInput={(e: ChangeEvent<HTMLInputElement>) => setGetPriceInput(e.target.value)}
                                          required
                                       />
                                       <TextField label="Profit Percentage" size="small" fullWidth type="number"
                                          helperText="*helper text"
                                          InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                                          value={profitPercentageInput}
                                          onInput={(e: ChangeEvent<HTMLInputElement>) => setProfitPercentageInput(e.target.value)}
                                          required
                                       />
                                    </Stack>
                                    <Typography height={60} variant="h6" component="div">»</Typography>
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                                       <TextField label="Sell Price" size="small" fullWidth type="number"
                                          helperText="*helper text"
                                          InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                                          value={sellPriceInput}
                                          color="warning"
                                          required
                                       />
                                       <TextField label="Profit Amount" size="small" fullWidth type="number"
                                          helperText="*helper text"
                                          InputProps={{
                                             startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                             endAdornment: <InputAdornment position="end">+</InputAdornment>,
                                          }}
                                          value={profitAmountInput}
                                          color="warning"
                                          required
                                       />
                                    </Stack>
                                 </>}
                              {(calcMethod == 'method-3') &&
                                 <>
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                                       <TextField label="Get Price" size="small" fullWidth type="number"
                                          helperText="*helper text"
                                          InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                                          value={getPriceInput}
                                          onInput={(e: ChangeEvent<HTMLInputElement>) => setGetPriceInput(e.target.value)}
                                          required
                                       />
                                       <TextField label="Profit Amount" size="small" fullWidth type="number"
                                          helperText="*helper text"
                                          InputProps={{
                                             startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                             endAdornment: <InputAdornment position="end">+</InputAdornment>,
                                          }}
                                          value={profitAmountInput}
                                          onInput={(e: ChangeEvent<HTMLInputElement>) => setProfitAmountInput(e.target.value)}
                                          required
                                       />
                                    </Stack>
                                    <Typography height={60} variant="h6" component="div">»</Typography>
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                                       <TextField label="Sell Price" size="small" fullWidth type="number"
                                          helperText="*helper text"
                                          InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                                          value={sellPriceInput}
                                          color="warning"
                                          required
                                       />
                                       <TextField label="Profit Percentage" size="small" fullWidth type="number"
                                          helperText="*helper text"
                                          InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                                          value={profitPercentageInput}
                                          color="warning"
                                          required
                                       />
                                    </Stack>
                                 </>}
                           </Stack>
                        </Box>
                     </Stack>
                     <Stack direction={{ sm: 'column', md: 'row' }} spacing={{ sm: 1, md: 3 }} py={4}>
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
