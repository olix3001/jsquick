const buildTag = (name, options, content) => {
    if (options == null && content == null) {
        options = name[1]
        content = name[2]
        name = name[0]
    }

    const element = document.createElement(name)
    for (let key of Object.keys(options)) {

        // special cases
        if (key.startsWith('on')) {
            element.setAttribute(key, `(${options[key]})()`)
            continue
        }

        // default case
        element.setAttribute(key, options[key])
    }

    if (typeof content == 'string') {
        element.appendChild(document.createTextNode(content))
    } else {
        for (let e of Object.keys(content)) {
            element.appendChild(buildTag(content[e][0], { id: e, ...content[e][1] }, content[e][2]))
        }
    }

    return element
}