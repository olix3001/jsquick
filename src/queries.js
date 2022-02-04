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
        if ((typeof name) == 'string')
            this.elem.setAttribute(name, val)
        else {
            for (let key of Object.keys(name)) {
                this.elem.setAttribute(key, name[key])
            }
        }

        return this
    }

    add(elem) {
        if (elem instanceof JSQQueryElement) elem = [elem]
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

    copy() {
        return new JSQQueryElement($.clone(this.elem, this.elem.tagName))
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

    clone(tag, name) {
        let newTag = $.create(name).html(tag.innerHTML)
        if (tag.attributes)
            for (let at of Array.from(tag.attributes)) {
                newTag.attr(at.name, at.value)
            }
        return newTag.elem
    }
}

const $ = new JSQ()

// Construct list element automatically
class JSQQueryElementList {
    constructor(list) {
        this.elements = list;
    }

    get size() {
        return this.elements.length
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