import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

console.log("Vercel url: ", process.env.NEXT_PUBLIC_VERCEL_URL);
const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL
  : "http://localhost:3000";

const alice = fetch(
  new URL("../../assets/Alice-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const cardo = fetch(
  new URL("../../assets/Cardo-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const aliceFontData = await alice;
    const cardoFontData = await cardo;

    const hasQuote = searchParams.has("quote");
    const hasAuthor = searchParams.has("author");
    const quote = hasQuote ? searchParams.get("quote") : "This is a quote";
    const author = hasAuthor ? searchParams.get("author") : "Author";

    return new ImageResponse(
      (
        <div
          tw="flex justify-center items-center border w-[1080px] h-[1080px]"
          style={{
            fontFamily: "Alice",
            backgroundImage: `url('${BASE_URL}/background-1.jpeg')`,
            backgroundSize: "cover",
          }}
        >
          <div tw="p-16 w-full h-full flex flex-col items-center justify-center">
            <p
              style={{
                fontSize: "65px",
                fontFamily: "Arial",
                textAlign: "center",
              }}
            >
              {quote}
            </p>
            <p
              tw="mt-4"
              style={{
                fontFamily: "Cardo",
                fontSize: "36px",
                textAlign: "center",
              }}
            >
              {author}
            </p>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1080,
        fonts: [
          { data: aliceFontData, name: "Alice", style: "normal" },
          { data: cardoFontData, name: "Cardo", style: "normal" },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
