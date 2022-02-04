/* jsquick - v1.0.0 - 2022-02-04 */
// Source: src/builder.js
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
// Source: src/helpers.js
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

// Source: src/main.js

// Source: src/queries.js
class JSQQueryElement {
    constructor(elem) {
        this.elem = elem;
    }

    on(event, callback) {
        this.elem.addEventListener(event, callback)
        return this
    }

    css(prop, val) {
        this.elem.style.setProperty(prop, val)
        return this
    }

    attr(name, val) {
        this.elem.setAttribute(name, val)
        return this
    }

    add(...elem) {
        for (let e of elem) {
            e = e.elem || e
            this.elem.appendChild(e)
        }
        return this
    }

    click() {
        this.elem.click()
        return this
    }

    text(value) {
        this.elem.innerText = value
        return this
    }

    html(value) {
        this.elem.innerHTML = value
        return this
    }

    addClass(name) {
        this.elem.classList.add(name)
        return this
    }

    remClass(name) {
        this.elem.classList.remove(name)
        return this
    }

    id(value) {
        this.elem.id = value
        return this
    }

    focus() {
        this.elem.focus()
        return this
    }

    value(val) {
        if (val == undefined) {
            return this.elem.value
        } else {
            this.elem.value = val
            return this
        }
    }
}

class JSQ extends Function {
    constructor() {
        super('...args', 'return $.call(...args)')
        this.body = new JSQQueryElement(document.querySelector('body'))
    }

    call(selector) {
        let sel = document.querySelectorAll(selector)
        if (sel.length == 0) return null
        else if (sel.length == 1) return new JSQQueryElement(sel[0])
        else {
            let list = [];
            for (let s of sel) list.push(new JSQQueryElement(s))
            return new JSQQueryElementList(list)
        }
    }

    download(filename, content, type) {
        type = type || 'file'

        let href = '';
        if (type == 'text') {
            href = `data:text/plain;charset=utf-8,` + encodeURIComponent(content)
        } else if (type == 'file') {
            href = content
        }

        $.create('a').attr('href', href).attr('download', filename).click()
    }

    create(type, options) {
        return new JSQQueryElement(document.createElement(type, options))
    }

    request(url, method, body, options) {
        return new Promise((resolve, reject) => {
            let o = {
                method: method,
                ...options
            };
            if (body != null && Object.keys(body).length != 0) o.body = body
            fetch(url, o).then(resolve).catch(reject)
        });
    }

    get(url, options) {
        return this.request(url, 'GET', {}, options)
    }

    post(url, body, options) {
        return this.request(url, 'POST', body, options)
    }

    put(url, body, options) {
        return this.request(url, 'PUT', body, options)
    }

    delete(url, body, options) {
        return this.request(url, 'DELETE', body, options)
    }

    patch(url, body, options) {
        return this.request(url, 'PATCH', body, options)
    }
}

const $ = new JSQ()

// Construct list element automatically
class JSQQueryElementList {
    constructor(list) {
        this.elements = list;
    }
}
Object.getOwnPropertyNames(JSQQueryElement.prototype).forEach(t => {
    let e = JSQQueryElement.prototype[t]
    if (typeof e == 'function') {
        Object.defineProperty(JSQQueryElementList.prototype, e.name, {
            configurable: true,
            writable: true,
            value: function (...args) {
                for (let v of this.elements) e.call(v, ...args)
            }
        })

    }
})
// Source: src/state.js

const JSQAttrsMap = {};

const bindState = (name, defaultValue, onChange, processor) => {
    onChange = onChange || (() => { })
    processor = processor || (value => value)
    let BID = 'JSQ_' + JSQuuid()
    defaultValue = processor(defaultValue)
    let binding = `<span class=${BID}>${defaultValue}</span>`
    JSQreplaceInDoc(`{{${name}}}`, binding)
    let stateValue = defaultValue
    return [() => stateValue, (value) => {
        let val = processor(value)
        JSQsetClassContent(BID, val)
        stateValue = val
        onChange(val)
    }];
}

const bindAttr = (type, name, defaultValue, onChange, processor) => {
    onChange = onChange || (() => { })
    processor = processor || (value => value)
    let BID = 'JSQ_' + JSQuuid()
    let attrName = `q_${type}`
    let withSel = document.querySelectorAll('[' + attrName + ']')
    let binding = '{{' + name + '}}'
    defaultValue = processor(defaultValue)

    for (let e of withSel) {
        let attr = e.attributes.getNamedItem(attrName)
        if (attr.value.includes(binding)) {
            e.classList.add(BID)
            //e.attributes.removeNamedItem(attrName)
            e.setAttribute(type, JSQReplaceAllAttrs(attr, attrName, binding, e, defaultValue))
        }
    }
    let attrValue = defaultValue;
    let temp = [() => attrValue, (value) => {
        let val = processor(value)
        for (let e of document.getElementsByClassName(BID)) {
            e.setAttribute(type, JSQReplaceAllAttrs(e.attributes.getNamedItem(attrName), attrName, binding, e, val))
        }
        attrValue = val
        onChange(val)
    }]
    JSQAttrsMap[name] = (s) => s.replace(binding, temp[0]());
    return temp;
}


const JSQReplaceAllAttrs = (attr, attrName, binding, e, value) => {
    let attrV = attr.value.replaceAll(binding, value)

    const m = e.attributes.getNamedItem(attrName).value.matchAll(/\{\{\w+\}\}/g);
    let r = m.next();
    while (r.value != undefined) {
        let fm = JSQAttrsMap[r.value[0].substr(2, r.value[0].length - 4)]
        if (fm) attrV = fm(attrV)
        r = m.next();
    }
    return attrV
}
// Source: src/utils.js
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
