# State system
This library focues on providing react-like hooks system, and one of it's parts is a state system

## bindState
You can use `bindState` function to create a new state.<br/>
To use this state in html use `{{state}}`. ex:
```html
<p>Hello {{name}}</p>
```
and then register it in js
```js
const [getName, setName] = bindState('name', 'World');
// first argument is state name and the second one is it's default value
```
You can add some function as last function argument which will be fired each time the value changes.

## bindAttr
You can do the same as `bindState` for attributes in your tags.<br/>
To bind an attribute, add `q_` before it's name. ex:
```html
<img q_src="{{name}}" />
```
and then bind it using
```js
const [getSrc, setSrc] = bindAttr('src', 'name', '/yourimage.png');
// first argument is attribute name used to optimize initialization times, the second one is binding name and the last one is default value of the attribute
```
You can add some function as last function argument which will be fired each time the value changes.