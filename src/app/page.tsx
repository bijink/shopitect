import LandingPageBg from '@/app/landingPageBg';
import LandingPageBtn from '@/app/landingPageBtn';
import LandingPageLogo from '@/app/landingPageLogo';
import { App_about, App_help } from '@/components/dialogs';
import GitHubIcon from '@mui/icons-material/GitHub';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Page() {
  return (
    <Box height={'100vh'} position={'relative'} overflow={'hidden'}>
      <LandingPageBg />
      <Stack justifyContent={'center'} alignItems={'center'} height={'100svh'}>
        <Stack height={'100%'} justifyContent={'center'} alignItems={'center'} textAlign={'center'}>
          <LandingPageLogo />
          <Typography fontSize={{ xs: '1.5rem', sm: '3rem' }} component={'h1'}>
            Welcome to <b>Shopitect</b>
          </Typography>
          <Typography variant={'body1'}>An architect of shop management application</Typography>
          <LandingPageBtn />
        </Stack>
        {/* FOOTER */}
        <Box component={'footer'} py={5}>
          <Container maxWidth={'xs'} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack alignItems={'center'} textAlign={'center'}>
              <Stack spacing={1} direction={'row'} justifyContent={'center'} pb={0.5}>
                <App_about />
                <App_help />
              </Stack>
              <MuiLink
                href="https://github.com/bijink/shopitect"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon style={{ color: 'black' }} />
              </MuiLink>
              <Typography variant={'body2'}>
                Copyright © 2024&nbsp;
                <MuiLink
                  href="https://bijink.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'black',
                    textDecoration: 'none',
                    ':hover': { cursor: 'pointer', textDecoration: 'underline' },
                  }}
                >
                  Bijin Kandengala
                </MuiLink>
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Stack>
    </Box>
  );
}
