import Config, { ConfigNotion } from "../types/config";
import Notion from "./notion-client";
import { NotionProperties } from "../types/clients/notion";
import { Post } from "../types/post";
import path from "path";
import fs from "fs";

export async function postDataFromMarkdown(config: ConfigNotion, url: string) {
  const filePath =
    "tailwind-css-intellisense-vs-code-extension-a-web-developers-best-friend.md";
  // const filePath = path.resolve(process.cwd(), url);
  // publish from a local file
  if (path.extname(filePath).toLowerCase().indexOf("md") === -1) {
    console.log('File extension not allowed. Only ".md" files are allowed');
    throw Error("Incorrect file extension provided");
  }
  const fileText = fs.readFileSync(filePath, "utf-8");
  const markdown = fileText;

  //transform blocks to markdown
  // const properties = await notion.getArticleProperties(pageId);
  const canonical_url = "";

  // const canonical_url =
  //   properties["tags"] && notion.getAttributeValue(properties["tags"]);

  const tags = "";
  // const tags =
  //   properties["original_article_url"] &&
  //   notion.getAttributeValue(properties["original_article_url"]);

  const postData: Post = {
    title: "My Article Title",
    markdown: markdown,
    canonical_url: canonical_url,
    tags: tags,
  };
  return postData;
}
