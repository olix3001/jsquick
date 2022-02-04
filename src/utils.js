function JSQuuid() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

const JSQreplaceInDoc = (from, to) => {
    JSQreplaceInTag(from, to, document.body)
}
const JSQreplaceInTag = (from, to, tag) => {
    for (let cn of tag.childNodes) {
        JSQreplaceInTag(from, to, cn)
    }

    if (tag.nodeType == Node.TEXT_NODE) {
        if (tag.textContent.replace(/\s|\n/g, '') == '') return
        let replacementNode = $.create('jsq').html(tag.textContent.replaceAll(from, to)).elem
        tag.parentNode.insertBefore(replacementNode, tag);
        tag.parentNode.removeChild(tag);
    }
}

const JSQsetClassContent = (className, value) => {
    for (let e of document.getElementsByClassName(className)) {
        e.innerHTML = value;
    }
}
const JSQsetClassAttrContent = (className, attr, value) => {
    for (let e of document.getElementsByClassName(className)) {
        e.setAttribute(attr, value)
    }
}

const JSQcopyAttributes = (from, to) => {
    while (to.attributes.length > 0)
        to.removeAttribute(to.attributes[0].name)

    for (let at of Array.from(from.attributes)) {
        to.setAttribute(at.name, at.value)
    }
}

const JSQfindTag = (search, tag) => {
    if (search == undefined) return null
    tag = tag || $.body.elem
    for (let cn of tag.childNodes) {
        let temp = JSQfindTag(search, cn)
        if (temp) return temp
    }

    if (tag.tagName == search.toUpperCase()) {
        return tag
    }
}