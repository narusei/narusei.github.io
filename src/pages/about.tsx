import * as React from 'react';
import { graphql, PageProps } from 'gatsby';

import Seo from '../components/seo';
import Layout from '../components/layout';
import { StaticImage } from 'gatsby-plugin-image';

const AboutPage: React.FC<PageProps<GatsbyTypes.AboutPageQuery>> = ({
  data,
}) => {
  const siteTitle = data.site?.siteMetadata?.title || `Narusite`;
  const social = data.site?.siteMetadata?.social;

  return (
    <Layout title={siteTitle}>
      <Seo title={`Top`} />
      <div className="px-16 md:px-48 lg:px-72 py-16">
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
          <div className="flex mt-2">
            <a
              href={`https://github.com/${social?.github || ``}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                height={24}
                width={24}
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>GitHub</title>
                <path
                  fill="#181717"
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                />
              </svg>
            </a>

            <a
              href={`https://twitter.com/${social?.twitter || ``}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="ml-2"
                height={24}
                width={24}
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Twitter</title>
                <path
                  fill="#1DA1F2"
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                />
              </svg>
            </a>

            <a
              href={`https://${social?.hatena || ``}.hatenablog.com/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="ml-2"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
                role="img"
                viewBox="0 0 24 24"
              >
                <title>HatenaBlog</title>
                <path
                  fill="#333"
                  d="M11.9999 24.0005C5.38312 24.0005 0 18.6176 0 12.0002C0 5.38348 5.38312 0 11.9999 0C18.6176 0 24 5.38348 24 12.0002C24 18.6176 18.6176 24.0005 11.9999 24.0005V24.0005ZM11.9999 1.52628C6.22463 1.52628 1.5258 6.22439 1.5258 12.0002C1.5258 17.776 6.22463 22.4746 11.9999 22.4746C17.7762 22.4746 22.4749 17.776 22.4749 12.0002C22.4749 6.22439 17.7762 1.52628 11.9999 1.52628V1.52628ZM13.3977 6.07468C12.8114 4.8875 12.4534 3.73308 12.2726 3.06033V11.5598C12.5695 11.6711 12.7818 11.955 12.7818 12.2903C12.7818 12.7221 12.4316 13.0719 12.0001 13.0719C11.5682 13.0719 11.2184 12.7219 11.2184 12.2903C11.2184 11.939 11.452 11.6452 11.7714 11.5465V3.05135C11.5913 3.72241 11.233 4.8824 10.6439 6.07468C9.72538 7.93266 8.5803 9.57166 8.5803 9.57166L9.31263 19.5929C9.31263 19.5929 10.0086 20.3696 12.0194 20.3706H12.0222C14.0329 20.3696 14.7292 19.5929 14.7292 19.5929L15.4614 9.57166C15.4611 9.57166 14.316 7.93278 13.3977 6.07468V6.07468Z"
                />
              </svg>
            </a>

            <a
              href={`https://qiita.com/${social?.qiita || ``}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <StaticImage
                className="ml-2"
                src="../images/qiita.png"
                height={24}
                width={24}
                alt="qiita icon"
              ></StaticImage>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center mt-8">
          <div>{data.about?.frontmatter?.description}</div>
        </div>

        <section
          className="markdown-style mt-8"
          dangerouslySetInnerHTML={{ __html: data.about?.html || '' }}
          itemProp="articleBody"
        />
      </div>
    </Layout>
  );
};

export default AboutPage;

export const pageQuery = graphql`
  query AboutPage {
    site {
      siteMetadata {
        title
        author {
          name
          summary
        }
        social {
          twitter
          github
          hatena
          qiita
        }
      }
    }
    about: markdownRemark(frontmatter: { contentType: { eq: "about" } }) {
      excerpt
      html
      frontmatter {
        description
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;
