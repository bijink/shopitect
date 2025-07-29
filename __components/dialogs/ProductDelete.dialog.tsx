import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  colors,
} from '@mui/material';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';

import type { ProductDeleteProps } from './dialogs.types';

import { useAppDispatch } from '../../__redux/hooks';
import { changeProdTableCollapse } from '../../__redux/slices/prodTableCollapse.slice';
import { setSnackbarState } from '../../__redux/slices/snackbarState.slice';
import { database, storage } from '../../src/config/firebase.config';

export default function ProductDelete_dialog({ shopUrlName, prodId }: ProductDeleteProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading_remove, setLoading_remove] = useState(false);

  const dispatch = useAppDispatch();

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleProdRemove = async () => {
    setLoading_remove(true);
    dispatch(changeProdTableCollapse());

    const imageRef = ref(storage, `/${shopUrlName}/product-images/PRODUCT_IMG:${prodId}`);
    await deleteObject(imageRef)
      .then(() => {
        deleteDoc(doc(database, 'shops', shopUrlName, 'products', prodId)).then(() => {
          handleDialogClose();
          setLoading_remove(false);
          dispatch(
            setSnackbarState({
              id: 'prod_remove',
              open: true,
              message: 'Product successfully removed...',
            }),
          );
        });
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.error(error.messageh);
      });
  };

  return (
    <Box>
      <Tooltip title="Remove" placement="left" arrow>
        <IconButton size="small" sx={{ color: 'red' }} onClick={handleDialogOpen}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Remove this product?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Doing so will permanently remove the data of this product.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: colors.grey[600] }} onClick={handleDialogClose}>
            cancel
          </Button>
          <LoadingButton
            color="error"
            onClick={handleProdRemove}
            loadingPosition="center"
            loading={loading_remove}
          >
            remove
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
