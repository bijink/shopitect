import Head from "next/head";
import { usePathname, useRouter } from "next/navigation";
import { useShop } from "../../hooks";

const ShopPagesHead = ({ title = "" }: { title: string }) => {
  const router = useRouter();
  // const { shopAppUrl } = router.query;
  const pathname = usePathname();
  const routename = pathname.slice(1).split("/");

  const shopAppUrl = routename[0];

  const { data: shop, secure } = useShop(shopAppUrl);

  return (
    <Head>
      <title>{shop ? `${title} · ${shop.name}` : secure !== 404 ? "Loading..." : "404"}</title>
      <meta name='description' content={shop?.category} />
      <meta property='og:title' content={shop?.name} key='title' />
      <link rel='icon' type='image/*' href={shop ? shop.logoUrl : "/img/loading-blank-logo.png"} />
    </Head>
  );
};

export default ShopPagesHead;
