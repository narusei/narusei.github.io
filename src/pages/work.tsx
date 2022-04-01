import * as React from 'react';
import { Link, graphql, PageProps } from 'gatsby';
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image';

import Layout from '../components/layout';
import Seo from '../components/seo';

const WorkPage: React.FC<PageProps<GatsbyTypes.WorkPageQuery>> = ({ data }) => {
  const siteTitle = data.site?.siteMetadata?.title || `Narusite`;
  const posts = data.allMarkdownRemark.nodes;

  if (posts.length === 0) {
    return (
      <Layout title={siteTitle}>
        <Seo title="Work List" />
        <p>
          No work posts found. Add markdown posts to content/blog (or the
          directory you specified for the gatsby-source-filesystem plugin in
          gatsby-config.js).
        </p>
      </Layout>
    );
  }

  return (
    <Layout title={siteTitle}>
      <Seo title="Work List" />
      <ol className="list-none grid grid-cols-1 md:grid-cols-2 md:px-32 lg:grid-cols-3">
        {posts.map(post => {
          const title = post.frontmatter?.title || post.fields?.slug;
          const thumbnail =
            post.frontmatter?.thumbnail &&
            post.frontmatter.thumbnail.childImageSharp?.gatsbyImageData
              ? getImage(
                  post.frontmatter.thumbnail.childImageSharp.gatsbyImageData
                )
              : undefined;

          return (
            <li key={post.fields?.slug} className="p-4">
              <article itemScope itemType="http://schema.org/Article">
                <Link to={post.fields?.slug || '/'} itemProp="url">
                  {thumbnail && post.frontmatter?.thumbnailAlt ? (
                    <GatsbyImage
                      image={thumbnail}
                      alt={post.frontmatter?.thumbnailAlt}
                    ></GatsbyImage>
                  ) : (
                    <StaticImage
                      src="../images/thumbnail_default.png"
                      alt="制作物のデフォルトサムネ画像"
                    ></StaticImage>
                  )}
                  <div className="bg-gray-100 bg-opacity-75 overflow-hidden p-2 rounded-b-lg flex items-center">
                    <header>
                      <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900">
                        {title}
                      </h1>
                    </header>
                    <footer className="ml-auto">
                      <small>{post.frontmatter?.date}</small>
                    </footer>
                  </div>
                </Link>
              </article>
            </li>
          );
        })}
      </ol>
    </Layout>
  );
};

export default WorkPage;

export const pageQuery = graphql`
  query WorkPage {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { contentType: { eq: "work" } } }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          thumbnail {
            childImageSharp {
              gatsbyImageData
            }
          }
          thumbnailAlt
        }
      }
    }
  }
`;
