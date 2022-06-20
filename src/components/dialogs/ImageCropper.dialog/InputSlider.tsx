import {
   Box,
   Grid,
   Stack,
   Typography,
   Slider,
   Input,
   colors,
   Divider,
} from "@mui/material";
import React, { useState, useEffect } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


interface InputSliderProps {
   setScale_prop: React.Dispatch<React.SetStateAction<number>>;
   setRotate_prop: React.Dispatch<React.SetStateAction<number>>;
}

export default function InputSlider({ setScale_prop, setRotate_prop }: InputSliderProps) {
   const [value_scale, setValue_scale] = useState<number | string | Array<number | string>>(1);
   const [value_rotate, setValue_rotate] = useState<number | string | Array<number | string>>(0);


   const handleSliderChange_scale = (event: Event, newValue: number | number[]) => {
      setValue_scale(newValue);
   };
   const handleInputChange_scale = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue_scale(event.target.value === '' ? '' : Number(event.target.value));
   };
   const handleBlur_scale = () => {
      if (value_scale < 0.01) {
         setValue_scale(0.01);
      } else if (value_scale > 3) {
         setValue_scale(3);
      }
   };

   const handleSliderChange_rotate = (event: Event, newValue: number | number[]) => {
      setValue_rotate(newValue);
   };
   const handleInputChange_rotate = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue_rotate(event.target.value === '' ? 0 : Number(event.target.value));
   };
   const handleBlur_rotate = () => {
      if (value_rotate < (-180)) {
         setValue_rotate(-180);
      } else if (value_rotate > 180) {
         setValue_rotate(180);
      }
   };


   useEffect(() => {
      setScale_prop(Number(value_scale));
   }, [value_scale]);

   useEffect(() => {
      setRotate_prop(Number(value_rotate));
   }, [value_rotate]);


   return (
      <Stack
         spacing={1.5}
         direction="row"
         width="100%"
         divider={<Divider orientation="vertical" flexItem />}
      >
         <Box sx={{ width: '50%' }}  >
            {/* Scale Slider */}
            <Stack direction="row" spacing={"auto"} alignItems="center" >
               <Typography variant="body2" id="input-slider" gutterBottom>
                  Scale :
               </Typography>
               <Input
                  value={value_scale}
                  size="small"
                  onChange={handleInputChange_scale}
                  onBlur={handleBlur_scale}
                  inputProps={{
                     step: 0.01,
                     min: 0.01,
                     max: 3,
                     type: 'number',
                     'aria-labelledby': 'input-slider',
                  }}
               />
            </Stack>
            <Grid container spacing={0.5} pt={1} alignItems="center">
               <Grid item>
                  <RemoveIcon fontSize="small" sx={{ color: colors.grey[600] }} />
               </Grid>
               <Grid item xs>
                  <Slider
                     size="small"
                     step={0.01}
                     min={0.01}
                     max={3}
                     value={typeof value_scale === 'number' ? value_scale : 1}
                     onChange={handleSliderChange_scale}
                     aria-labelledby="input-slider"
                  />
               </Grid>
               <Grid item >
                  <AddIcon fontSize="small" sx={{ color: colors.grey[600] }} />
               </Grid>
            </Grid>
         </Box>

         {/* Rotate Slider */}
         <Box sx={{ width: '50%' }}  >
            <Stack direction="row" spacing={"auto"} alignItems="center" >
               <Typography variant="body2" id="input-slider" gutterBottom>
                  Rotate&deg; :
               </Typography>
               <Input
                  value={value_rotate}
                  size="small"
                  onChange={handleInputChange_rotate}
                  onBlur={handleBlur_rotate}
                  inputProps={{
                     step: 1,
                     min: -180,
                     max: 180,
                     type: 'number',
                     'aria-labelledby': 'input-slider',
                  }}
               />
            </Stack>
            <Grid container spacing={0.5} pt={1} alignItems="center">
               <Grid item>
                  <RemoveIcon fontSize="small" sx={{ color: colors.grey[600] }} />
               </Grid>
               <Grid item xs>
                  <Slider
                     size="small"
                     step={1}
                     min={-180}
                     max={180}
                     value={typeof value_rotate === 'number' ? value_rotate : 0}
                     onChange={handleSliderChange_rotate}
                     aria-labelledby="input-slider"
                  />
               </Grid>
               <Grid item >
                  <AddIcon fontSize="small" sx={{ color: colors.grey[600] }} />
               </Grid>
            </Grid>
         </Box>
      </Stack>
   );
}