class JSQQueryElement {
    constructor(elem) {
        this.elem = elem;
    }

    on(event, callback) {
        this.elem.addEventListener(event, callback)
    }

    css(prop, val) {
        this.elem.style.setProperty(prop, val)
    }
}

class JSQ extends Function {
    constructor() {
        super('...args', 'return $.call(...args)')
    }
    call(selector) {
        let sel = document.querySelectorAll(selector)
        if (sel.length == 0) return null
        else if (sel.length == 1) return new JSQQueryElement(sel[0])
        else return new QueryElementList(sel.map(e => new JSQQueryElement(e)))
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