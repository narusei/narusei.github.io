import * as React from 'react';
import { graphql, Link, PageProps } from 'gatsby';

import Seo from '../components/seo';
import Layout from '../components/layout';
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image';
import { ClockIcon, TagIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';

const IndexPage: React.FC<PageProps<GatsbyTypes.IndexPageQuery>> = ({
  data,
}) => {
  const siteTitle = data.site?.siteMetadata?.title || `Narusite`;
  const blogs = data.blogs.nodes;
  const works = data.works.nodes;

  return (
    <Layout title={siteTitle}>
      <Seo title={`Top`} />
      <div className="top-background bg-bottom bg-no-repeat flex flex-col items-center pt-16 pb-28">
        <div className="flex flex-col items-center">
          <StaticImage
            className="rounded-full"
            layout="fixed"
            formats={['auto', 'webp', 'avif']}
            src="../images/profile-pic.png"
            width={128}
            height={128}
            quality={95}
            alt="プロフィール画像"
          ></StaticImage>
          <div className="title-font font-medium sm:text-2xl text-xl text-gray-900">
            {data.site?.siteMetadata?.author?.name?.toLowerCase()}
          </div>
          <div>{data.site?.siteMetadata?.author?.summary}</div>
        </div>

        <div className="flex flex-col items-center mt-8 w-80">
          <div className="title-font font-medium text-lg text-gray-900 mb-1">
            「困った」を解決したい
          </div>
          <div>
            そんな何気ないモチベーションを原動力として開発に取り組んでいます。生み出したものがどこかの誰かの日常に組み込まれることを目指して。
          </div>
        </div>

        <Link to="/about">
          <button className="flex mx-auto py-2 px-8 focus:outline-none rounded-full text-lg bg-white hover:bg-slate-300 drop-shadow">
            About
          </button>
        </Link>
      </div>
      <div className="md:px-32 py-8">
        <div className="flex flex-col items-center">
          <header>
            <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900">
              制作物
            </h1>
          </header>
          <ol className="list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {works.map(work => {
              const workTitle = work.frontmatter?.title || work.fields?.slug;
              const workThumbnail =
                work.frontmatter?.thumbnail &&
                work.frontmatter.thumbnail.childImageSharp?.gatsbyImageData
                  ? getImage(
                      work.frontmatter?.thumbnail?.childImageSharp
                        ?.gatsbyImageData
                    )
                  : undefined;

              return (
                <li key={work.fields?.slug} className="p-4">
                  <article itemScope itemType="http://schema.org/Article">
                    <Link to={work.fields?.slug || '/'} itemProp="url">
                      {workThumbnail && work.frontmatter?.thumbnailAlt ? (
                        <GatsbyImage
                          image={workThumbnail}
                          alt={work.frontmatter?.thumbnailAlt}
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
                            {workTitle}
                          </h1>
                        </header>
                      </div>
                    </Link>
                  </article>
                </li>
              );
            })}
          </ol>
          <Link to="/work">
            <button className="flex mx-auto mt-2 py-2 px-8 focus:outline-none rounded-full text-lg bg-white hover:bg-slate-300 drop-shadow">
              その他の制作物
            </button>
          </Link>
        </div>

        <div className="py-8">
          <div className="w-full border-t border-gray-300"></div>
        </div>

        <div className="flex flex-col items-center">
          <header>
            <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900">
              ブログ
            </h1>
          </header>
          <ol className="list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
            {blogs.map(blog => {
              return (
                <li key={blog.fields?.slug} className="p-4">
                  <article className="h-full">
                    <Link to={blog.fields?.slug || ''}>
                      <div className="h-full bg-gray-100 bg-opacity-75 px-4 py-4 rounded-lg overflow-hidden">
                        <header>
                          <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
                            {blog.frontmatter?.title}
                          </h1>
                        </header>
                        <section>
                          <p
                            className="leading-relaxed mb-3 line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html:
                                blog.frontmatter?.description ||
                                blog.excerpt ||
                                '',
                            }}
                            itemProp="description"
                          ></p>
                        </section>
                        <footer className="text-sm">
                          {blog.frontmatter?.tags && (
                            <div className="flex items-center">
                              <TagIcon className="h-5 w-5 mr-1"></TagIcon>
                              {blog?.frontmatter?.tags?.map(tag => {
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
                              new Date(blog?.frontmatter?.date || ''),
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
          <Link to="/blog">
            <button className="flex mx-auto mt-2 py-2 px-8 focus:outline-none rounded-full text-lg bg-white hover:bg-slate-300 drop-shadow">
              その他の記事
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexPage {
    site {
      siteMetadata {
        title
        author {
          name
          summary
        }
      }
    }
    blogs: allMarkdownRemark(
      limit: 6
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
    works: allMarkdownRemark(
      limit: 6
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { contentType: { eq: "work" } } }
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
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
