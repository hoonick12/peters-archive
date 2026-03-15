import nextra from 'nextra'

const withNextra = nextra({})

export default withNextra({
  basePath: '/peters-archive',
  images: {
    unoptimized: true,
  },
  output: 'export',
})
