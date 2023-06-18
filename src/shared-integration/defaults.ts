import { cssIdRE } from '@unocss/core'

// picomatch patterns, used with rollup's createFilter
export const defaultPipelineExclude = [cssIdRE]
export const defaultPipelineInclude = [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/]
