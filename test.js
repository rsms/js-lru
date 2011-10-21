// Test which will run in nodejs
// $ node test.js
// (Might work with other CommonJS-compatible environments)
var assert = require('assert'),
    LRUCache = require('./lru').LRUCache;
var c = new LRUCache(4);

c.put('adam', 29);
c.put('john', 26);
c.put('angela', 24);
c.put('bob', 48);
assert.equal(c.toString(), 'adam:29 < john:26 < angela:24 < bob:48');

assert.equal(c.get('adam'), 29);
assert.equal(c.get('john'), 26);
assert.equal(c.get('angela'), 24);
assert.equal(c.get('bob'), 48);
assert.equal(c.toString(), 'adam:29 < john:26 < angela:24 < bob:48');

assert.equal(c.get('angela'), 24);
assert.equal(c.toString(), 'adam:29 < john:26 < bob:48 < angela:24');

c.put('ygwie', 81);
assert.equal(c.toString(), 'john:26 < bob:48 < angela:24 < ygwie:81');
assert.equal(c.get('adam'), undefined);

c.set('john', 11);
assert.equal(c.toString(), 'bob:48 < angela:24 < ygwie:81 < john:11');
assert.equal(c.get('john'), 11);

var expectedKeys = ['bob', 'angela', 'ygwie', 'john'];
c.forEach(function(k, v) {
  //sys.puts(k+': '+v);
  assert.equal(k, expectedKeys.shift());
})

var current_size = c.size;
c.remove('john');
assert.equal(current_size - 1, c.size);

//test remove
var to_remove = new LRUCache(4);
to_remove.put('adam', 29);
to_remove.put('john', 26);
to_remove.remove('adam');
to_remove.remove('john');
assert.equal(to_remove.size, 0);
assert.equal(to_remove.head, undefined);
assert.equal(to_remove.tail, undefined);
// If we made it down here, all tests passed. Neat.
