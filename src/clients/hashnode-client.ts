import { GraphQLClient, gql } from "graphql-request";
import {
  HashnodeConnectionSettings,
  HashnodeOptions,
  HashnodeProperties,
} from "../types/clients/hashnode";
import { ConfigHashnode } from "../types/config";
import { Post } from "../types/post";

type HashnodeTag = {
  slug: string;
  _id: string;
  name: string;
};

class HashnodeClient {
  connection_settings: HashnodeConnectionSettings;
  options: HashnodeOptions;
  client: GraphQLClient;
  postData: Post;

  constructor(config: ConfigHashnode, postData: Post) {
    this.connection_settings = config.connection_settings;
    this.options = config.options || {};
    this.postData = postData;
    this.client = new GraphQLClient("https://api.hashnode.com", {
      headers: {
        authorization: this.connection_settings.token,
      },
    });
  }

  async post(url: string, dryRun?: boolean) {
    //get tags
    let hashNodeTags: HashnodeTag[] = [];
    const inputTags = this.postData.tags;
    if (inputTags) {
      hashNodeTags = await this.getTagsFromHashnode(
        inputTags.split(",").map((tag) => tag.trim())
      );
    }

    const createStoryInput = {
      title: "My Article Title",
      contentMarkdown: this.postData.markdown,
      // Use description as subtitle if they are 150 chars
      // subtitle: this.notion.getAttributeValue(properties[this.options.properties?.subtitle || HashnodeProperties.SUBTITLE]),
      ...(this.postData.canonical_url && {
        isRepublished: {
          originalArticleUrl: this.postData.canonical_url,
        },
      }),
      tags: hashNodeTags,
      isPartOfPublication: {
        publicationId: this.connection_settings.publication_id,
      },
    };

    //post to personal
    const mutation = gql`
      mutation createPublicationStory(
        $input: CreateStoryInput!
        $publicationId: String!
        $hideFromHashnodeFeed: Boolean!
      ) {
        createPublicationStory(
          input: $input
          publicationId: $publicationId
          hideFromHashnodeFeed: $hideFromHashnodeFeed
        ) {
          success
          message
        }
      }
    `;

    const data = {
      input: createStoryInput,
      publicationId: this.connection_settings.publication_id,
      hideFromHashnodeFeed: this.options.should_hide,
    };

    if (dryRun) {
      console.log("No error occurred while preparing article for Hashnode.");
      return;
    }

    await this.client.request(mutation, data);

    console.log("Article pushed to Hashnode");
  }

  async getTagsFromHashnode(tags: string[]): Promise<HashnodeTag[]> {
    const hashnodeTags: HashnodeTag[] = [];
    //retrieve all tags from hashnode
    const query = gql`
      {
        tagCategories {
          _id
          name
          slug
        }
      }
    `;

    const response = await this.client.request(query);

    tags.forEach((tag) => {
      //find tag in the response
      const hashnodeTag = response.tagCategories?.find(
        (t: HashnodeTag) => t.name === tag || t.slug === tag
      );

      if (hashnodeTag) {
        hashnodeTags.push(hashnodeTag);
      }
    });

    return hashnodeTags;
  }
}

export default HashnodeClient;
