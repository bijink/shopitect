import React, { useState, useRef } from 'react';
import {
   Box,
   Button,
   Stack,
   TextField,
   Typography,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
} from "@mui/material";
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import useDebounceEffect from './useDebounceEffect';
import canvasPreview from './canvasPreview';
import croppedImgData from './croppedImgData';
import InputSlider from './InputSlider';
import Image from 'next/image';

import 'react-image-crop/dist/ReactCrop.css';


// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
   mediaWidth: number,
   mediaHeight: number,
   aspect: number,
) {
   return centerCrop(
      makeAspectCrop(
         {
            unit: '%',
            width: 90,
         },
         aspect,
         mediaWidth,
         mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
   );
}


export default function ImageCropper(
   { inputLabel, getBlob }: {
      inputLabel?: string;
      getBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
   }
) {
   const imgRef = useRef<HTMLImageElement>(null);
   const previewCanvasRef = useRef<HTMLCanvasElement>(null);

   const [open, setOpen] = React.useState(false);
   const [imgSrc, setImgSrc] = useState('');
   const [crop, setCrop] = useState<Crop>();
   const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
   const [scale, setScale] = useState(1);
   const [rotate, setRotate] = useState(0);
   const [aspect, setAspect] = useState<number | undefined>(1 / 1);
   const [hasImgSrcInput, setHasImgSrcInput] = useState(false);
   const [previewSrc, setPreviewSrc] = useState('');


   const handleClickOpen = () => {
      setOpen(true);
   };
   const handleClose = () => {
      setOpen(false);
   };


   useDebounceEffect(
      async () => {
         if (
            completedCrop?.width &&
            completedCrop?.height &&
            imgRef.current &&
            previewCanvasRef.current
         ) {
            // We use canvasPreview as it's much faster than imgPreview.
            canvasPreview(
               imgRef.current,
               previewCanvasRef.current,
               completedCrop,
               scale,
               rotate,
            );
         }
      },
      100,
      [completedCrop, scale, rotate],
   );


   function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
      (e.target.files?.length! > 0) ? setHasImgSrcInput(true) : setHasImgSrcInput(false);
      setPreviewSrc('');
      getBlob(null);

      if (e.target.files && e.target.files.length > 0) {
         setCrop(undefined); // Makes crop preview update between images.
         const reader = new FileReader();
         reader.addEventListener('load', () =>
            setImgSrc(reader?.result?.toString() || ''),
         );
         reader.readAsDataURL(e.target.files[0]);
      }
   };

   function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
      if (aspect) {
         const { width, height } = e.currentTarget;
         setCrop(centerAspectCrop(width, height, aspect));
      }
   }

   // ?:
   // const getCanvasBlob = async (
   //    canvas: HTMLCanvasElement,
   //    type?: string,
   //    quality?: number
   // ): Promise<Blob> => {
   //    return new Promise((resolve, reject) => {
   //       canvas.toBlob((blob) => resolve(blob!), type, quality);
   //    });
   // };

   // useDebounceEffect(
   //    async () => {
   //       if (hasImgSrcInput && previewCanvasRef.current) {
   //          getCanvasBlob(previewCanvasRef.current, 'image/webp', 0.8).then((response) => {
   //             // console.log('blob', response);
   //             croppedImage(response);
   //          });
   //       } else {
   //          croppedImage(null);
   //       }
   //    },
   //    100,
   //    [hasImgSrcInput, completedCrop, scale, rotate],
   // );

   // const getFinalBlob = async () => {
   //    // ?:
   //    // const dataUrl = previewCanvasRef.current?.toDataURL('image/webp', 0.9);
   //    // console.log(dataUrl);

   //    // // #1
   //    // // #Taken from https://stackoverflow.com/a/5100158/3702797
   //    // function dataURItoBlob(dataURI: any) {
   //    //    var byteString;
   //    //    if (dataURI.split(',')[0].indexOf('base64') >= 0)
   //    //       // byteString = atob(dataURI.split(',')[1]);
   //    //       byteString = window.atob(dataURI.split(',')[1]);
   //    //    else
   //    //       // byteString = unescape(dataURI.split(',')[1]);
   //    //       byteString = decodeURI(dataURI.split(',')[1]);
   //    //    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
   //    //    var ia = new Uint8Array(byteString.length);
   //    //    for (var i = 0; i < byteString.length; i++) {
   //    //       ia[i] = byteString.charCodeAt(i);
   //    //    }
   //    //    return new Blob([ia], { type: mimeString });
   //    // }
   //    // const compressedImg = dataURItoBlob(dataUrl);

   //    // // #2
   //    // // #Taken form https://stackoverflow.com/a/11954337/15059907
   //    // function dataURItoBlob(dataURI: any) {
   //    //    var binary = window.atob(dataURI.split(',')[1]);
   //    //    var array = [];
   //    //    for (var i = 0; i < binary.length; i++) {
   //    //       array.push(binary.charCodeAt(i));
   //    //    }
   //    //    // return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
   //    //    return new Blob([new Uint8Array(array)], { type: 'image/webp' });
   //    //    // return new Blob([new Uint8Array(array)]);
   //    // }
   //    // const compressedImg = dataURItoBlob(dataUrl);
   //    // #3
   //    // #Taken form https://stackoverflow.com/a/42458980/15059907
   //    const getCanvasBlob = async (
   //       canvas: HTMLCanvasElement,
   //       type?: string,
   //       quality?: number
   //       ): Promise<Blob> => {
   //          return new Promise((resolve, reject) => {
   //          canvas.toBlob((blob) => resolve(blob!), type, quality);
   //       });
   //    };
   //    getCanvasBlob(previewCanvasRef.current!, 'image/webp', 0.8).then((response) => {
   //       // console.log('blob', response);
   //       croppedImage(response);
   //    });
   // };
   // ?:

   const getCroppedImgData = async () => {
      await croppedImgData(
         imgRef.current!,
         completedCrop!,
         scale,
         rotate,
         'image/webp',
         0.8
      ).then((response) => {
         getBlob(response.blob);
         setPreviewSrc(response.previewUrl);
      });
   };


   const descriptionElementRef = React.useRef<HTMLElement>(null);
   React.useEffect(() => {
      if (open) {
         const { current: descriptionElement } = descriptionElementRef;
         if (descriptionElement !== null) {
            descriptionElement.focus();
         }
      }
   }, [open]);


   return (
      <>
         <Stack direction="column" spacing={2} >
            <Stack direction="row" spacing={{ xs: 1, sm: 2 }} width="100%" alignItems="center" >
               {inputLabel && (
                  <Typography
                     variant="body1"
                     component="p"
                     sx={{ whiteSpace: 'nowrap' }}
                  >
                     {inputLabel}&nbsp;:
                  </Typography>
               )}
               <TextField
                  type="file"
                  size="small"
                  fullWidth
                  inputProps={{ accept: "image/*" }}
                  onChange={onSelectFile}
               />
               <Button
                  children="crop"
                  variant='contained'
                  disabled={!hasImgSrcInput}
                  onClick={handleClickOpen}
               />
            </Stack>

            {(hasImgSrcInput && previewSrc) && (
               <Box width={{ xs: '30%', sm: '15%' }} >
                  <Image
                     alt="Crop preview"
                     src={previewSrc}
                     width={150}
                     height={150}
                     layout='responsive'
                     style={{ borderRadius: '50%' }}
                  />
               </Box>
            )}
         </Stack>

         <Dialog
            open={open}
            onClose={handleClose}
            scroll='paper'
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
         >
            <DialogTitle id="scroll-dialog-title">Crop Image</DialogTitle>
            <DialogContent dividers >
               <Stack direction="column" spacing={2}>
                  {(hasImgSrcInput) && (
                     <Stack direction="column" spacing={2}>
                        <InputSlider setScale_prop={setScale} setRotate_prop={setRotate} />

                        <Stack direction="row" spacing={2} >
                           {Boolean(imgSrc) && (
                              <Box width='50%' >
                                 <ReactCrop
                                    crop={crop}
                                    circularCrop
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspect}
                                 >
                                    <img
                                       ref={imgRef}
                                       alt="Crop me"
                                       src={imgSrc}
                                       style={{
                                          transform: `scale(${scale}) rotate(${rotate}deg)`
                                       }}
                                       onLoad={onImageLoad}
                                    />
                                 </ReactCrop>
                              </Box>
                           )}
                           {Boolean(completedCrop) && (
                              <Box width="50%" display="flex" justifyContent="center" alignItems="center" >
                                 <canvas
                                    ref={previewCanvasRef}
                                    style={{
                                       border: '1px solid black',
                                       borderRadius: '50%',
                                       objectFit: 'contain',
                                       width: completedCrop?.width,
                                       height: completedCrop?.height,
                                    }}
                                 />
                              </Box>
                           )}
                        </Stack>
                     </Stack>
                  )}
               </Stack>
            </DialogContent>
            <DialogActions>
               <Button children="cancel" onClick={handleClose} />
               <Button children="crop" onClick={() => { handleClose(), getCroppedImgData(); }} />
            </DialogActions>
         </Dialog>
      </>
   );
}
