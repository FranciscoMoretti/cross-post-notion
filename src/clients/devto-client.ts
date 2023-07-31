import { ConfigDevTo } from "./../types/config";
import {
  DevToConnectionSettings,
  DevToOptions,
  DevToProperties,
} from "../types/clients/devto";
import axios, { AxiosInstance } from "axios";
import { Post } from "../types/post";

type ArticleData = {
  body_markdown: string;
  organization_id?: string;
  published: boolean;
  title: string;
  series?: string;
  description?: string;
  canonical_url?: string;
  tags?: string[];
  date?: string;
};

class DevToClient {
  connection_settings: DevToConnectionSettings;
  options: DevToOptions;
  postData: Post;
  client: AxiosInstance;

  constructor(config: ConfigDevTo, postData: Post) {
    this.connection_settings = config.connection_settings;
    this.options = config.options || {};
    this.postData = postData;

    this.client = axios.create({
      baseURL: "https://dev.to/api/",
      headers: {
        "api-key": this.connection_settings.api_key,
        Accept: "application/vnd.forem.api-v1+json",
      },
    });
  }

  async post(url: string, dryRun?: boolean) {
    const normalizedTags = this.postData.tags
      ? this.postData.tags
          .split(",")
          .map((tag) => tag.toLowerCase().replace(/[^a-z0-9]/gi, ""))
      : [];
    //format data
    const article: ArticleData = {
      body_markdown: this.postData.markdown,
      organization_id: this.connection_settings.organization_id,
      published: this.options.should_publish,
      title: this.postData.title,
      // ...(this.postData.series && { series: this.postData.series }),
      ...(this.postData.description && {
        description: this.postData.description,
      }),
      ...(this.postData.canonical_url && {
        canonical_url: this.postData.canonical_url,
      }),
      ...(this.postData.image && {
        main_image: this.postData.image,
      }),
      ...(this.postData.tags && {
        tags: normalizedTags,
      }),
      // ...(this.postData.date && { date: this.postData.date }),
    };

    if (dryRun) {
      console.log("No error occurred while preparing article for dev.to.");
      return;
    }

    //post to dev.to
    await this.client.post("articles", {
      article,
    });

    console.log("Article pushed to Dev.to");
  }
}

export default DevToClient;
