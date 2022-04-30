import { ChangeEvent, useState } from "react";
import { Box, InputAdornment, Stack, TextField, Typography, Button } from "@mui/material";
import Head from "next/head";
import ShopAdminSection_layout from "../../../layouts/ShopAdminSection.layout";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


const Product_add = () => {
   const [getPriceInput, setGetPriceInput] = useState<string>('');
   const [sellPriceInput, setSellPriceInput] = useState<string>('');
   const [profitAmountInput, setProfitAmountInput] = useState<string>('');
   const [profitPercentageInput, setProfitPercentageInput] = useState<string>('');
   // const [checkCalc, setCheckCalc] = useState(false);
   const [calcMethod, setCalcMethod] = useState('method-1');


   const calculate = () => {
      // * (getPrice, sellPrice) => (profitAmount, profitPercentage)
      if (calcMethod === 'method-1') {
         if (((getPriceInput && sellPriceInput) !== '') && ((getPriceInput) !== '0')) {
            let getPrice = parseFloat(getPriceInput);
            let sellPrice = parseFloat(sellPriceInput);

            // * (getPrice, sellPrice) => profitAmount
            let profitAmountCalc = sellPrice - getPrice;
            if (profitAmountCalc > 0) {
               setProfitAmountInput(`+${profitAmountCalc.toFixed(2)}`);
            } else if (profitAmountCalc < 0) {
               setProfitAmountInput(profitAmountCalc.toFixed(2));
            } else if (profitAmountCalc == 0) {
               setProfitAmountInput(profitAmountCalc.toFixed());
            }

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
            if (profitAmountCalc > 0) {
               setProfitAmountInput(`+${profitAmountCalc.toFixed(2)}`);
            } else if (profitAmountCalc < 0) {
               setProfitAmountInput(profitAmountCalc.toFixed(2));
            } else if (profitAmountCalc == 0) {
               setProfitAmountInput(profitAmountCalc.toFixed());
            }

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


   // useEffect(() => {
   //    let getPrice = parseFloat(getPriceInput);
   //    let sellPrice = parseFloat(sellPriceInput);
   //    // let profitAmount = parseFloat(profitAmountInput);
   //    let profitPercentage = parseFloat(profitPercentageInput);

   //    let sellPriceCheck = ((getPrice / 100) * profitPercentage) + getPrice;
   //    if (sellPriceCheck == sellPrice) {
   //       setCheckCalc(true);
   //    } else {
   //       setCheckCalc(false);
   //    }
   // }, [getPriceInput, sellPriceInput, profitAmountInput, profitPercentageInput]);


   return (
      <>
         <Head>
            <title>Product (add) · shopName</title>
         </Head>

         <ShopAdminSection_layout>
            <>
               <Stack direction='row' spacing="auto" pb={2} sx={{ alignItems: 'center' }}>
                  <Typography variant="h4" component='div' >Add Product Details</Typography>
               </Stack>
               <Box >
                  <Stack direction="column" spacing={3}>
                     <Stack direction="row" spacing={3} >
                        <TextField
                           label="Product Name"
                           size="small"
                           fullWidth
                        />
                        <TextField
                           label="Product Code"
                           size="small"
                        />
                     </Stack>
                     <Stack direction="row" spacing={3}>
                        <TextField
                           label="Company Name"
                           size="small"
                           fullWidth
                        />
                        <TextField
                           label="Category"
                           size="small"
                           fullWidth
                        />
                     </Stack>
                     <Stack direction="row" spacing={3}>
                        <TextField
                           label="Quantity"
                           size="small"
                           type="number"
                           // sx={{ width: '50%', paddingRight: '12px' }}
                           sx={{ width: '12.5%', paddingRight: '12px' }}
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
                           <Button variant="contained" onClick={calculate}>Calculate</Button>
                        </Stack>
                        <Stack direction="row" spacing={1} >
                           {(calcMethod == 'method-1') &&
                              <>
                                 <TextField label="Get Price" size="small" fullWidth type="number"
                                    helperText="*helper text"
                                    InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                                    value={getPriceInput}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setGetPriceInput(e.target.value)}
                                 />
                                 <TextField label="Sell Price" size="small" type="number" fullWidth
                                    helperText="*helper text"
                                    InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                                    value={sellPriceInput}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSellPriceInput(e.target.value)}
                                 />
                                 <Typography variant="h6" component="div">»</Typography>
                                 <TextField label="Profit Percentage" size="small" fullWidth type="number"
                                    helperText="*helper text"
                                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment>, readOnly: true }}
                                    value={profitPercentageInput}
                                 />
                                 <TextField label="Profit Amount" size="small" fullWidth type="number | value"
                                    helperText="*helper text"
                                    InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment>, readOnly: true }}
                                    value={profitAmountInput}
                                 />
                              </>}
                           {(calcMethod == 'method-2') &&
                              <>
                                 <TextField label="Get Price" size="small" fullWidth type="number"
                                    helperText="*helper text"
                                    InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                                    value={getPriceInput}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setGetPriceInput(e.target.value)}
                                 />
                                 <TextField label="Profit Percentage" size="small" fullWidth type="number"
                                    helperText="*helper text"
                                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                                    value={profitPercentageInput}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProfitPercentageInput(e.target.value)}
                                 />
                                 <Typography variant="h6" component="div">»</Typography>
                                 <TextField label="Sell Price" size="small" type="number" fullWidth
                                    helperText="*helper text"
                                    InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment>, readOnly: true }}
                                    value={sellPriceInput}
                                 />
                                 <TextField label="Profit Amount" size="small" fullWidth type="number | value"
                                    helperText="*helper text"
                                    InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment>, readOnly: true }}
                                    value={profitAmountInput}
                                 />
                              </>}
                           {(calcMethod == 'method-3') &&
                              <>
                                 <TextField label="Get Price" size="small" fullWidth type="number"
                                    helperText="*helper text"
                                    InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                                    value={getPriceInput}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setGetPriceInput(e.target.value)}
                                 />
                                 <TextField label="Profit Amount" size="small" fullWidth type="number | value"
                                    helperText="*helper text"
                                    InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }}
                                    value={profitAmountInput}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProfitAmountInput(e.target.value)}
                                 />
                                 <Typography variant="h6" component="div">»</Typography>
                                 <TextField label="Sell Price" size="small" type="number" fullWidth
                                    helperText="*helper text"
                                    InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment>, readOnly: true }}
                                    value={sellPriceInput}
                                 />
                                 <TextField label="Profit Percentage" size="small" fullWidth type="number"
                                    helperText="*helper text"
                                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment>, readOnly: true }}
                                    value={profitPercentageInput}
                                 />
                              </>}
                        </Stack>
                        {/* {(getPriceInput !== '') &&
                           <Typography variant="subtitle2" color={checkCalc ? 'green' : 'error'}>Calculation {checkCalc ? 'Correct' : 'wrong'}</Typography>
                        } */}
                     </Box>
                  </Stack>
               </Box>
            </>
         </ShopAdminSection_layout>
      </>
   );
};

export default Product_add;
