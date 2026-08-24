'use strict';

// Tailwind v4 generates @layer properties { @supports selector(> .x) { ... } }
// to detect CSS nesting. LightningCSS (Turbopack's parser) rejects the relative
// selector `> .x` inside selector(). We use OnceExit so this runs after
// @tailwindcss/postcss has generated its output, then unwrap the @supports wrapper.

const plugin = (options = {}) => ({
  postcssPlugin: 'postcss-unwrap-supports-selector',
  OnceExit(root) {
    const toUnwrap = [];
    root.walkAtRules('supports', (atRule) => {
      if (atRule.params && atRule.params.includes('selector(')) {
        toUnwrap.push(atRule);
      }
    });
    for (const atRule of toUnwrap) {
      atRule.replaceWith(atRule.nodes || []);
    }
  },
});
plugin.postcss = true;

module.exports = plugin;
