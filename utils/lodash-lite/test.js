import { get, memoize } from './index'

const object = {
  a: [{ b: { c: 3 } }],
  name: 'jack',
  score: {
    maths: 98,
  },
};

console.log('test ', get(object, 'a[0].b'));
console.log('test ', get(object, 'a[0].b.c'));
console.log('test ', get(object, 'a.b.c', 'DEFAULT_DATA'));
console.log('test ', get(object, 'score.maths'));
console.log('test ', get(object, ['score', 'maths'], 'score.maths'));
console.log('test ', get(object, 'a[0]', '---'));

// console.log('stringToPath: ', stringToPath('.a[0].b.c'));

/* TEST **

const obj = {
  name: 'jack',
  age: '23'
};
Object.defineProperty(obj, 'hobby', {
  // value: ['12', 34, 56],
  // writable: true,
  // configurable: true,
  get () {
    console.log('>>>Invoked get() ~~~');
    return ['12', 34, 56];
  }
});

function getKey (key) {
  return obj[key] || 'DEFAULT_DATA';
}

console.log('memoize: ', memoize(getKey)('hobby'));
console.log('memoize: ', memoize(getKey)('hobby'));
console.log('memoize: ', memoize(getKey)('hobby'));
console.log('memoize: ', getKey('hobby'));

 */
