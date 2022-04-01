import * as React from 'react';
import { Link, graphql, PageProps } from 'gatsby';

import Layout from '../components/layout';
import Seo from '../components/seo';
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image';
import { format } from 'date-fns';
import { ClockIcon, LinkIcon } from '@heroicons/react/outline';

const WorkPostTemplate: React.FC<
  PageProps<GatsbyTypes.WorkPostBySlugQuery>
> = ({ data }) => {
  const post = data.markdownRemark;
  const siteTitle = data?.site?.siteMetadata?.title || `Narusite`;
  const { previous, next } = data;

  const thumbnail =
    post &&
    post.frontmatter?.thumbnail &&
    post.frontmatter.thumbnail.childImageSharp?.gatsbyImageData
      ? getImage(post.frontmatter.thumbnail.childImageSharp.gatsbyImageData)
      : undefined;

  const thumbnailPath =
    post?.frontmatter?.thumbnail?.childImageSharp?.fluid?.originalImg;
  const ogImage = `${data.site?.siteMetadata?.siteUrl}${thumbnailPath}`;

  return (
    <Layout title={siteTitle}>
      <Seo
        title={post?.frontmatter?.title || 'work post'}
        description={post?.frontmatter?.description || post?.excerpt}
        ogImage={ogImage}
      />
      <article
        className="flex justify-center"
        itemScope
        itemType="http://schema.org/Article"
      >
        <div className="p-4 w-full md:w-4/5 lg:w-4/6">
          {post && thumbnail && post.frontmatter?.thumbnailAlt ? (
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
          <header>
            <h1 className="text-5xl py-4 font-bold" itemProp="headline">
              {post?.frontmatter?.title}
            </h1>
            {post?.frontmatter?.link && (
              <p className="flex items-center">
                <LinkIcon className="h-5 w-5 mr-1"></LinkIcon>
                <a
                  href={post?.frontmatter?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {post?.frontmatter?.link}
                </a>
              </p>
            )}

            <p className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-1"></ClockIcon>
              {format(new Date(post?.frontmatter?.date || ''), 'yyyy-MM-dd')}
            </p>
          </header>
          <div className="py-6">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <section
            className="markdown-style"
            dangerouslySetInnerHTML={{ __html: post?.html || '' }}
            itemProp="articleBody"
          />
        </div>
      </article>
      <nav className="flex justify-center">
        <div className="p-4 w-full md:w-4/5 lg:w-4/6">
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous?.fields?.slug || '/'} rel="prev">
                  ← {previous?.frontmatter?.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next?.fields?.slug || '/'} rel="next">
                  {next?.frontmatter?.title} →
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </Layout>
  );
};

export default WorkPostTemplate;

export const pageQuery = graphql`
  query WorkPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
        thumbnail {
          childImageSharp {
            fluid {
              originalImg
            }
            gatsbyImageData
          }
        }
        thumbnailAlt
        link
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
