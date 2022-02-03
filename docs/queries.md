# Queries
JQuery inspired system

## Query an element
```js
$('selector')
```
where `selector` is standart html selector like `#id`

## add event listener
```js
$('selector').on('click', () => console.log('Hello world'))
```
where `click` can be replaced with any event

## set css property
```js
$('selector').css('background-color', 'red')
```
where both arguments can be replaced with any property and value that you want