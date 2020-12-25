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
    content: [
      './src/**/*.svelte',
      './public/**/*.html',
    ],
    css: [
      './public/**/*.css',
    ],
    enabled: production,
  },
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
