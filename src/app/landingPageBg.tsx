import Box from '@mui/material/Box';

export default function LandingPageBg() {
  return (
    <>
      <Box
        width={300}
        height={350}
        position={'absolute'}
        top={-30}
        left={-60}
        sx={{ backgroundColor: '#1c90e8', filter: 'blur(250px)' }}
      ></Box>
      <Box
        width={300}
        height={300}
        position={'absolute'}
        bottom={0}
        right={-60}
        sx={{ backgroundColor: '#f89b1a', filter: 'blur(225px)' }}
      ></Box>
    </>
  );
}
