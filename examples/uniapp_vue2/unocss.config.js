import presetWeapp from 'unocss-preset-weapp'
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'
import { defineConfig } from 'unocss'

const { transformerAttributify, presetWeappAttributify } = extractorAttributify()

export default defineConfig({
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp({
      // h5兼容
      platform: 'uniapp',
      isH5: process.env.UNI_PLATFORM === 'h5',
    }),
    presetWeappAttributify(),
  ],
  shortcuts: [
    {
      'border-base': 'border border-gray-500_10',
      'center': 'flex justify-center items-center',
    },
  ],
  transformers: [
    transformerAttributify(),
    transformerClass(),
  ],
})
