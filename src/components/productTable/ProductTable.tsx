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
   Tooltip,
   capitalize,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { deleteDoc, doc } from 'firebase/firestore';
import { database, storage } from '../../config/firebase.config';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditProduct_modal from './EditProduct.modal';
import { ref, deleteObject } from "firebase/storage";
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { changeProdTableCollapse, selectProdTableCloseCollapse } from '../../redux/slices/prodTableCollapse.slice';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { LoadingButton } from "@mui/lab";
import { setSnackbarState } from '../../redux/slices/snackbarState.slice';
import Image from 'next/image';


const Row = ({ rowBgColor, shopUrlName, prodId, prodNo, prodCodeName, prodName, prodCategory, prodBrand, prodImg, quantity, getPrice, sellPrice, profitAmount, profitPercentage, createdAt }: ProductTableRowProps) => {
   const [collapseOpen, setCollapseOpen] = useState(false);
   const [dialogOpen, setDialogOpen] = useState(false);
   const [loading_remove, setLoading_remove] = useState(false);

   const dispatch = useAppDispatch();
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


   const handleDialogOpen = () => {
      setDialogOpen(true);
   };

   const handleDialogClose = () => {
      setDialogOpen(false);
   };

   const handleProdRemove = async () => {
      setLoading_remove(true);
      dispatch(changeProdTableCollapse());

      const imageRef = ref(storage, `/product-images/${shopUrlName}/PRODUCT_IMG:${prodId}`);
      await deleteObject(imageRef).then(() => {
         deleteDoc(doc(database, "shops", shopUrlName, "products", prodId)).then(() => {
            handleDialogClose();
            setLoading_remove(false);
            dispatch(setSnackbarState({ id: 'prod_remove', open: true, message: 'Product successfully removed...' }));
         });
         // File deleted successfully
      }).catch((error) => {
         // Uh-oh, an error occurred!
         console.error(error.messageh);
      });
   };


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
                                 <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: '#616161' }} >{obj.title}</TableCell>
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
                                    <IconButton size='small' sx={{ color: 'red' }}
                                       onClick={handleDialogOpen}
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

         <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogTitle id="alert-dialog-title">
               Remove this product?
            </DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Doing so will permanently remove the data of this product.
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleDialogClose}>cancel</Button>
               <LoadingButton
                  color="error"
                  onClick={handleProdRemove}
                  loadingPosition="center"
                  loading={loading_remove}
               >remove</LoadingButton>
            </DialogActions>
         </Dialog>
      </>
   );
};


export default function ProductTable({ shopData, products }: ProductTableProps) {
   const dispatch = useAppDispatch();

   return (
      <TableContainer component={Paper}>
         <Table aria-label="collapsible table" size="small" >
            <TableHead >
               <TableRow sx={{ backgroundColor: '#616161' }}>
                  <TableCell align="left" sx={{ color: '#ffffff' }} >No.</TableCell>
                  <TableCell align="left" sx={{ color: '#ffffff' }} >Code</TableCell>
                  <TableCell align="left" sx={{ color: '#ffffff', paddingTop: '18px', paddingBottom: '18px' }} >Name</TableCell>
                  <TableCell align="left" sx={{ color: '#ffffff' }}>Image</TableCell>
                  <TableCell align="left" sx={{ color: '#ffffff' }}>Catagory</TableCell>
                  <TableCell align="right" sx={{ color: '#ffffff' }}>Sell Price</TableCell>
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
                     rowBgColor={index % 2 === 0 ? '#f5f5f5' : '#e0e0e0'}

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
