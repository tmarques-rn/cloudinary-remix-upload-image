import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Upload image" },
    {
      name: "description",
      content: "Example of uploading images to Cloudinary",
    },
  ];
};

export default function Index() {
  return (
    <div>
      <h1> Remix image upload </h1>
      <p>This is a Remix app for uploading images to cloudinary</p>
      <Link to="/cloudinary-upload"> Upload Images here </Link>
    </div>
  );
}
