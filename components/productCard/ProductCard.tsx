import { Box, Stack } from "@mui/material";
import MUi_card from "../ui.components/MUi_card";

const ProductCard = () => {
   return (
      <Stack
         direction={'row'}
         sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
      >
         {[...Array(11)].map((_, index) => {
            return (
               <Box key={index} p={1}>
                  <MUi_card />
               </Box>
            );
         })}
      </Stack>
   );
};
export default ProductCard;