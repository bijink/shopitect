import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Box, InputAdornment, Stack, TextField, Typography, Button, selectClasses } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { database } from "../../config/firebase.config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import LoadingButton from '@mui/lab/LoadingButton';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
// import DatePicker from "react-datepicker";
// import 'react-datepicker/dist/react-datepicker.css';


const ProductInputForm = () => {
   const inputFocusRef = useRef<any>(null);

   const [prodName, setProdName] = useState('');
   const [prodCode, setProdCode] = useState('');
   const [prodCategory, setProdCategory] = useState('');
   const [companyName, setCompanyName] = useState('');
   const [quantity, setQuantity] = useState('');

   // const [date, setDate] = useState<Date>(new Date());

   const [getPriceInput, setGetPriceInput] = useState<string>('');
   const [sellPriceInput, setSellPriceInput] = useState<string>('');
   const [profitAmountInput, setProfitAmountInput] = useState<string>('');
   const [profitPercentageInput, setProfitPercentageInput] = useState<string>('');

   // const [checkCalc, setCheckCalc] = useState(false);
   const [calcMethod, setCalcMethod] = useState('method-1');
   const [loading, setLoading] = useState(false);


   const calculate = () => {
      // * (getPrice, sellPrice) => (profitAmount, profitPercentage)
      if (calcMethod === 'method-1') {
         if (((getPriceInput && sellPriceInput) !== '') && ((getPriceInput) !== '0')) {
            let getPrice = parseFloat(getPriceInput);
            let sellPrice = parseFloat(sellPriceInput);

            // * (getPrice, sellPrice) => profitAmount
            let profitAmountCalc = sellPrice - getPrice;
            setProfitAmountInput(profitAmountCalc.toFixed(2));

            // * (getPrice, sellPrice) => profitPercentage
            let profitPercentageCalc = profitAmountCalc / (getPrice / 100);
            setProfitPercentageInput(profitPercentageCalc.toFixed(2));
         }
      }
      // * (getPrice, profitPercentage) => (profitAmount, sellPrice)
      if (calcMethod === 'method-2') {
         if (((getPriceInput && profitPercentageInput) !== '') && ((getPriceInput) !== '0')) {
            let getPrice = parseFloat(getPriceInput);
            let profitPercentage = parseFloat(profitPercentageInput);

            // * (getPrice, profitPercentage) => profitAmount
            let profitAmountCalc = (getPrice / 100) * profitPercentage;
            setProfitAmountInput(profitAmountCalc.toFixed(2));

            // * (getPrice, profitPercentage) => sellPrice
            let sellPriceCalc = profitAmountCalc + getPrice;
            setSellPriceInput(sellPriceCalc.toFixed(2));
         }
      }
      // * (getPrice, profitAmount) => (sellPrice, profitPercentage)
      if (calcMethod === 'method-3') {
         if (((getPriceInput && profitAmountInput) !== '') && ((getPriceInput) !== '0')) {
            let getPrice = parseFloat(getPriceInput);
            let profitAmount = parseFloat(profitAmountInput);

            // * (getPrice, profitAmount) => sellPrice
            let sellPriceCalc = getPrice + profitAmount;
            setSellPriceInput(sellPriceCalc.toFixed(2));

            // * (getPrice, profitAmount) => profitPercentage
            let profitPercentageCalc = ((sellPriceCalc - getPrice) / (getPrice / 100));
            setProfitPercentageInput(profitPercentageCalc.toFixed(2));
         }
      }
   };

   const handleFormSubmit = (e: any) => {
      e.preventDefault();
      setLoading(true);

      addDoc(collection(database, 'products'), {
         prodName: prodName,
         prodCode: prodCode,
         prodCategory: prodCategory,
         companyName: companyName,
         quantity: parseFloat(quantity),
         getPrice: (getPriceInput === '') ? getPriceInput : parseFloat(getPriceInput),
         sellPrice: (sellPriceInput === '') ? sellPriceInput : parseFloat(sellPriceInput),
         profitAmount: (profitAmountInput === '') ? profitAmountInput : parseFloat(profitAmountInput),
         profitPercentage: (profitPercentageInput === '') ? profitPercentageInput : parseFloat(profitPercentageInput),
         createdAt: serverTimestamp()
      }).then(() => {
         setProdName('');
         setProdCode('');
         setProdCategory('');
         setCompanyName('');
         setQuantity('');
         setGetPriceInput('');
         setSellPriceInput('');
         setProfitAmountInput('');
         setProfitPercentageInput('');
      }).then(() => {
         setLoading(false);
      });
   };

   const handleFormReset = () => {
      setProdName('');
      setProdCode('');
      setProdCategory('');
      setCompanyName('');
      setQuantity('');
      setGetPriceInput('');
      setSellPriceInput('');
      setProfitAmountInput('');
      setProfitPercentageInput('');
      setCalcMethod('method-1');
   };


   useEffect(() => {
      inputFocusRef.current.focus();
   }, []);


   return (
      <>
         <form onSubmit={handleFormSubmit}>
            <Stack direction="column" spacing={3}>
               <Stack direction="row" spacing={3} >
                  <TextField
                     label="Product Name"
                     size="small"
                     fullWidth
                     value={prodName}
                     onInput={(e: any) => setProdName(e.target.value)}
                     required
                     inputRef={inputFocusRef}
                  />
                  <TextField
                     label="Product Code"
                     size="small"
                     value={prodCode}
                     onInput={(e: any) => setProdCode(e.target.value)}
                  />
               </Stack>
               <Stack direction="row" spacing={3}>
                  <TextField
                     label="Company Name"
                     size="small"
                     fullWidth
                     value={companyName}
                     onInput={(e: any) => setCompanyName(e.target.value)}
                     required
                  />
                  <TextField
                     label="Category"
                     size="small"
                     fullWidth
                     value={prodCategory}
                     onInput={(e: any) => setProdCategory(e.target.value)}
                     required
                  />
               </Stack>
               <Stack direction="row" spacing={3}>
                  <TextField
                     label="Quantity"
                     size="small"
                     type="number"
                     // sx={{ width: '12.5%', paddingRight: '12px' }}
                     sx={{ width: '12%' }}
                     value={quantity}
                     onInput={(e: any) => setQuantity(e.target.value)}
                     required
                  />
                  {/* <TextField
                     label="Expire Date"
                     size="small"
                     type="number"
                     sx={{ width: '34.7%' }}
                     value={quantity}
                     onInput={(e: any) => setQuantity(e.target.value)}
                  // required
                  /> */}
                  {/* <DatePicker
                     selected={date}
                     onChange={(date: Date) => setDate(date)}
                     dateFormat='dd/MM/yyyy'
                  /> */}
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
                     <Button variant="contained" size="small" onClick={calculate}>Calculate</Button>
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
                           {/* <Typography variant="h6" sx={{ transform: 'rotate(90deg)' }} component="div" className="btn">»</Typography> */}
                           <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                              <TextField label="Profit Percentage" size="small" fullWidth type="number"
                                 helperText="*helper text"
                                 InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment>, readOnly: true }}
                                 value={profitPercentageInput}
                                 disabled
                              />
                              <TextField label="Profit Amount" size="small" fullWidth type="number"
                                 helperText="*helper text"
                                 InputProps={{
                                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                    endAdornment: <InputAdornment position="end">+</InputAdornment>,
                                    readOnly: true,
                                 }}
                                 value={profitAmountInput}
                                 disabled
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
                                 InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment>, readOnly: true }}
                                 value={sellPriceInput}
                                 disabled
                              />
                              <TextField label="Profit Amount" size="small" fullWidth type="number"
                                 helperText="*helper text"
                                 InputProps={{
                                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                    endAdornment: <InputAdornment position="end">+</InputAdornment>,
                                    readOnly: true
                                 }}
                                 value={profitAmountInput}
                                 disabled
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
                                 InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment>, readOnly: true }}
                                 value={sellPriceInput}
                                 disabled
                              />
                              <TextField label="Profit Percentage" size="small" fullWidth type="number"
                                 helperText="*helper text"
                                 InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment>, readOnly: true }}
                                 value={profitPercentageInput}
                                 disabled
                              />
                           </Stack>
                        </>}
                  </Stack>
                  {/* {(getPriceInput !== '') &&
               <Typography variant="subtitle2" color={checkCalc ? 'green' : 'error'}>Calculation {checkCalc ? 'Correct' : 'wrong'}</Typography>
            } */}
               </Box>
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
      </>
   );
};

export default ProductInputForm;
