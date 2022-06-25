// *dashboard page
import type { NextPage } from "next";

import { useRouter } from "next/router";
import ShopPagesHead from "../../../components/shopPagesHead";
import { useShop } from "../../../hooks";
import { PageSkeleton_layout, Page_layout } from "../../../layouts";
import Forbidden from "../../403";
import NotFound from "../../404";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { setAppPageId } from "../../../redux/slices/pageId.slice";
import { ShopAdmin_navBar } from "../../../components/navBar";
import { ShopAdmin_sideBar } from "../../../components/sideBar";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Box, capitalize, CircularProgress, colors, Divider, IconButton, Stack, Typography } from "@mui/material";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { collection, DocumentData, onSnapshot, query } from "firebase/firestore";
import { database } from "../../../config/firebase.config";
import { ShopAdmin_btmNavbar } from "../../../components/bottomNavBar";


ChartJS.register(ArcElement, Tooltip, Legend);


const Dashboard: NextPage = () => {
   const router = useRouter();
   const { shopAppUrl } = router.query;

   const dispatch = useAppDispatch();

   const { secure } = useShop(shopAppUrl);

   // const [prodDetails, setProdDetails] = useState<DocumentData>([]);
   const [prodDocLength, setProdDocLength] = useState<null | number>(null);
   const [chartLabel, setChartLabel] = useState<string[]>([]);
   const [chartData, setChartData] = useState<string[]>([]);
   const [chartColor, setChartColor] = useState<string[]>([]);
   const [chartLength, setChartLength] = useState(0);


   const getRgbColors = (limit: number) => {
      let colors: string[] = [];
      const rgbValue = () => Math.floor(Math.random() * 256);
      for (let i = 0; i < limit; i++) {
         colors.push(`rgb(${rgbValue()}, ${rgbValue()}, ${rgbValue()})`);
      }
      return colors;
   };

   const getChartDatas = useCallback((arrList: Array<string>) => {
      let categData: any = {};
      for (let i = 0; i < arrList.length; i++) {
         if (categData[arrList[i]]) {
            categData[arrList[i]] += 1;
         } else {
            categData[arrList[i]] = 1;
         }
      }

      setChartLabel(Object.keys(categData));
      setChartData(Object.values(categData));
      setChartLength(Object.keys(categData).length);
      setChartColor(getRgbColors(Object.keys(categData).length));
   }, []);


   const datas = {
      labels: chartLabel,
      datasets: [
         {
            label: '# of Product items by category',
            data: chartData,
            backgroundColor: chartColor,
            // borderColor: chartColor,
            borderWidth: 1,
         },
      ],
   };


   useEffect(() => {
      shopAppUrl && onSnapshot(query(collection(database, 'shops', shopAppUrl.toString(), 'products')), (snapshot) => {
         // setProdDetails(snapshot.docs);
         setProdDocLength(snapshot.docs.length);

         let categList: Array<string> = [];
         snapshot.docs.forEach((obj: DocumentData) => {
            categList.push(capitalize(obj.data().category.toLowerCase()));
         });
         const sortCategList = categList.sort();

         getChartDatas(sortCategList);
      });
   }, [shopAppUrl, getChartDatas]);

   useEffect(() => {
      dispatch(setAppPageId('dashboard_page'));
   }, [dispatch]);


   return (
      <>
         <ShopPagesHead title="Dashboard" />

         {((secure === 'loading') && (
            <PageSkeleton_layout />
         )) || ((secure === 404) && (
            <NotFound />
         )) || ((secure === 200) && (
            <Page_layout navbar={<ShopAdmin_navBar />} sidebar={<ShopAdmin_sideBar />} btmNavbar={<ShopAdmin_btmNavbar />} >
               <Stack direction='row' pb={2} >
                  <Typography variant="h5" component='p' >Dashboard</Typography>
               </Stack>

               {((prodDocLength! > 0) || (prodDocLength === null)) ? (
                  <Stack alignItems="center" >
                     {(chartLength > 0) ? (
                        <Stack width="100%" spacing={2}>
                           <Stack
                              direction="row"
                              divider={<Divider orientation="vertical" flexItem />}
                              justifyContent="space-evenly"
                              alignItems="center"
                              width='85%'
                              height='5rem'
                              bgcolor={colors.grey[300]}
                              mx="auto"
                              borderRadius={1.5}
                           >
                              <Typography component="p" fontSize={{ xs: '1rem', sm: '1.5rem' }}  >
                                 Product:
                                 <Typography component="span" fontSize={{ xs: '1.5rem', sm: '2rem' }} pl={1} fontWeight={600} >
                                    {prodDocLength}
                                 </Typography>
                              </Typography>
                              <Typography component="p" fontSize={{ xs: '1rem', sm: '1.5rem' }} >
                                 Category:
                                 <Typography component="span" fontSize={{ xs: '1.5rem', sm: '2rem' }} pl={1} fontWeight={600} >
                                    {chartLength}
                                 </Typography>
                              </Typography>
                           </Stack>
                           <Box display="flex" justifyContent="center"  >
                              <Stack width="25rem" spacing={3} alignItems="center" sx={{ cursor: 'pointer' }} >
                                 <Doughnut data={datas} />
                                 <Box>
                                    <IconButton
                                       color="primary"
                                       size="small"
                                       onClick={() => setChartColor(getRgbColors(chartLength))}
                                    >
                                       <RefreshOutlinedIcon />
                                    </IconButton>
                                 </Box>
                              </Stack>
                           </Box>
                        </Stack>
                     ) : (
                        <Box>
                           <CircularProgress />
                        </Box>
                     )}
                  </Stack>
               ) : (
                  <Typography variant="h6" component="p" textAlign="center" >Data is empty</Typography>
               )}
            </Page_layout>
         )) || (((secure === 401) || (secure === 403)) && (
            <Forbidden />
         ))}
      </>
   );
};

export default Dashboard;
