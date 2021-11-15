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
        return (
            <Html style={{ overflow: 'hidden' }} lang="pt-BR">
                <Head />
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
