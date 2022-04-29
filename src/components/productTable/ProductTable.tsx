import * as React from 'react';
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


function createData(
   name: string,
   calories: number,
   fat: number,
   carbs: number,
   protein: number,
   price: number,
) {
   return {
      name,
      calories,
      fat,
      carbs,
      protein,
      price,
      history: [
         {
            date: '2020-01-05',
            customerId: '11091700',
            amount: 3,
         },
         {
            date: '2020-01-02',
            customerId: 'Anonymous',
            amount: 1,
         },
      ],
      img: 'https://images.unsplash.com/photo-1648993219624-2d3535fc6443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1MTA2ODE2Nw&ixlib=rb-1.2.1&q=80&w=1080',
   };
}

function Row(props: { row: ReturnType<typeof createData>; }) {
   const { row } = props;
   const [open, setOpen] = React.useState(false);

   return (
      <React.Fragment>
         <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell component="th" scope="row">
               <Typography variant='body2' >{row.name}</Typography>
               {/* <Typography variant='body2' color='GrayText' >{'category'}</Typography> */}
            </TableCell>
            <TableCell>
               <Avatar alt="product" src={row.img} variant="rounded" />
            </TableCell>
            <TableCell align="right">{'catagory'}</TableCell>
            <TableCell align="right">{row.protein}</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'light' }}>{row.carbs}</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }} >{row.calories}</TableCell>
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
                        <TableBody>
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
                        </TableBody>
                     </Table>
                  </Box>
               </Collapse>
            </TableCell>
         </TableRow>
      </React.Fragment>
   );
}

const rows = [
   createData('Frozen yoghurt', 159, 6.0, 24, 4, 3.99),
   createData('Cupcake', 305, 3.7, 67, 4, 2.5),
   createData('Munch', 262, 16.0, 24, 12, 3.79),
   createData('Ice cream sandwich', 237, 9, 37, 4, 4.99),
   createData('Dark Fantasy', 305, 3.7, 67, 4, 2.5),
   createData('Eclair', 262, 16.0, 24, 16, 3.79),
   createData('KitKat', 356, 16.0, 49, 3, 1.5),
   createData('Gingerbread', 356, 16.0, 49, 3, 1.5),
];

export default function ProductTable() {
   return (
      <TableContainer component={Paper}>
         <Table aria-label="collapsible table">
            <TableHead>
               <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="left">Image</TableCell>
                  <TableCell align="right">Catagory</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Get Price&nbsp;(Rs)</TableCell>
                  <TableCell align="right">Sell Price&nbsp;(Rs)</TableCell>
                  <TableCell />
               </TableRow>
            </TableHead>
            <TableBody>
               {rows.map((row, index) => (
                  <Row key={index} row={row} />
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   );
}
