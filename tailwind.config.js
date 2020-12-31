const production = !process.env.ROLLUP_WATCH;

module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  // plugins: [
  //   require('@tailwindcss/ui'),
  // ],
  purge: {
    enabled: production,
    mode: 'all',
    content: [
      './src/**/*.svelte',
      './public/**/*.html',
    ],
    css: [
      './public/**/*.css',
    ],
    options: {
      whitelistPatterns: [/svelte-/],
      defaultExtractor: (content) =>
        [...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(([_match, group, ..._rest]) => group),
    },
  },
  darkMode: false,
  variants: {
    extend: {
      boxShadow: ['focus-within'],
    },
  },
  // theme: {
  //   extend: {
  //     gridTemplateColumns: {
  //
  //     },
  //   },
  // },
};
