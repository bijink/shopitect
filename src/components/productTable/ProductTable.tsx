import type { ProdDetailsTypes, ProductTableProps, ProductTableRowProps } from './product.types';

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
   Tooltip,
   capitalize,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { deleteDoc, doc } from 'firebase/firestore';
import { database, storage } from '../../config/firebase.config';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditProduct_modal from './EditProduct.modal';
import { ref, deleteObject } from "firebase/storage";


const Row = ({ rowBgColor, shopUrlName, prodId, prodCodeName, prodName, prodCategory, prodBrand, prodImg, quantity, getPrice, sellPrice, profitAmount, profitPercentage, createdAt }: ProductTableRowProps) => {
   const [open, setOpen] = useState(false);


   const moreDetails = [
      { title: 'Get Price (Rs)', value: getPrice },
      { title: 'Profit Percentage (%)', value: profitPercentage + ' %' },
      { title: 'Profit Amount (Rs)', value: profitAmount },
      { title: 'Quantity', value: quantity },
      { title: 'Brand', value: capitalize(prodBrand) },
      { title: 'Created At', value: createdAt.toDate().toUTCString().slice(0, 22) },
   ];


   const handleProdRemove = async () => {
      const imageRef = ref(storage, `/product-images/${shopUrlName}/PRODUCT_IMG:${prodId}`);
      await deleteObject(imageRef).then(() => {
         deleteDoc(doc(database, "shops", shopUrlName, "products", prodId));
         // File deleted successfully
      }).catch((error) => {
         // Uh-oh, an error occurred!
      });
   };


   return (
      <>
         <TableRow sx={{ '& > *': { backgroundColor: rowBgColor, borderBottom: 'unset', borderTop: '1.05px solid gray' } }} >
            <TableCell component="th" scope="row" align="left" sx={{ fontWeight: 'bold' }} >{capitalize(prodCodeName)}</TableCell>
            <TableCell component="th" scope="row" align="left" sx={{ fontWeight: '500' }} >{capitalize(prodName)}</TableCell>
            <TableCell>
               <Avatar src={prodImg} alt={capitalize(prodName)} variant="rounded" />
            </TableCell>
            <TableCell align="left" >{capitalize(prodCategory)}</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }} >{sellPrice}</TableCell>
            <TableCell align="center">
               <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
               >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
               </IconButton>
            </TableCell>
         </TableRow>

         <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4} >
               <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box my={1} >
                     <Typography variant="h6" gutterBottom component="div">
                        More Details
                     </Typography>
                     <Table size="small" aria-label="purchases">
                        <TableBody>
                           {moreDetails.map((obj, index) => (
                              <TableRow key={index} >
                                 <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: '#616161' }} >{obj.title}</TableCell>
                                 <TableCell align="right">{obj.value}</TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </Box>
               </Collapse>
            </TableCell>

            <TableCell style={{ padding: 0 }} colSpan={1} >
               <Collapse in={open} timeout="auto" unmountOnExit />
            </TableCell>

            <TableCell style={{ padding: 0 }} colSpan={1} >
               <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box>
                     <Table size="small" aria-label="purchases"
                        sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none" } }}
                     >
                        <TableBody  >
                           <TableRow  >
                              <TableCell component="th" scope="row" align="center"  >
                                 <EditProduct_modal
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
                                 <Tooltip title="Remove" placement="left" arrow >
                                    <IconButton size='small' sx={{ backgroundColor: 'red' }}
                                       onClick={handleProdRemove}
                                    >
                                       <DeleteIcon />
                                    </IconButton>
                                 </Tooltip>
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
   return (
      <TableContainer component={Paper}>
         <Table aria-label="collapsible table" size="small" >
            <TableHead >
               <TableRow sx={{ backgroundColor: '#616161' }}>
                  <TableCell align="left" sx={{ color: '#ffffff' }} >Code</TableCell>
                  <TableCell align="left" sx={{ color: '#ffffff', paddingTop: '18px', paddingBottom: '18px' }} >Name</TableCell>
                  <TableCell align="left" sx={{ color: '#ffffff' }}>Image</TableCell>
                  <TableCell align="left" sx={{ color: '#ffffff' }}>Catagory</TableCell>
                  <TableCell align="right" sx={{ color: '#ffffff' }}>Sell Price&nbsp;(Rs)</TableCell>
                  <TableCell />
               </TableRow>
            </TableHead>
            <TableBody>
               {products.map((prod: ProdDetailsTypes, index: number) => (
                  <Row key={index}
                     rowBgColor={index % 2 === 0 ? '#f5f5f5' : '#e0e0e0'}

                     shopUrlName={shopData?.urlName}

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
               ))}
            </TableBody>
         </Table>
      </TableContainer >
   );
};
