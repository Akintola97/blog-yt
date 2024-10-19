import { client } from "@/sanity/lib/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import HeroBlogData from "./HeroBlogData";

async function getData() {
  const query = `*[_type == 'post']{
        _id,
          title,
          "slug": slug.current,
          description,
          "mainImageUrl": mainImage.asset->url,
            imageUrl,
          author,
          dateCreated,
          category,
          content
      }`;

      const data = await client.fetch(query);
      return data;
}

export default async function HeroData() {
    const {isAuthenticated} = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();

const data = await getData();


  return (
  <HeroBlogData data = {data} isUserAuthenticated = {isUserAuthenticated}/>
);
}
