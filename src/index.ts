import type { UserConfig, UserConfigDefaults } from '@unocss/core'
import type { ResolvedUnpluginOptions, UnpluginOptions } from 'unplugin'
import { createUnplugin } from 'unplugin'
import WebpackSources from 'webpack-sources'
import { createContext } from './shared-integration/context'
import { applyTransformers } from './shared-integration/transformers'

export interface WebpackPluginOptions<Theme extends {} = {}> extends UserConfig<Theme> {
}

const PLUGIN_NAME = 'unocss-webpack-uniapp2'

export function defineConfig<Theme extends {}>(config: WebpackPluginOptions<Theme>) {
  return config
}

// const styleCssRegExp = /\/\*\s*unocss-start\s*\*\/[\s\S]*\/\*\s*unocss-end\s*\*\//
const styleCssRegExp = /.uno-start[\s\S]*.uno-end/

export default function WebpackPlugin<Theme extends {}>(
  configOrPath?: WebpackPluginOptions<Theme> | string,
  defaults?: UserConfigDefaults,
) {
  return createUnplugin(() => {
    const ctx = createContext<WebpackPluginOptions>(configOrPath as any, defaults)
    const { uno, tokens, filter, extract } = ctx

    const nonPreTransformers = ctx.uno.config.transformers?.filter(i => i.enforce !== 'pre')
    if (nonPreTransformers?.length) {
      console.warn(
        // eslint-disable-next-line prefer-template
        '[unocss] webpack integration only supports "pre" enforce transformers currently.'
        + 'the following transformers will be ignored\n'
        + nonPreTransformers.map(i => ` - ${i.name}`).join('\n'),
      )
    }

    const tasks: Promise<any>[] = []

    const plugin = <UnpluginOptions>{
      name: PLUGIN_NAME,
      enforce: 'pre',
      transformInclude(id) {
        return filter('', id) && !id.match(/\.html$/)
      },
      async transform(code, id) {
        const result = await applyTransformers(ctx, code, id, 'pre')
        if (result == null)
          tasks.push(extract(code, id))
        else
          tasks.push(extract(result.code, id))
        return result
      },
      webpack(compiler) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
          compilation.hooks.optimizeAssets.tapPromise(PLUGIN_NAME, async () => {
            const files = Object.keys(compilation.assets)
            await Promise.all(tasks)

            const result = await uno.generate(tokens, { minify: true })

            for (const file of files) {
              let code = compilation.assets[file].source().toString()
              let replaced = false

              if (styleCssRegExp.test(code)) {
                replaced = true
                let css = result.getLayers()

                if (process.env.UNI_PLATFORM === 'app-plus')
                  css = css.replace('page', 'body')

                // code = code.replace(styleCssRegExp, `/* unocss-start */${css}/* unocss-end */`)
                code = code.replace(styleCssRegExp, `.uno-start{--un: 0;}${css}.uno-end`)
              }

              if (replaced)
                compilation.assets[file] = new WebpackSources.RawSource(code) as any
            }
          })
        })
      },
    } as Required<ResolvedUnpluginOptions>

    return plugin
  }).webpack()
}
