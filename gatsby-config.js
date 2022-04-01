/* eslint-disable */
module.exports = {
  siteMetadata: {
    title: `Narusite`,
    author: {
      name: `Narusei`,
      summary: `Web, IoT, Security`,
    },
    description: `制作物の紹介・知見共有・自身の考えなど、身の回りに起こったことをアウトプットする製作者のポータルサイトです。`,
    siteUrl: `https://narusei.github.io`,
    social: {
      twitter: `narusei_dev`,
      github: `narusei`,
      hatena: `narusei`,
      qiita: `narusei`,
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `content`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          {
            resolve: `gatsby-remark-og-image`,
            options: {
              catchyOptions: {
                output: {
                  directory: '',
                  fileName: 'thumbnail.png',
                },
                image: {
                  width: 1200,
                  height: 630,
                  backgroundImage: require.resolve(
                    './src/images/og_background.png'
                  ),
                },
                style: {
                  title: {
                    fontFamily: 'Noto Sans JP',
                    fontColor: '#3a3a3a',
                    fontWeight: 'bold',
                    fontSize: 56,
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 56,
                    paddingRight: 56,
                  },
                  author: {
                    fontFamily: 'Noto Sans JP',
                    fontColor: '#3a3a3a',
                    fontWeight: 'bold',
                    fontSize: 16,
                  },
                },
                meta: {
                  title: '',
                  author: '',
                },
                fontFile: [
                  {
                    path: require.resolve(
                      './src/styles/fonts/NotoSansJP-Bold.otf'
                    ),
                    family: 'Noto Sans JP',
                    weight: 'bold',
                  },
                ],
                iconFile: require.resolve('./src/images/dummy.png'),
                timeout: 10000,
              },
              generatedTarget: ['blog'],
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: `ADD YOUR TRACKING ID HERE`,
    //   },
    // },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ 'content:encoded': node.html }],
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  nodes {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
            title: 'Narusei Portal Site RSS Feed',
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Narusei Portal Site`,
        short_name: `Narusei`,
        start_url: `/`,
        background_color: `#ffffff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/narusite-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-react-helmet`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    `gatsby-plugin-typegen`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-postcss`,
  ],
};
