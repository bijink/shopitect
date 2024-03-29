import type { ProductInputProps } from "./productInput.types";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
   Box,
   InputAdornment,
   Stack,
   TextField,
   Typography,
   Button,
   Radio,
   RadioGroup,
   FormControlLabel,
   FormControl,
   FormLabel,
   styled,
} from "@mui/material";
import { database, storage } from "../../config/firebase.config";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import LoadingButton from '@mui/lab/LoadingButton';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import amountCalculate from "../../utility/amountCalculate";
import Snackbars from "../snackbars";
import { useAppDispatch } from "../../redux/hooks";
import { setSnackbarState } from "../../redux/slices/snackbarState.slice";


const StyledTypography = styled(Typography)(({ theme }) => ({
   padding: '3.2px 8px',
   border: `1px solid ${theme.palette.primary.light}`,
   color: theme.palette.primary.main,
   borderRadius: '4px ',
   cursor: 'pointer'
}));


const ProductInputForm = ({ shopData }: ProductInputProps) => {
   const dispatch = useAppDispatch();

   const inputFocusRef = useRef<any>(null);

   const [prodName, setProdName] = useState('');
   const [prodCodeName, setProdCodeName] = useState('');
   const [prodCategory, setProdCategory] = useState('');
   const [prodBrand, setProdBrand] = useState('');
   const [quantity, setQuantity] = useState('');
   const [prodImage, setProdImage] = useState<any>(null);

   const [getPriceInput, setGetPriceInput] = useState<string>('');
   const [sellPriceInput, setSellPriceInput] = useState<string>('');
   const [profitAmountInput, setProfitAmountInput] = useState<string>('');
   const [profitPercentageInput, setProfitPercentageInput] = useState<string>('');

   const [calcMethod, setCalcMethod] = useState('method-1');
   const [loading, setLoading] = useState(false);
   const [calcuInputDisabled, setCalcuInputDisabled] = useState(false);


   const calculate = () => {
      if (calcMethod === 'method-1') {
         // #(getPrice, sellPrice) =>> (profitAmount, profitPercentage)
         const [profitAmount, profitPercentage] = amountCalculate(calcMethod, getPriceInput, sellPriceInput);
         setProfitAmountInput(profitAmount);
         setProfitPercentageInput(profitPercentage);
      } else if (calcMethod === 'method-2') {
         // #(getPrice, profitPercentage)  =>> (profitAmount, sellPrice)
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
      setCalcuInputDisabled(false);

      setGetPriceInput('');
      setSellPriceInput('');
      setProfitAmountInput('');
      setProfitPercentageInput('');
   };

   const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      if (prodImage) {
         addDoc(collection(database, 'shops', shopData?.urlName, 'products'), {
            name: prodName,
            codeName: prodCodeName,
            category: prodCategory.toLowerCase(),
            brand: prodBrand,
            quantity: parseFloat(quantity),
            getPrice: parseFloat(getPriceInput),
            sellPrice: parseFloat(sellPriceInput),
            profitAmount: parseFloat(profitAmountInput),
            profitPercentage: parseFloat(profitPercentageInput),
            createdAt: serverTimestamp(),
         }).then((res) => {
            const imageRef = ref(storage, `/${shopData?.urlName}/product-images/PRODUCT_IMG:${res.id}`);
            uploadBytes(imageRef, prodImage!).then(() => {
               getDownloadURL(imageRef).then(url => {
                  updateDoc(doc(database, 'shops', shopData?.urlName, 'products', res.id), {
                     imageUrl: url,
                  }).then(() => {
                     dispatch(setSnackbarState({ id: 'prod_add', open: true, message: 'Product successfully added...' }));

                     setProdName('');
                     setProdCodeName('');
                     setProdCategory('');
                     setProdBrand('');
                     setQuantity('');
                     setGetPriceInput('');
                     setSellPriceInput('');
                     setProfitAmountInput('');
                     setProfitPercentageInput('');
                     setProdImage(null);
                  }).then(() => {
                     setLoading(false);
                     setCalcuInputDisabled(false);
                  });
               });
            });
         });
      } else {
         setLoading(false);
         alert('Image is not added. Please add Image.');
      }
   };

   const handleFormReset = () => {
      setLoading(false);

      setProdName('');
      setProdCodeName('');
      setProdCategory('');
      setProdBrand('');
      setQuantity('');
      setGetPriceInput('');
      setSellPriceInput('');
      setProfitAmountInput('');
      setProfitPercentageInput('');
      setCalcMethod('method-1');
      setProdImage(null);
   };


   useEffect(() => {
      if ((getPriceInput !== '') && (sellPriceInput !== '') && (profitAmountInput !== '') && (profitPercentageInput !== '')) {
         setCalcuInputDisabled(true);
      }
   }, [getPriceInput, sellPriceInput, profitAmountInput, profitPercentageInput]);

   useEffect(() => {
      inputFocusRef.current.focus();
   }, []);


   return (
      <>
         <form onSubmit={handleFormSubmit}>
            <Stack direction="column" spacing={3}>
               <Stack direction={{ xs: "column", sm: "row" }} spacing={3} >
                  <TextField
                     label="Product Name"
                     size="small"
                     fullWidth
                     value={prodName}
                     onInput={(e: ChangeEvent<HTMLInputElement>) => setProdName(e.target.value)}
                     required
                     inputRef={inputFocusRef}
                  />
                  <TextField
                     label="Product Code"
                     size="small"
                     value={prodCodeName}
                     onInput={(e: ChangeEvent<HTMLInputElement>) => setProdCodeName(e.target.value)}
                     required
                  />
               </Stack>
               <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                  <TextField
                     label="Brand"
                     size="small"
                     fullWidth
                     value={prodBrand}
                     onInput={(e: ChangeEvent<HTMLInputElement>) => setProdBrand(e.target.value)}
                     required
                  />
                  <TextField
                     label="Category"
                     size="small"
                     fullWidth
                     value={prodCategory}
                     onInput={(e: ChangeEvent<HTMLInputElement>) => setProdCategory(e.target.value)}
                     required
                  />
                  <TextField
                     label="Quantity"
                     size="small"
                     type="number"
                     fullWidth
                     value={quantity}
                     onInput={(e: ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value)}
                     required
                  />
               </Stack>
               <Stack direction="row" spacing={3}>
                  <Box>
                     <label htmlFor="upload-image">
                        {prodImage ? (
                           <img width={150} height={150} style={{ cursor: 'pointer' }} src={prodImage ? URL.createObjectURL(prodImage) : ''} alt="product" />
                        ) : (
                           <>
                              <StyledTypography>
                                 Add Product Image
                              </StyledTypography>
                           </>
                        )}
                     </label>
                     <TextField
                        id="upload-image"
                        type="file"
                        style={{ display: "none" }}
                        onInput={(e: any) => setProdImage(e.target.files[0])}
                     />
                  </Box>
                  {prodImage && <Button onClick={() => setProdImage(null)}>clear</Button>}
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
                        <Button variant="contained" size="small" sx={{ bgcolor: 'primary.light' }} onClick={calculate}>Calculate</Button>
                     </Stack>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: "row" }} alignItems="center" spacing={1} >
                     <Stack direction={{ xs: 'column', md: 'row' }} width="100%" spacing={1}>
                        <TextField label="Get Price" size="small" fullWidth type="number"
                           helperText="*helper text"
                           InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                           value={getPriceInput}
                           onInput={(e: ChangeEvent<HTMLInputElement>) => setGetPriceInput(e.target.value)}
                           disabled={calcuInputDisabled}
                           required
                        />
                        {(calcMethod == 'method-1') && (
                           <TextField label="Sell Price" size="small" fullWidth type="number"
                              helperText="*helper text"
                              InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                              value={sellPriceInput}
                              onInput={(e: ChangeEvent<HTMLInputElement>) => setSellPriceInput(e.target.value)}
                              disabled={calcuInputDisabled}
                              required
                           />
                        )}
                        {(calcMethod == 'method-2') && (
                           <TextField label="Profit Percentage" size="small" fullWidth type="number"
                              helperText="*helper text"
                              InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                              value={profitPercentageInput}
                              onInput={(e: ChangeEvent<HTMLInputElement>) => setProfitPercentageInput(e.target.value)}
                              disabled={calcuInputDisabled}
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
                              disabled={calcuInputDisabled}
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
                                 disabled={calcuInputDisabled}
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
                                 disabled={calcuInputDisabled}
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
                                 disabled={calcuInputDisabled}
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
                                 disabled={calcuInputDisabled}
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
                                    disabled={calcuInputDisabled}
                                    required
                                 />
                                 <TextField label="Profit Percentage" size="small" fullWidth type="number"
                                    helperText="*helper text"
                                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                                    value={profitPercentageInput}
                                    color="warning"
                                    disabled={calcuInputDisabled}
                                    required
                                 />
                              </Stack>
                           </>
                        )}
                     </Stack>
                  </Stack>
               </Box>
            </Stack>
            <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} pt={4}>
               <Button
                  variant="contained"
                  onClick={handleFormReset}
                  size='medium'
                  fullWidth
                  color="error"
               >Reset</Button>
               <LoadingButton
                  variant="contained"
                  type="submit"
                  size='medium'
                  fullWidth
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<PublishRoundedIcon />}
               >Submit</LoadingButton>
            </Stack>
         </form>

         {<Snackbars />}
      </>
   );
};

export default ProductInputForm;
