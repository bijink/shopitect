import { Box, Typography, Container, Stack } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useShop } from "../../hooks";

const Footer = () => {
  // const router = useRouter();
  // const { shopAppUrl } = router.query;
  const pathname = usePathname();
  const routename = pathname.slice(1).split("/");

  const shopAppUrl = routename[0];
  // console.log("params", { shopAppUrl });

  const { data: shop } = useShop(shopAppUrl);

  const shopYear = shop?.createdAt && new Date(shop.createdAt.seconds * 1000).getFullYear();

  return (
    <Box width={"100%"} py={5}>
      <Container maxWidth='xs' sx={{ display: "flex", justifyContent: "center" }}>
        <Stack>
          {shopYear && (
            <Typography variant='body1'>
              Copyright © {shopYear} {shop?.name}
            </Typography>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
