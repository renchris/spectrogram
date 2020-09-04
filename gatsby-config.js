/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  pathPrefix: "/spectrogram",
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Spectogram`,
        short_name: `Spec`,
        start_url: `.`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`,
        icon: "src/images/wave.svg",
      },
    },
    "gatsby-plugin-offline",
  ],
}
