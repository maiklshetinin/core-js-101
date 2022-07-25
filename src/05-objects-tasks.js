/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
  return this;
}
/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = Object.create(proto);
  const keys = Object.keys(JSON.parse(json));
  const values = Object.values(JSON.parse(json));
  keys.forEach((el, index) => { obj[el] = values[index]; });
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Builder {
  constructor() {
    this.value = '';
    this.ID = false;
    this.ELEMENT = false;
    this.PSEUDOELEMENT = false;
    this.PSEUDOCLASS = false;
    this.CLASS = false;
    this.ATTR = false;
  }

  element(value) {
    if (this.ELEMENT) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.ID) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.ELEMENT = true;
    this.value += value;
    return this;
  }

  id(value) {
    if (this.ID) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.CLASS) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    if (this.PSEUDOELEMENT) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.ID = true;
    this.value += `#${value}`;
    return this;
  }

  class(value) {
    if (this.ATTR) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.CLASS = true;
    this.value += `.${value}`;
    return this;
  }

  attr(value) {
    if (this.PSEUDOCLASS) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.ATTR = true;
    this.value += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (this.PSEUDOELEMENT) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.PSEUDOCLASS = true;
    this.value += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.PSEUDOELEMENT) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.PSEUDOELEMENT = true;
    this.value += `::${value}`;
    return this;
  }

  stringify() {
    return this.value;
  }
}

const cssSelectorBuilder = {
  value: '',
  element(value) {
    const obj = new Builder();
    return obj.element(value);
  },

  id(value) {
    const obj = new Builder();
    return obj.id(value);
  },

  class(value) {
    const obj = new Builder();
    return obj.class(value);
  },

  attr(value) {
    const obj = new Builder();
    return obj.attr(value);
  },

  pseudoClass(value) {
    const obj = new Builder();
    return obj.pseudoClass(value);
  },

  pseudoElement(value) {
    const obj = new Builder();
    return obj.pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    this.value = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;

    return this;
  },
  stringify() {
    return this.value;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
