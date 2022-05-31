import path from 'path';
import { createFilePath } from 'gatsby-source-filesystem';
import { GatsbyNode } from 'gatsby';

export const createPages: GatsbyNode['createPages'] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const { createPage } = actions;

  // Define a template for blog post & work post
  const blogPostComponent = path.resolve(`./src/templates/blog-post.tsx`);
  const workPostComponent = path.resolve(`./src/templates/work-post.tsx`);

  // Get all markdown blog posts sorted by date
  const blogResult = await graphql<{
    allMarkdownRemark: Pick<GatsbyTypes.Query['allMarkdownRemark'], 'nodes'>;
  }>(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
          filter: {
            frontmatter: { contentType: { eq: "blog" }, draft: { eq: false } }
          }
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
    `
  );

  const workResult = await graphql<{
    allMarkdownRemark: Pick<GatsbyTypes.Query['allMarkdownRemark'], 'nodes'>;
  }>(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
          filter: {
            frontmatter: { contentType: { eq: "work" }, draft: { eq: false } }
          }
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
    `
  );

  if (blogResult.errors || workResult.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts or work posts`,
      blogResult.errors
    );
    return;
  }

  const blogPosts = blogResult.data?.allMarkdownRemark.nodes;
  const workPosts = workResult.data?.allMarkdownRemark.nodes;

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (blogPosts && blogPosts.length > 0) {
    blogPosts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : blogPosts[index - 1].id;
      const nextPostId =
        index === blogPosts.length - 1 ? null : blogPosts[index + 1].id;

      createPage({
        path: post.fields?.slug || '/',
        component: blogPostComponent,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      });
    });
  }

  if (workPosts && workPosts.length > 0) {
    workPosts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : workPosts[index - 1].id;
      const nextPostId =
        index === workPosts.length - 1 ? null : workPosts[index + 1].id;

      createPage({
        path: post.fields?.slug || '/',
        component: workPostComponent,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      });
    });
  }
};

export const onCreateNode: GatsbyNode['onCreateNode'] = ({
  node,
  actions,
  getNode,
}) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });

    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] =
  ({ actions }) => {
    const { createTypes } = actions;

    // Explicitly define the siteMetadata {} object
    // This way those will always be defined even if removed from gatsby-config.js

    // Also explicitly define the Markdown frontmatter
    // This way the "MarkdownRemark" queries will return `null` even when no
    // blog posts are stored inside "content/blog" instead of returning an error
    createTypes(`
      type SiteSiteMetadata {
        author: Author
        siteUrl: String
        social: Social
      }

      type Author {
        name: String
        summary: String
      }

      type Social {
        twitter: String
        github: String
        hatena: String
        qiita: String
      }

      type MarkdownRemark implements Node {
        frontmatter: Frontmatter
        fields: Fields
      }

      type Frontmatter {
        title: String
        description: String
        date: Date @dateformat
        contentType: String
        tags: [String]
        thumbnail: File @fileByRelativePath
        thumbnailAlt: String
        link: String
        draft: Boolean
      }

      type Fields {
        slug: String
      }
    `);
  };
