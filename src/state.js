
const JSQAttrsMap = {};

const bindState = (name, defaultValue, onChange) => {
    onChange = onChange || (() => { })
    let BID = 'JSQ_' + JSQuuid()
    let binding = `<span class=${BID}>${defaultValue}</span>`
    JSQreplaceInDoc(`{{${name}}}`, binding)
    let stateValue = defaultValue
    return [() => stateValue, (value) => {
        JSQsetClassContent(BID, value)
        stateValue = value
        onChange(value)
    }];
}

const bindAttr = (type, name, defaultValue, onChange) => {
    onChange = onChange || (() => { })
    let BID = 'JSQ_' + JSQuuid()
    let attrName = `q_${type}`
    let withSel = document.querySelectorAll('[' + attrName + ']')
    let binding = '{{' + name + '}}'

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
        for (let e of document.getElementsByClassName(BID)) {
            e.setAttribute(type, JSQReplaceAllAttrs(e.attributes.getNamedItem(attrName), attrName, binding, e, value))
        }
        attrValue = value
        onChange(value)
    }]
    JSQAttrsMap[name] = (s) => s.replace(binding, temp[0]());
    return temp;
}


const JSQReplaceAllAttrs = (attr, attrName, binding, e, value) => {
    let attrV = attr.value.replace(binding, value)

    const m = e.attributes.getNamedItem(attrName).value.matchAll(/\{\{\w+\}\}/g);
    let r = m.next();
    while (r.value != undefined) {
        let fm = JSQAttrsMap[r.value[0].substr(2, r.value[0].length - 4)]
        if (fm) attrV = fm(attrV)
        r = m.next();
    }
    return attrV
}