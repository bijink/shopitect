import type { ProductEditProps } from './dialogs.types';

import {
   Box,
   IconButton,
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
   Toolbar,
   AppBar,
   Dialog,
   Slide,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import { ChangeEvent, FormEvent, forwardRef, useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { doc, updateDoc } from 'firebase/firestore';
import { database } from '../../config/firebase.config';
import amountCalculate from '../../utility/amountCalculate';
import { useAppDispatch } from '../../redux/hooks';
import { changeProdTableCollapse } from '../../redux/slices/prodTableCollapse.slice';
import { setSnackbarState } from '../../redux/slices/snackbarState.slice';


const Transition = forwardRef(function Transition(
   props: TransitionProps & {
      children: React.ReactElement;
   },
   ref: React.Ref<unknown>,
) {
   return <Slide direction="up" ref={ref} {...props} />;
});


export default function ProductEdit_dialog({ shopUrlName, prodId, prodName, prodCodeName, prodBrand, prodCategory, quantity, getPrice, sellPrice, profitAmount, profitPercentage }: ProductEditProps) {
   const dispatch = useAppDispatch();

   const [open, setOpen] = useState(false);

   const [prodCodeNameInput, setProdCodeNameInput] = useState(prodCodeName);
   const [prodNameInput, setProdNameInput] = useState(prodName);
   const [prodCategoryInput, setProdCategoryInput] = useState(prodCategory);
   const [prodBrandInput, setProdBrandInput] = useState(prodBrand);
   const [quantityInput, setQuantityInput] = useState(quantity.toString());

   const [getPriceInput, setGetPriceInput] = useState<string>('');
   const [sellPriceInput, setSellPriceInput] = useState<string>('');
   const [profitAmountInput, setProfitAmountInput] = useState<string>('');
   const [profitPercentageInput, setProfitPercentageInput] = useState<string>('');

   const [calcMethod, setCalcMethod] = useState('method-1');
   const [canCalcuProceed, setCanCalcuProceed] = useState(false);


   const handleOpen = () => {
      setOpen(true);

      setGetPriceInput(getPrice.toString());
      setSellPriceInput(sellPrice.toString());
      setProfitAmountInput(profitAmount.toString());
      setProfitPercentageInput(profitPercentage.toString());
   };
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

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      dispatch(changeProdTableCollapse());

      await updateDoc(doc(database, "shops", shopUrlName, "products", prodId), {
         name: prodNameInput,
         codeName: prodCodeNameInput,
         category: prodCategoryInput.toLowerCase(),
         brand: prodBrandInput,
         quantity: parseFloat(quantityInput),
         getPrice: parseFloat(getPriceInput),
         sellPrice: parseFloat(sellPriceInput),
         profitAmount: parseFloat(profitAmountInput),
         profitPercentage: parseFloat(profitPercentageInput),
      }).then(() => {
         setOpen(false);
         dispatch(setSnackbarState({ id: 'prod_edit', open: true, message: 'Product details successfully edited...' }));
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
   }, [calcMethod, getPrice, sellPrice, profitPercentage, profitAmount, getPriceInput, sellPriceInput, profitAmountInput, profitPercentageInput]);


   return (
      <div>
         <Tooltip title="Edit" placement="left" arrow >
            <IconButton size='small' sx={{ color: 'orange' }}
               onClick={handleOpen}
            >
               <EditIcon />
            </IconButton>
         </Tooltip>

         <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
         >
            <form onSubmit={handleSubmit} >
               <AppBar sx={{ position: 'relative' }}>
                  <Toolbar>
                     <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                     >
                        <CloseIcon />
                     </IconButton>
                     <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Edit Product Details
                     </Typography>
                     <Button
                        autoFocus
                        color="inherit"
                        type="submit"
                     >
                        submit
                     </Button>
                  </Toolbar>
               </AppBar>

               <Box width={'100%'} height={'100%'} p={3}  >
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

                  <Stack direction="column" spacing={2}  >
                     <Stack direction="row" spacing={2} >
                        <TextField
                           size="small"
                           id="outlined-required"
                           defaultValue={prodCodeName}
                           fullWidth
                           disabled
                        />
                        <Stack flexGrow={1} justifyContent="center" width="100%" >
                           <Typography component="p" textAlign="center" sx={{ fontWeight: '500' }} >Product Code</Typography>
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
                        <Stack flexGrow={1} justifyContent="center" width="100%" >
                           <Typography component="p" textAlign="center" sx={{ fontWeight: '500' }} >Product Name</Typography>
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
                        <Stack flexGrow={1} justifyContent="center" width="100%" >
                           <Typography component="p" textAlign="center" sx={{ fontWeight: '500' }} >Category</Typography>
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
                        <Stack flexGrow={1} justifyContent="center" width="100%" >
                           <Typography component="p" textAlign="center" sx={{ fontWeight: '500' }} >Brand Name</Typography>
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
                        <Stack flexGrow={1} justifyContent="center" width="100%" >
                           <Typography component="p" textAlign="center" sx={{ fontWeight: '500' }} >Quantiy</Typography>
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
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing="auto" pb={3} alignItems='start' >
                           <FormControl>
                              <FormLabel id="row-radio-buttons-group-label">Amount Calculation</FormLabel>
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
                           <Stack width={{ xs: "100%", sm: 'inherit' }} direction={{ xs: 'row', sm: 'column-reverse', md: 'row' }} spacing={2} >
                              <Button variant="outlined" size="small" color="error" onClick={calculateReset}>Reset</Button>
                              <Button variant="contained" size="small" onClick={calculate}>Calculate</Button>
                           </Stack>
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: "row" }} alignItems="center" spacing={1} >
                           <Stack direction={{ xs: 'column', md: 'row' }} width="100%" spacing={1}>
                              <TextField label="Get Price" size="small" fullWidth type="number"
                                 helperText="*helper text"
                                 InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                                 value={getPriceInput}
                                 onInput={(e: ChangeEvent<HTMLInputElement>) => setGetPriceInput(e.target.value)}
                                 required
                              />
                              {(calcMethod == 'method-1') && (
                                 <TextField label="Sell Price" size="small" fullWidth type="number"
                                    helperText="*helper text"
                                    InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                                    value={sellPriceInput}
                                    onInput={(e: ChangeEvent<HTMLInputElement>) => setSellPriceInput(e.target.value)}
                                    required
                                 />
                              )}
                              {(calcMethod == 'method-2') && (
                                 <TextField label="Profit Percentage" size="small" fullWidth type="number"
                                    helperText="*helper text"
                                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                                    value={profitPercentageInput}
                                    onInput={(e: ChangeEvent<HTMLInputElement>) => setProfitPercentageInput(e.target.value)}
                                    required
                                 />
                              )}
                              {(calcMethod == 'method-3') && (
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
                              )}
                           </Stack>
                           <Typography fontSize="1.5rem" pb={3} sx={{ transform: { xs: 'rotate(90deg)', sm: 'rotate(0deg)' } }} >»</Typography>
                           <Stack direction={{ xs: 'column', md: 'row' }} width="100%" spacing={1}>
                              {(calcMethod == 'method-1') && (
                                 <>
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
                                 </>
                              )}
                              {(calcMethod == 'method-2') && (
                                 <>
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
                                 </>
                              )}
                              {(calcMethod == 'method-3') && (
                                 <>
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
                                 </>
                              )}
                           </Stack>
                        </Stack>
                     </Box>
                  </Stack>
               </Box>
            </form>
         </Dialog>
      </div>
   );
}
