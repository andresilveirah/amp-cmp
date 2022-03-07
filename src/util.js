export const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace('[', '\\$&');
    name = name.replace(']', '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace('+', ' '));
}

export const getSourceUrlConfigs = () => {
    let sourceUrlConfigs = {}
    let sourceUrl = getParameterByName('source_url')

    if (sourceUrl) {
        let configMap = {
            '_sp_version': 'scriptVersion'
        }

        for (let qv in configMap) {
            let val = getParameterByName(qv, sourceUrl)
            if (val) {
                sourceUrlConfigs[configMap[qv]] = val
            }
        }

        let spEnv = getParameterByName('_sp_test_env', sourceUrl)
        switch(spEnv) {
            case "preprod":
                sourceUrlConfigs.baseEndpoint = 'https://preprod-cdn.privacy-mgmt.com'
                break;
            case "stage":
                sourceUrlConfigs.baseEndpoint = 'https://cdn.sp-stage.net'
                break;
            default:
                break;
        }
        let spWrapperEnv = getParameterByName('_sp_wrapper_env', sourceUrl)
        switch(spWrapperEnv) {
            case "stage":
                sourceUrlConfigs.wrapperAPIOrigin = 'https://cdn.sp-stage.net/wrapper'
                break;
            default:
                break;
        }
    }

    return sourceUrlConfigs
}