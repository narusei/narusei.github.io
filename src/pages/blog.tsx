import * as React from 'react';
import { Link, graphql, PageProps } from 'gatsby';

import Layout from '../components/layout';
import Seo from '../components/seo';
import { format } from 'date-fns';
import { ClockIcon, TagIcon } from '@heroicons/react/outline';

const BlogPage: React.FC<PageProps<GatsbyTypes.BlogPageQuery>> = ({ data }) => {
  const siteTitle = data.site?.siteMetadata?.title || `Narusite`;
  const posts = data.allMarkdownRemark.nodes;

  if (posts.length === 0) {
    return (
      <Layout title={siteTitle}>
        <Seo title="Blog List" />
        <p>
          No blog posts found. Add markdown posts to content/blog (or the
          directory you specified for the gatsby-source-filesystem plugin in
          gatsby-config.js).
        </p>
      </Layout>
    );
  }

  return (
    <Layout title={siteTitle}>
      <Seo title="Blog List" />
      <ol className="list-none flex flex-col items-center">
        {posts.map(post => {
          const title = post.frontmatter?.title || post.fields?.slug;

          return (
            <li
              key={post.fields?.slug}
              className="p-4 w-full md:w-4/5 lg:w-4/6"
            >
              <article itemScope itemType="http://schema.org/Article">
                <Link to={post.fields?.slug || '/'} itemProp="url">
                  <div className="h-full bg-gray-100 bg-opacity-75 px-8 py-16 rounded-lg overflow-hidden">
                    <header>
                      <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
                        {title}
                      </h1>
                    </header>
                    <section>
                      <p
                        className="leading-relaxed mb-3"
                        dangerouslySetInnerHTML={{
                          __html:
                            post.frontmatter?.description || post.excerpt || '',
                        }}
                        itemProp="description"
                      ></p>
                    </section>
                    <footer className="text-sm flex">
                      {post.frontmatter?.tags && (
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
                      <p className="flex items-center ml-auto">
                        <ClockIcon className="h-5 w-5 mr-1"></ClockIcon>
                        {format(
                          new Date(post?.frontmatter?.date || ''),
                          'yyyy-MM-dd'
                        )}
                      </p>
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

export default BlogPage;

export const pageQuery = graphql`
  query BlogPage {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { contentType: { eq: "blog" } } }
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          tags
        }
      }
    }
  }
`;
