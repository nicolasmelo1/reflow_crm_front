import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'


class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try {
            ctx.renderPage = () => originalRenderPage({
                enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
            })

            const initialProps = await Document.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            }
        } finally {
            sheet.seal()
        }
    }

    render() {
        // overscrollBehaviour reference: https://stackoverflow.com/a/56071966
        return (
            <Html style={{ overflow: 'hidden', overscrollBehavior: 'none' }} lang="pt-BR">
                <Head>
                    <link rel="stylesheet" href="/bulma/css/bulma.min.css" />
                    <link rel="stylesheet" href="/bootstrap/css/bootstrap-grid.min.css"/>
                    <link rel="stylesheet" href="/bootstrap/css/bootstrap-reboot.min.css"/>
                    <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css"/>
                </Head>
                <body style={{
                    fontSize: '15px'
                }}>
                    <Main />
                    <NextScript />
                    <script type="text/javascript" src="/linkedin/insighttag/setup.js"/>
                    <script type="text/javascript" src="/linkedin/insighttag/initialize.js"/>
                    <noscript>
                        <img 
                        height="1" 
                        width="1" 
                        style={{display:"none"}} 
                        alt="" 
                        src="https://px.ads.linkedin.com/collect/?pid=4029201&fmt=gif"
                        />
                    </noscript>
                </body>
            </Html>
        )
    }
}

export default MyDocument
