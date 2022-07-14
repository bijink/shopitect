import type { ProdDetailsTypes, ProductTableProps, ProductTableRowProps } from './productTable.types';

import {
   Table,
   TableContainer,
   Paper,
   Collapse,
   TableHead,
   TableBody,
   TableRow,
   Box,
   IconButton,
   Avatar,
   Typography,
   TableCell,
   tableCellClasses,
   capitalize,
   colors,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { changeProdTableCollapse, selectProdTableCloseCollapse } from '../../redux/slices/prodTableCollapse.slice';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import Image from 'next/image';
import { ProductDelete_dialog, ProductEdit_dialog } from '../dialogs';


const Row = ({ rowBgColor, shopUrlName, prodId, prodNo, prodCodeName, prodName, prodCategory, prodBrand, prodImg, quantity, getPrice, sellPrice, profitAmount, profitPercentage, createdAt }: ProductTableRowProps) => {
   const [collapseOpen, setCollapseOpen] = useState(false);

   const tableCollapse = useAppSelector(selectProdTableCloseCollapse);

   let date = createdAt.toDate().toUTCString().slice(0, 16);
   let minute = createdAt.toDate().getMinutes();
   let hour = createdAt.toDate().getHours();
   let time = `${hour}:${(minute < 10) ? `0${minute}` : minute}`;


   const moreDetails = [
      { title: 'Get Price', value: `₹ ${getPrice}` },
      { title: 'Profit Amount', value: `₹ ${profitAmount}` },
      { title: 'Profit Percentage', value: `${profitPercentage} %` },
      { title: 'Quantity', value: quantity },
      { title: 'Brand', value: capitalize(prodBrand) },
   ];


   useEffect(() => setCollapseOpen(false), [tableCollapse]);


   return (
      <>
         <TableRow sx={{ '& > *': { backgroundColor: rowBgColor, borderBottom: 'unset', borderTop: '1.05px solid gray' } }} >
            <TableCell component="th" scope="row" align="left" >{prodNo}</TableCell>
            <TableCell component="th" scope="row" align="left" sx={{ fontWeight: 'bold' }} >{capitalize(prodCodeName)}</TableCell>
            <TableCell component="th" scope="row" align="left" sx={{ fontWeight: '500' }} >{capitalize(prodName)}</TableCell>
            <TableCell>
               <Avatar variant="rounded">
                  <Image
                     alt={`product:${capitalize(prodName)}`}
                     src={prodImg}
                     placeholder='blur'
                     blurDataURL={prodImg}
                     layout="fill"
                  />
               </Avatar>
            </TableCell>
            <TableCell align="left" >{capitalize(prodCategory)}</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }} >{`₹ ${sellPrice}`}</TableCell>
            <TableCell align="center">
               <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setCollapseOpen(!collapseOpen)}
               >
                  {collapseOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
               </IconButton>
            </TableCell>
         </TableRow>

         <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5} >
               <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
                  <Box my={0.5} >
                     <Typography variant="h6" gutterBottom component="div">
                        More Details
                     </Typography>
                     <Table size="small" aria-label="purchases">
                        <TableBody>
                           {moreDetails.map((obj, index) => (
                              <TableRow key={index} >
                                 <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: colors.grey[700] }} >{obj.title}</TableCell>
                                 <TableCell align="right">{obj.value}</TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                     <Typography variant="body2" component="div" pt={1} sx={{ fontSize: '12px' }} color="GrayText" >
                        {`${date} ${time}`}
                     </Typography>
                  </Box>
               </Collapse>
            </TableCell>

            <TableCell style={{ padding: 0 }} colSpan={1} >
               <Collapse in={collapseOpen} timeout="auto" unmountOnExit />
            </TableCell>

            <TableCell style={{ padding: 0 }} colSpan={1} >
               <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
                  <Box>
                     <Table size="small" aria-label="purchases"
                        sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none" } }}
                     >
                        <TableBody  >
                           <TableRow  >
                              <TableCell component="th" scope="row" align="center"  >
                                 <ProductEdit_dialog
                                    shopUrlName={shopUrlName}
                                    prodId={prodId}
                                    prodCodeName={prodCodeName}
                                    prodName={prodName}
                                    prodBrand={prodBrand}
                                    prodCategory={prodCategory}
                                    quantity={quantity}
                                    getPrice={getPrice}
                                    sellPrice={sellPrice}
                                    profitAmount={profitAmount}
                                    profitPercentage={profitPercentage}
                                 />
                              </TableCell>
                           </TableRow>
                           <TableRow >
                              <TableCell component="th" scope="row" align="center"  >
                                 <ProductDelete_dialog shopUrlName={shopUrlName} prodId={prodId} />
                              </TableCell>
                           </TableRow>
                        </TableBody>
                     </Table>
                  </Box>
               </Collapse>
            </TableCell>
         </TableRow>
      </>
   );
};


export default function ProductTable({ shopData, products }: ProductTableProps) {
   const dispatch = useAppDispatch();

   return (
      <TableContainer component={Paper}>
         <Table aria-label="collapsible table" size="small" >
            <TableHead >
               <TableRow sx={{ backgroundColor: colors.grey[800] }}>
                  <TableCell align="left" sx={{ color: 'white' }} >No.</TableCell>
                  <TableCell align="left" sx={{ color: 'white' }} >Code</TableCell>
                  <TableCell align="left" sx={{ color: 'white', paddingTop: '18px', paddingBottom: '18px' }} >Name</TableCell>
                  <TableCell align="left" sx={{ color: 'white' }}>Image</TableCell>
                  <TableCell align="left" sx={{ color: 'white' }}>Catagory</TableCell>
                  <TableCell align="right" sx={{ color: 'white' }}>Sell Price</TableCell>
                  <TableCell align="center">
                     <IconButton
                        aria-label="close expanded rows"
                        size="small"
                        onClick={() => dispatch(changeProdTableCollapse())}
                     >
                        <KeyboardDoubleArrowUpIcon />
                     </IconButton>
                  </TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {(products && shopData) && (products.map((prod: ProdDetailsTypes, index: number) => (
                  <Row key={index}
                     rowBgColor={index % 2 === 0 ? colors.grey[100] : colors.grey[300]}

                     shopUrlName={shopData?.urlName}

                     prodNo={index + 1}
                     prodId={prod.id}
                     prodCodeName={prod.data().codeName}
                     prodName={prod.data().name}
                     prodImg={prod.data().imageUrl}
                     prodBrand={prod.data().brand}
                     prodCategory={prod.data().category}
                     quantity={prod.data().quantity}
                     getPrice={prod.data().getPrice}
                     sellPrice={prod.data().sellPrice}
                     profitAmount={prod.data().profitAmount}
                     profitPercentage={prod.data().profitPercentage}
                     createdAt={prod.data().createdAt}
                  />
               )))}
            </TableBody>
         </Table>
      </TableContainer >
   );
};
