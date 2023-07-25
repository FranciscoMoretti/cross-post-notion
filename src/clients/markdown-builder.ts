import Config, { ConfigNotion } from "../types/config";
import Notion from "./notion-client";
import { NotionProperties } from "../types/clients/notion";
import { Post } from "../types/post";
import path from "path";
import Markdown from "./markdown-client";

export async function postDataFromMarkdown(config: ConfigNotion, url: string) {
  const filePath =
    "tailwind-css-intellisense-vs-code-extension-a-web-developers-best-friend.md";
  // const filePath = path.resolve(process.cwd(), url);
  // publish from a local file
  if (path.extname(filePath).toLowerCase().indexOf("md") === -1) {
    console.log('File extension not allowed. Only ".md" files are allowed');
    throw Error("Incorrect file extension provided");
  }

  const client = new Markdown(config, filePath);
  const markdown = await client.getMarkdown();
  const title = await client.getTitle();
  const tags = await client.getTags();
  const image = await client.getImage();
  const slug = await client.getSlug();

  const canonical_url = `https://www.franciscomoretti.com/blog/${slug}`;

  const postData: Post = {
    title: title,
    markdown: markdown,
    canonical_url: canonical_url,
    tags: tags,
  };
  return postData;
}
