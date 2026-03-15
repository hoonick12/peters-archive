import { Layout, Navbar, Footer } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: "Peter's Archive",
  description: 'PARA 방법론과 제텔카스텐을 결합한 개인 지식 아카이브',
}

export default async function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Layout
          pageMap={await getPageMap()}
          navbar={
            <Navbar
              logo={<span style={{ fontWeight: 'bold' }}>Peter's Archive</span>}
              projectLink="https://github.com/hoonick12/peters-archive"
            />
          }
          footer={
            <Footer>
              <span>{new Date().getFullYear()} © Peter's Archive.</span>
            </Footer>
          }
          docsRepositoryBase="https://github.com/hoonick12/peters-archive/blob/main"
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
