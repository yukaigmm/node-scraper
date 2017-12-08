let makeConfig = ({
    layerConfig,
    layerOrder,
    pageContent,
    pageData,
    pageOrder,
    header,
    charset,
}) => {
    return {
        layerConfig,
        layerOrder,
        pageContent,
        pageData,
        pageOrder,
        header,
        charset,
    }
}
module.exports = makeConfig;