class JSQC {
    constructor() { return null; }

    static register(component) {
        if (!(component.prototype instanceof JSQComponent)) throw 'You can only register a class that extends JSQComponent'

        const instance = new component();

        JSQreplaceTags(component.prototype.constructor.name, instance.render()) // TODO: implement class states like in vue js and pass attributes to render function
    }
}