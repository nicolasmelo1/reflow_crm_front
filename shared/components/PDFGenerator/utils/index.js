const retrieveHTMLWithContentToDownload = (contentHTMLElementObject) => {
    if (process.env['APP'] === 'web' && document) {
        let styles = ''
        Object.values(document.styleSheets).forEach(cssstylesheet => {
            if (cssstylesheet.href) {
                let style = ` <link href="${cssstylesheet.href}" rel="stylesheet"> `
                styles = styles + style

            } else {
                let style = ' <style type="text/css"> '
                style = style + Object.values(cssstylesheet.rules).map(rule => rule.cssText).join(' ')
                style = style + ' </style> '
                styles = styles + style
            }
        })
        const page = `
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style type="text/css">
                        html {
                            -webkit-print-color-adjust: exact;
                        }
                    </style>
                    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"/>
                    ${styles}
                </head>
                <body style="font-family: Roboto !important;">
                    ${contentHTMLElementObject.innerHTML.toString()}
                </body>
            </html>
        `
        return page
    }
}

export {
    retrieveHTMLWithContentToDownload
}