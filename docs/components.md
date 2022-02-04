# Components system
To create a component, create a class that extends `JSQComponent` and then register it with `JSQC.register(<class>)`

Example:
```js
class ExampleComponent extends JSQComponent {
    constructor() {super()}

    render() {
        return $.create('p').text("Hello world")
    }
}

JSQC.register(ExampleComponent)
```
and then use it like
```html
<examplecomponent></examplecomponent>
```

## Attributes
to make use of html attributes
```html
<examplecomponent name="World"></examplecomponent>
```
just take them in render like below:
```js
render({ name }) {
    return $.create('p').text("Hello " + name)
}
```

## States
Components also support states. To define it, pass an object to the `super()` function, and then get or set `this.state.<name>`
```js
class ExampleComponent extends JSQComponent {
    constructor() {super({
        name: 'world'
    })}

    render() {
        return $.create('div').add([
            $.create('p').text("Hello " + this.state.name)
            $.create('button').text('change').on('click', () => this.state.name = 'button')
        ]);
    }
}
```
In this example, jsq will rerender only the changed part, which means the `p` element

## dynamic id's
To make use of dynamic ids, you can take `idg` (id generator) and `idl` (id list) like attributes, then use `idg('<id>')` to generate local object id or `idl['<id>']` to get this id

## index element
There is also `_index` in attributes, which is just an index of currently rendered element