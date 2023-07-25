import { NotionOptions } from "../types/clients/notion";
import { ConfigNotion } from "../types/config";
// import { unified } from "unified";
// import remarkParse from "remark-parse";
// import remarkFrontmatter from "remark-frontmatter";
// import remarkStringify from "remark-stringify";
import fs from "fs";

class Markdown {
  options: NotionOptions;
  filePath: string;

  constructor(config: ConfigNotion, filePath: string) {
    this.filePath = filePath;
    this.options = config.options;
  }

  async getMarkdown(source: string): Promise<string> {
    const fileContent = fs.readFileSync(this.filePath, "utf-8");
    // const file = await unified()
    // .use(remarkParse)
    // .use(remarkStringify)
    // .use(remarkFrontmatter, ["yaml", "toml"])
    // .use(() => (tree) => {
    //   console.dir(tree);
    // })
    // .process(fileContent);
    return "";
  }

  // async getArticleProperties(page_id: string): Promise<Record<string, any>> {
  //   const response = await this.notion.pages.retrieve({
  //     page_id,
  //   });

  //   //due to an issue in Notion's types we disable ts for this line
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   return response.properties;
  // }

  // getArticleSlug(title: string): string {
  //   return `${encodeURI(slugify(title.toLowerCase()))}`;
  //   return `${slugify(title.toLowerCase())}`;
  // }

  // getAttributeValue(attribute: Record<string, any>): string {
  //   switch (attribute?.type) {
  //     case "title":
  //       return attribute.title?.plain_text;
  //     case "rich_text":
  //       return attribute.rich_text[0]?.plain_text || "";
  //     case "date":
  //       return attribute.date?.start || "";
  //     default:
  //       return "";
  //   }
  // }

  // // Read more details in Notion's documentation:
  // // https://developers.notion.com/docs/working-with-page-content#creating-a-page-with-content
  // getPageIdFromURL(url: string): string {
  //   const urlArr = url.split("-"),
  //     unformattedId = urlArr[urlArr.length - 1];

  //   if (unformattedId.length !== 32) {
  //     throw Error("Invalid ID. Length of ID should be 32 characters");
  //   }

  //   return (
  //     `${unformattedId.substring(0, 8)}-${unformattedId.substring(8, 12)}-` +
  //     `${unformattedId.substring(12, 16)}-${unformattedId.substring(16, 20)}-` +
  //     `${unformattedId.substring(20)}`
  //   );
  // }
}

export default Markdown;
