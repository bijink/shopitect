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
import { collection, DocumentData, onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../../config/firebase.config';
import { useEffect, useState } from 'react';
import { ProdDetailsProps, ProdDetailsTypes } from './product.types';
import { useAppSelector } from '../../redux/hooks';
import { selectShopDetails } from '../../redux/slices/shopDetails.slice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const Row = ({ rowBgColor, prodCodeName, prodName, prodCategory, prodBrand, prodImg, quantity, getPrice, sellPrice, profitAmount, profitPercentage }: ProdDetailsProps) => {
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
         title: 'GetPrice (Rs)',
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


   return (
      <>
         <TableRow sx={{ '& > *': { backgroundColor: rowBgColor, borderBottom: 'unset', borderTop: '1.05px solid gray' } }} >
            <TableCell component="th" scope="row" align="left" sx={{ fontWeight: 'bold' }} >{prodCodeName}</TableCell>
            <TableCell component="th" scope="row" align="left" colSpan={3} sx={{ fontWeight: 'bold' }} >{prodName}</TableCell>
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
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7} >
               <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
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

            <TableCell sx={{ padding: '0' }} style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={1} >
               <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }} >
                     <Table size="small" aria-label="purchases"
                        sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none" } }}
                     >
                        <TableBody  >
                           <TableRow  >
                              <TableCell component="th" scope="row" align="center"  >
                                 <Tooltip title="Edit" placement="left" arrow >
                                    <IconButton size='small' sx={{ backgroundColor: 'orange' }} >
                                       <EditIcon />
                                    </IconButton>
                                 </Tooltip>
                              </TableCell>
                           </TableRow>
                           <TableRow >
                              <TableCell component="th" scope="row" align="center"  >
                                 <Tooltip title="Delete" placement="left" arrow >
                                    <IconButton size='small' sx={{ backgroundColor: 'red' }} >
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
   // console.log(prodDetails);


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
                  <TableCell align="left" sx={{ color: '#ffffff', paddingTop: '18px', paddingBottom: '18px' }} colSpan={3} >Name</TableCell>
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
                  // createdAt={prod.data().createdAt.toDate().toString().slice(0, 15)}
                  />
               ))}
            </TableBody>
         </Table>
      </TableContainer >
   );
};

export default ProductTable;
