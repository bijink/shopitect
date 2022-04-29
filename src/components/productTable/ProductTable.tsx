import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Avatar } from '@mui/material';
import { collection, DocumentData, onSnapshot } from 'firebase/firestore';
import { database } from '../../config/firebase.config';
import { useEffect, useState } from 'react';
import { ProdDetailsProps, ProdDetailsTypes } from './product.types';


const Row = ({ prodName, prodCategory, prodCompany, prodImg, quantity, getPrice, sellPrice }: ProdDetailsProps) => {
   const [open, setOpen] = useState(false);


   return (
      <>
         <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell component="th" scope="row">
               <Typography variant='body2' >{prodName}</Typography>
            </TableCell>
            <TableCell>
               <Avatar alt="product" src={prodImg} variant="rounded" />
            </TableCell>
            <TableCell align="right">{prodCategory}</TableCell>
            <TableCell align="right">{quantity}</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'light' }}>{getPrice}</TableCell>
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
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
               <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                     <Typography variant="h6" gutterBottom component="div">
                        History
                     </Typography>
                     <Table size="small" aria-label="purchases">
                        <TableHead>
                           <TableRow>
                              <TableCell>Date</TableCell>
                              <TableCell>Customer</TableCell>
                              <TableCell align="right">Amount</TableCell>
                              <TableCell align="right">Total price ($)</TableCell>
                           </TableRow>
                        </TableHead>
                        {/* <TableBody>
                           {row.history.map((historyRow) => (
                              <TableRow key={historyRow.date}>
                                 <TableCell component="th" scope="row">
                                    {historyRow.date}
                                 </TableCell>
                                 <TableCell>{historyRow.customerId}</TableCell>
                                 <TableCell align="right">{historyRow.amount}</TableCell>
                                 <TableCell align="right">
                                    {Math.round(historyRow.amount * row.price * 100) / 100}
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody> */}
                     </Table>
                  </Box>
               </Collapse>
            </TableCell>
         </TableRow>
      </>
   );
};


const ProductTable = () => {
   const [prodDetails, setProdDetails] = useState<DocumentData>([]);

   useEffect(() => {
      onSnapshot(collection(database, 'products'), (snapshot) => {
         setProdDetails(snapshot.docs);
      });
   }, [database]);


   return (
      <TableContainer component={Paper}>
         <Table aria-label="collapsible table">
            <TableHead>
               <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="left">Image</TableCell>
                  <TableCell align="right">Catagory</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Get Price&nbsp;(Rs)</TableCell>
                  <TableCell align="right">Sell Price&nbsp;(Rs)</TableCell>
                  <TableCell />
               </TableRow>
            </TableHead>
            <TableBody>
               {prodDetails.map((prod: ProdDetailsTypes, index: number) => (
                  <Row
                     key={index}
                     prodName={prod.data().prodName}
                     prodImg={'https://images.unsplash.com/photo-1648993219624-2d3535fc6443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1MTA2ODE2Nw&ixlib=rb-1.2.1&q=80&w=1080'}
                     prodCompany={prod.data().prodCompany}
                     prodCategory={prod.data().prodCategory}
                     quantity={prod.data().quantity}
                     getPrice={prod.data().getPrice}
                     sellPrice={prod.data().sellPrice}
                  />
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   );
};

export default ProductTable;
