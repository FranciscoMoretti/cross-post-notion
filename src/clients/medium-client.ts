import axios, { AxiosInstance } from "axios";
import {
  MediumConnectionSettings,
  MediumOptions,
  MediumProperties,
} from "../types/clients/medium";
import { ConfigMedium } from "../types/config";
import { Post } from "../types/post";

class MediumClient {
  connection_settings: MediumConnectionSettings;
  options: MediumOptions;
  client: AxiosInstance;
  postData: Post;

  constructor(config: ConfigMedium, postData: Post) {
    this.connection_settings = config.connection_settings;
    this.options = config.options || {};
    this.postData = postData;

    this.client = axios.create({
      baseURL: "https://api.medium.com/v1/",
      headers: {
        Authorization: `Bearer ${this.connection_settings.token}`,
      },
    });
  }

  async post(url: string, dryRun?: boolean) {
    //get user ID
    const {
      data: {
        data: { id },
      },
    } = await this.client.get("me");

    let requestPath = `users/${id}/posts`;
    if (this.connection_settings.publication_name) {
      //get publication id
      const {
        data: { data },
      } = await this.client.get(`users/${id}/publications`);

      const publication = data.find(
        (pub: Record<string, string>) =>
          pub.name === this.connection_settings.publication_name
      );

      if (publication) {
        requestPath = `publications/${publication.id}/posts`;
      }
    }

    //get post title and add it to the top of the markdown content
    const title = this.postData.title;
    const subtitle = this.postData.description;
    const image = this.postData.image;
    const markdown = `# ${title}\r\n\r\n${
      subtitle ? `${subtitle}\r\n\r\n` : ""
    }${image ? `![Post thumbnail](${image})\r\n\r\n` : ""}
    ${this.postData.markdown}`;

    if (dryRun) {
      console.log("No error occurred while preparing article for Medium.");
      return;
    }

    await this.client.post(requestPath, {
      title,
      contentFormat: "markdown",
      content: markdown,
      tags: this.postData.tags
        ? this.postData.tags.split(",").map((tag) => tag.trim())
        : [],
      canonicalUrl: this.postData.canonical_url
        ? this.postData.canonical_url
        : "",
      publishStatus: this.options.should_publish ? "public" : "draft",
      notifyFollowers: this.options.should_notify_followers,
    });

    console.log("Article pushed to Medium");
  }
}

export default MediumClient;
