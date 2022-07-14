import { Alert, SlideProps, Slide, Snackbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectSnackbarState, setSnackbarState } from '../../redux/slices/snackbarState.slice';


const SnackbarSlideTransition = (props: SlideProps) => <Slide {...props} direction="down" />;

export default function Snackbars() {
   const dispatch = useAppDispatch();
   const { id, open, message } = useAppSelector(selectSnackbarState);

   return (
      <Snackbar
         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
         open={open}
         onClose={() => dispatch(setSnackbarState({ id: id, open: false, message: message }))}
         autoHideDuration={3000}
         TransitionComponent={SnackbarSlideTransition}
         sx={{ marginTop: '3rem' }}
      >
         <Alert
            severity="success"
            onClose={() => dispatch(setSnackbarState({ id: id, open: false, message: message }))}
            sx={{ width: '100%', backgroundColor: '#a5d6a7' }}
         >
            {message}
         </Alert>
      </Snackbar >
   );
};
