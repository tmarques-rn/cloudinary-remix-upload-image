import type { ActionFunctionArgs, LinksFunction } from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData, useRouteError } from "@remix-run/react";

import { uploadImage } from "utils/utils.server";

import stylesUrl from "styles/forms.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const action = async ({ request }: ActionFunctionArgs) => {
  const uploadHandler = composeUploadHandlers(async ({ name, data }) => {
    if (name !== "img") {
      return undefined;
    }
    try {
      const uploadedImage = await uploadImage(data, "remixImages");
      return uploadedImage.secure_url;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }, createMemoryUploadHandler());

  const formData = await parseMultipartFormData(request, uploadHandler);
  const imgSource = formData.get("img");
  const imgDescription = formData.get("description");

  if (!imgSource) {
    return json({
      error: "something is wrong",
    });
  }
  return json({
    imgSource,
    imgDescription,
  });
};

export default function Cloudinary() {
  const data = useActionData<{
    imgSource: string;
    imgDescription: string;
    error?: string;
  }>();
  return (
    <>
      <Form method="post" encType="multipart/form-data" id="upload-form">
        <div>
          <label htmlFor="img"> Image: </label>
          <input id="img" type="file" name="img" accept="image/*" />
        </div>
        <div>
          <label htmlFor="description"> Image description: </label>
          <input id="description" type="text" name="description" />
        </div>
        <div>
          <button type="submit"> Upload to Cloudinary </button>
        </div>
      </Form>

      {data?.error && <h3>{data.error}</h3>}
      {data?.imgSource && (
        <>
          <h2>Uploaded Image: </h2>
          <img
            src={data.imgSource}
            alt={data.imgDescription || "Upload result"}
          />
          <p>{data.imgDescription}</p>
        </>
      )}
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (error instanceof Error) {
    return (
      <div className="error-container">
        <pre>{error.message}</pre>
      </div>
    );
  } else {
    return <pre>Unknown Error</pre>;
  }
}
