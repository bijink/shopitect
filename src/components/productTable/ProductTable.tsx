import type { ProdDetailsProps, ProdDetailsTypes } from './product.types';

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
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { collection, deleteDoc, doc, DocumentData, onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../../config/firebase.config';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectShopDetails } from '../../redux/slices/shopDetails.slice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditModal_productTable from './EditModal.productTable';


const Row = ({ rowBgColor, shopUrlName, prodId, prodCodeName, prodName, prodCategory, prodBrand, prodImg, quantity, getPrice, sellPrice, profitAmount, profitPercentage }: ProdDetailsProps) => {
   const [open, setOpen] = useState(false);


   const moreDetails = [
      {
         title: 'Quantity',
         value: quantity,
      },
      {
         title: 'Brand',
         value: prodBrand,
      },
      {
         title: 'Get Price (Rs)',
         value: getPrice,
      },
      {
         title: 'Profit Percentage (%)',
         value: profitPercentage + ' %',
      },
      {
         title: 'Profit Amount (Rs)',
         value: profitAmount,
      },
   ];


   const handleProdRemove = async () => {
      await deleteDoc(doc(database, "shops", shopUrlName, "products", prodId));
   };


   return (
      <>
         <TableRow sx={{ '& > *': { backgroundColor: rowBgColor, borderBottom: 'unset', borderTop: '1.05px solid gray' } }} >
            <TableCell component="th" scope="row" align="left" sx={{ fontWeight: 'bold' }} >{prodCodeName}</TableCell>
            <TableCell component="th" scope="row" align="left" sx={{ fontWeight: '500' }} >{prodName}</TableCell>
            <TableCell>
               <Avatar alt="product" src={prodImg} variant="rounded" />
            </TableCell>
            <TableCell align="left" >{prodCategory}</TableCell>
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
                                 <EditModal_productTable
                                    shopUrlName={shopUrlName}
                                    prodId={prodId}
                                    prodCodeName={prodCodeName}
                                    prodName={prodName}
                                    // prodImg={'https://images.unsplash.com/photo-1648993219624-2d3535fc6443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1MTA2ODE2Nw&ixlib=rb-1.2.1&q=80&w=1080'}
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


const ProductTable = () => {
   const shopDetails = useAppSelector(selectShopDetails);

   const [prodDetails, setProdDetails] = useState<DocumentData>([]);


   useEffect(() => {
      (shopDetails.urlName) && (
         onSnapshot(query(collection(database, 'shops', shopDetails.urlName, 'products'), orderBy('codeName')), (snapshot) => {
            setProdDetails(snapshot.docs);
         })
      );
   }, [database, shopDetails.urlName]);


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
               {prodDetails.map((prod: ProdDetailsTypes, index: number) => (
                  <Row
                     key={index}
                     rowBgColor={index % 2 === 0 ? '#f5f5f5' : '#e0e0e0'}

                     shopUrlName={shopDetails.urlName}
                     prodId={prod.id}
                     prodCodeName={prod.data().codeName}
                     prodName={prod.data().name}
                     prodImg={'https://images.unsplash.com/photo-1648993219624-2d3535fc6443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1MTA2ODE2Nw&ixlib=rb-1.2.1&q=80&w=1080'}
                     prodBrand={prod.data().brand}
                     prodCategory={prod.data().category}
                     quantity={prod.data().quantity}
                     getPrice={prod.data().getPrice}
                     sellPrice={prod.data().sellPrice}
                     profitAmount={prod.data().profitAmount}
                     profitPercentage={prod.data().profitPercentage}
                  />
               ))}
            </TableBody>
         </Table>
      </TableContainer >
   );
};

export default ProductTable;
