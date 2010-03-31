# Least Recently Used (LRU) cache algorithm

A finite key-value cache using the [Least Recently Used (LRU)](http://en.wikipedia.org/wiki/Cache_algorithms#Least_Recently_Used) cache algorithm where the most recently used objects are keept in cache while less recently used items are purged.

This implementation is compatible with most JavaScript environments (including ye olde browser) and is very efficient.

## Terminology & design

- Based on a doubly-linked list for low complexity random shuffling of entries.

- The cache object iself has a "head" (least recently used entry) and a
  "tail" (most recently used entry).

- The "head" and "tail" are "entries" -- an entry might have a "newer" and
  an "older" entry (doubly-linked, "older" being close to "head" and "newer"
  being closer to "tail").

- Key lookup is done through a key-entry mapping native object, which on most 
  platforms mean `O(1)` complexity. This comes at a very low memory cost  (for 
  storing two extra pointers for each entry).

Fancy ASCII art illustration of the general design:

        entry             entry             entry             entry        
        ______            ______            ______            ______       
       | head |.newer => |      |.newer => |      |.newer => | tail |      
       |  A   |          |  B   |          |  C   |          |  D   |      
       |______| <= older.|______| <= older.|______| <= older.|______|      
                                                                           
    removed  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  added

## Example

    var c = new LRUCache(3);
    c.put('adam', 29);
    c.put('john', 26);
    c.put('angela', 24);
    c.toString();        // -> "adam:29 < john:26 < angela:24"
    c.get('john');       // -> 26
    // Now 'john' is the most recently used entry, since we just requested it
    c.toString();        // -> "adam:29 < angela:24 < john:26"
    c.put('zorro', 141); // -> {key:adam, value:29}
    // Because we only have room for 3 entries, put-ing 'zorro' purged 'adam'
    c.toString();        // -> "angela:24 < john:26 < zorro:141"

# API

An entry is a simple `Object` with at least two members: `{key:Object, value:Object}`. An entry might also have a `newer` member which points to a newer entry, and/or a `older` member pointing to an older entry.

### new LRUCache(Number limit) -> LRUCache instance

Creates a new cache object which will hold up to `limit` entries.

### *LRUCache.prototype*.size -> Number

Current number of entries. Read-only.

### *LRUCache.prototype*.limit <-> Number

Maximum number of items this cache will keep.

### *LRUCache.prototype*.put (Object key, Object value) -> Object entry

Put `value` into the cache associated with `key`.

**Returns an entry which was removed** (to make room for the new entry) or  `undefined` if there was enough space for the new entry.

> **Note:** The returned entry does **not** include any (strong) references to other entries (i.e. there is no `older` or `newer` members). This design makes garbage collection predictable.

### *LRUCache.prototype*.get (Object key) -> Object value

Retrieve value for, and register recent use of, `key`. Returns the value associated with `key` or `undefined` if not in the cache.

### *LRUCache.prototype*.find (Object key) -> Object entry

Check if `key` is in the cache *without registering recent use*. Feasible if
you do not want to chage the state of the cache, but only "peek" at it.
Returns the entry associated with `key` if found, otherwise `undefined` is
returned.

> **Note:** The entry returned is *managed by the cache* (until purged) and thus contains members with strong references which might be altered at any time by the cache object. You should look at the returned entry as being immutable.

### *LRUCache.prototype*.shift () -> Object entry

Remove the least recently used (oldest) entry. Returns the removed entry, or `undefined` if the cache was empty.

If you need to perform any form of finalization of purged items, this is a good place to do it. Simply override/replace this function:

    var c = new LRUCache(123);
    c.shift = function() {
      var entry = LRUCache.prototype.shift.call(this);
      doSomethingWith(entry);
      return entry;
    }

The returned entry must not include any strong references to other entries. See note in the documentation of `LRUCache.prototype.put (Object key, Object value) -> Object entry`.

### *LRUCache.prototype*.set (key, value) -> Object oldValue

Update the value of entry with `key` or `put` a new entry. Returns the old value, or undefined if the cache was empty.

### *LRUCache.prototype*.remove (key) -> Object value

Remove entry `key` from cache and return its value. Returns `undefined` if `key` is not found.

### *LRUCache.prototype*.removeAll () -> LRUCache instance

Removes all entries and return itself.

### *LRUCache.prototype*.keys () -> Array keys

Return an array containing all keys of entries in arbitrary order.

### *LRUCache.prototype*.forEach (fun, [Object context, Boolean desc | true])

Call `fun` for each entry. Starting with the newest entry if `desc` is a true
value, otherwise starts with the oldest (head) enrty and moves towards the
tail.

Returns nothing (`undefined`).

`fun` is called with 3 arguments in the context `context`:

    fun.call(context, Object key, Object value, LRUCache self)

Example which prints "key: value" starting with the most recent entry:

    cache.forEach(function(key, value) {
      puts(key+': '+value);
    }, true);


### *LRUCache.prototype*.toJSON () -> Array representation

Returns an array of object (for use by `JSON.stringify`) of the form:

    [
      {key:"key1", value:"value1"},
      {key:"key2", value:"value2"},
      {key:"key3", value:"value3"}
    ]

### *LRUCache.prototype*.toString () -> String representation

Returns a string representation in the format:

    key1:value1 < key2:value2 < key3:value3

Oldest (head) on the left hand side and newer entries to the right hand side.

## Factorising a minimal implementation

As this code is most suitable for embedding, here is a shortlist of the essential parts (prototype functions) needed for a minimal implementation. All other functions, not mentioned here, are simply ancillary.

- **LRUCache** -- the constructor is naturally a good thing to keep ;)
- *LRUCache.prototype*.**put** -- handles appending and chaining.
- *LRUCache.prototype*.**shift** -- used by **put** to "purge" an old entry.
- *LRUCache.prototype*.**get** -- fetches a cached entry and registers that entry as being recently used.

The border between "required" and "optional" code is marked in `lru.js` by a comment starting with `// Following code is optional`...

# MIT license

Copyright (c) 2010 Rasmus Andersson <http://hunch.se/>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
