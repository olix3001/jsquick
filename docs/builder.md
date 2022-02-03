# Builder
This tool allows you to create elements in form of:
```js
buildTag('div', {}, {
    elementId: ['type', {
        some: 'attributes'
    }, 'inner text'],

    secondElementId: ['type', {
        some: 'attributes',
        and: 'more of them'
    }, {
        childId: ['childType', {}, 'something']
    }]
})
```

For an example check out this [example](/examples/buildTag.html)