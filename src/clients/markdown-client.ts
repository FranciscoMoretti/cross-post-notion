import { NotionOptions } from "../types/clients/notion";
import { ConfigNotion } from "../types/config";
import fs from "fs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkParseFrontmatter from "remark-parse-frontmatter";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
class Markdown {
  options: NotionOptions;
  filePath: string;
  file: any;

  constructor(config: ConfigNotion, filePath: string) {
    this.filePath = filePath;
    this.options = config.options;

    this.file = "";
  }

  async setup(): Promise<void> {
    this.file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkFrontmatter, ["yaml", "toml"])
      .use(remarkParseFrontmatter)
      .use(
        // Replace local image paths with site url
        (
            options = {
              search: /^/,
              replace: "/uploads",
            }
          ) =>
          (tree) => {
            visit(tree, (node) => {
              if (node.type === "image") {
                node.url = node.url.replace(options.search, options.replace);
              }
            });
          },
        {
          search: /^\/([^\s]+)/gm,
          replace: "https://www.franciscomoretti.com/$1",
        }
      )
      .use(
        // Replace local links with site url
        (
            options = {
              search: /^/,
              replace: "/uploads",
            }
          ) =>
          (tree) => {
            visit(tree, (node) => {
              if (node.type === "link") {
                node.url = node.url.replace(options.search, options.replace);
              }
            });
          },
        {
          search: /^\/([^\s]+)/gm,
          replace: "https://www.franciscomoretti.com/$1",
        }
      )
      .use(() => (tree, file) => {
        // Remove frontmatter node from the tree
        const [frontmatterNode, ...restNodes] = tree.children;
        if (frontmatterNode.type == "yaml" || frontmatterNode == "toml") {
          tree.children = restNodes;
        }
      })
      .use(remarkStringify)
      .process("[some](/local/link)");

    // .process(fs.readFileSync(this.filePath, "utf-8"));

    console.log(this.file.value);
    console.log("end");
  }

  async getMarkdown(): Promise<string> {
    return this.file.value;
  }

  async getTitle(): Promise<string> {
    return this.file.data.frontmatter.title;
  }

  async getDescription(): Promise<string> {
    return this.file.data.frontmatter.description;
  }

  async getTags(): Promise<string> {
    return this.file.data.frontmatter.tag;
  }

  async getImage(): Promise<string> {
    return this.file.data.frontmatter.image;
  }

  async getDate(): Promise<string> {
    return this.file.data.frontmatter.date;
  }

  async getSlug(): Promise<string> {
    return this.file.data.frontmatter.slug;
  }
}

export default Markdown;
