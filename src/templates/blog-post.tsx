import * as React from 'react';
import { Link, graphql, PageProps } from 'gatsby';
import { ClockIcon, TagIcon } from '@heroicons/react/outline';

import Layout from '../components/layout';
import Seo from '../components/seo';
import { format } from 'date-fns';

const BlogPostTemplate: React.FC<
  PageProps<GatsbyTypes.BlogPostBySlugQuery>
> = ({ data }) => {
  const post = data.markdownRemark;
  const siteTitle = data?.site?.siteMetadata?.title || `Narusite`;
  const { previous, next } = data;

  const ogImage = `${data.site?.siteMetadata?.siteUrl}${post?.fields?.slug}thumbnail.png`;

  return (
    <Layout title={siteTitle}>
      <Seo
        title={post?.frontmatter?.title || 'blog post'}
        description={post?.frontmatter?.description || post?.excerpt}
        ogImage={ogImage}
      />
      <article
        className="flex justify-center"
        itemScope
        itemType="http://schema.org/Article"
      >
        <div className="p-4 w-full md:w-4/5 lg:w-4/6">
          <header>
            <h1 className="text-5xl py-4 font-bold" itemProp="headline">
              {post?.frontmatter?.title}
            </h1>
            <p className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-1"></ClockIcon>
              {format(new Date(post?.frontmatter?.date || ''), 'yyyy-MM-dd')}
            </p>
            {post?.frontmatter?.tags && (
              <div className="flex items-center">
                <TagIcon className="h-5 w-5 mr-1"></TagIcon>
                {post?.frontmatter?.tags?.map(tag => {
                  return (
                    <p key={tag} className="mr-1">
                      {tag}
                    </p>
                  );
                })}
              </div>
            )}
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

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug(
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
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
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
