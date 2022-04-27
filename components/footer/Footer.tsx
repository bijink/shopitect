import {
   Box,
   Typography,
   Container
} from "@mui/material";


const Footer = () => {
   return (
      <Box width={'100%'} bgcolor="gray">
         <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h2" >Footer</Typography>
         </Container>
      </Box>
   );
};

export default Footer;
