class JSQComponent {
    constructor(variables) {
        let vars = variables || {};

        this.state = {}
        this.JSQattributes = null
        this.JSQtag = null

        for (let key of Object.keys(vars)) {
            Object.defineProperty(this.state, key, {
                get: () => vars[key],
                set: val => {
                    vars[key] = val
                    this.reload()
                }
            })
        }
    }

    JSQbind(tag, attributes) { this.JSQtag = tag; this.JSQattributes = attributes }
    reload(force) {
        if (force) {
            let temp = this.render(this.JSQattributes).elem
            this.JSQtag.parentNode.replaceChild(temp, this.JSQtag)
            this.JSQtag = temp
            return
        }
        this.JSQtag = JSQCreplaceDifferences(this.JSQtag, this.render(this.JSQattributes).elem)
    }

    render(attributes) {
        return $.create('div')
    }

    once() {

    }

}

const JSQCreplaceDifferences = (tag, to) => {
    // attributes
    if (tag.attributes && to.attributes) {
        if (tag.attributes.length != to.attributes.length) JSQcopyAttributes(to, tag)
        for (let i = 0; i < to.attributes.length; ++i) {
            if (tag.attributes[i].name != to.attributes[i].name || tag.attributes[i].value != to.attributes[i].value) {
                JSQcopyAttributes(to, tag)
            }
        }
    }

    if (tag.childNodes.length != to.childNodes.length) { tag.parentNode.replaceChild(to, tag); return to; }
    if (tag.innerHTML != to.innerHTML) { tag.parentNode.replaceChild(to, tag); return to; }

    return tag;
}
