import { NotionOptions } from "../types/clients/notion";
import { ConfigNotion } from "../types/config";
import matter = require("gray-matter");
import fs from "fs";

class Markdown {
  options: NotionOptions;
  filePath: string;
  matter: matter.GrayMatterFile<string>;

  constructor(config: ConfigNotion, filePath: string) {
    this.filePath = filePath;
    this.options = config.options;

    const fileContent = fs.readFileSync(this.filePath, "utf-8");

    this.matter = matter(fileContent);
  }

  async getMarkdown(): Promise<string> {
    return this.matter.content;
  }

  async getTitle(): Promise<string> {
    return this.matter.data.title;
  }

  async getTags(): Promise<string> {
    return this.matter.data.tags;
  }

  async getImage(): Promise<string> {
    return this.matter.data.image;
  }

  async getDate(): Promise<string> {
    return this.matter.data.date;
  }

  async getSlug(): Promise<string> {
    return this.matter.data.slug;
  }
}

export default Markdown;
