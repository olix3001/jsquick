const loadJS = (url, onLoad) => {
    const scriptTag = document.createElement('script')
    scriptTag.src = url
    scriptTag.onload = onLoad
    document.body.appendChild(scriptTag)
}

const loadCSS = (url, onLoad) => {
    const styleTag = document.createElement('link')
    styleTag.rel = 'stylesheet'
    styleTag.href = url
    styleTag.onload = onLoad
    document.head.appendChild(styleTag)
}
