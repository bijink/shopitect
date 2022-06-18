import type { ShopData } from "../../types/global.types";

import { Typography, colors, Stack, Box } from "@mui/material";


const About_page = ({ shopData }: { shopData: ShopData; }) => {
   return (
      <>
         <Typography variant="h5" component="p" gutterBottom >About Us</Typography>
         {(shopData) && (
            <>
               <Typography variant="h6" component="p" >{shopData.name} - {shopData.category}</Typography>
               <Typography variant="subtitle2" component="p" pb={2} fontWeight="800" color={colors.grey[700]} >Owned by: {shopData.ownerName}</Typography>
               {shopData.about && (
                  <Stack direction="column" pb={2} >
                     {shopData.about.split('\n').map((str: string, index: number) => (
                        <Typography key={index} variant="body2" component="p" >{str}</Typography>
                     ))}
                  </Stack>
               )}
               <Box>
                  {shopData.address && shopData.address.split('\n').map((str: string, index: number) => (
                     <Typography key={index} variant="subtitle2" component="p" >{str}</Typography>
                  ))}
               </Box>
            </>
         )}
      </>
   );
};

export default About_page;
