import { Typography } from "@mui/material";
import { useEffect } from "react";
import InfoPage_layout from "../../../layouts/InfoPage.layout";
import { useAppDispatch } from "../../../redux/hooks";
import { setAppPageId } from "../../../redux/slices/pageId.slice";

const About = () => {
   const dispatch = useAppDispatch();


   useEffect(() => {
      dispatch(setAppPageId('about_page'));
   }, []);


   return (
      <InfoPage_layout>
         <Typography variant="h4" gutterBottom >About Us</Typography>
         <Typography variant="body1" >Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem nihil excepturi doloribus doloremque iure odio enim aliquam porro hic! Rem rerum, cupiditate nisi voluptas consequatur esse distinctio repudiandae est expedita ducimus beatae! Provident ad ipsum cumque? Officiis, quae omnis. Sint a laudantium neque itaque, aliquam quos reiciendis autem esse recusandae, in perferendis aut aperiam officiis? Dolor excepturi impedit corrupti debitis, cum vitae reiciendis culpa officiis. Deserunt, voluptatibus voluptates harum omnis iure maiores unde autem at facere impedit illum necessitatibus rem, molestias sapiente veritatis natus excepturi? Obcaecati vitae nostrum totam officia minus laboriosam, non illum sunt explicabo ullam quia porro reprehenderit.</Typography>
      </InfoPage_layout>
   );
};

export default About;
