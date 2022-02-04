class JSQC {
    constructor() { return null; }

    static register(component) {
        if (!(component.prototype instanceof JSQComponent)) throw 'You can only register a class that extends JSQComponent'

        const name = component.prototype.constructor.name

        let n = $(name).size
        for (let i = 0; i < n; ++i) {
            const instance = new component();
            let tag = JSQfindTag(name)
            // get attributes from the tag

            let attributes = {
                children: tag.childNodes,
                idl: {},
                idg: key => { let u = `JSQC_${JSQuuid()}`; attributes.idl[key] = u; return u },
                _index: i
            }
            for (let at of Array.from(tag.attributes)) {
                attributes[at.name] = at.value
            }

            let nt = instance.render(attributes).elem;
            instance.JSQbind(nt, attributes)
            // replace this tag
            tag.parentNode.replaceChild(nt, tag)
        }
        // TODO: implement class states like in vue js and pass attributes to render function
    }
}