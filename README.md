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

# Usage

Just copy the code on lru.js — for minimal functionality, you only need the lines up until the comment that says "Following code is optional".

If you're really into package managers and love having lots of complicated little files in your project, you can use `npm install lru-fast`

# API

```ts

// An entry holds the key and value, and pointers to any older and newer entries.
interface Entry<K,V> {
  older :Entry<K,V>;
  newer :Entry<K,V>;
  key   :K;
  value :V;
}

export class LRUCache<K,V> {
  // Construct a new cache object which will hold up to limit entries.
  // When the size == limit, a `put` operation will evict the oldest entry.
  constructor(limit :number);

  // Current number of items
  size: number;

  // Maximum number of items this map can hold
  limit: number;

  // Most recently-used entry
  head: Entry<K,V>;

  // Least recently-used entry
  tail: Entry<K,V>;

  // Put <value> into the cache associated with <key>.
  // Returns the entry which was removed to make room for the new entry. Otherwise
  // undefined is returned (i.e. if there was enough room already).
  put(key :K, value :V) : Entry<K,V> | undefined;

  // Remove the least recently-used (oldest) entry from the cache.
  // Returns the removed entry, or undefined if the cache was empty.
  shift() : Entry<K,V> | undefined;

  // Get and register recent use of <key>.
  // Returns the value associated with <key> or undefined if not in cache.
  get(key :K) : V | undefined;

  // Check if <key> is in the cache without registering recent use. Feasible if
  // you do not want to chage the state of the cache, but only "peek" at it.
  // Returns the entry associated with <key> if found, or undefined if not found.
  //
  // Note: The entry returned is managed by the cache (until purged) and thus
  // contains members with strong references which might be altered at any time by
  // the cache object. You should look at the returned entry as being immutable.
  find(key :K) : V | undefined;

  // Update the value of entry with <key>.
  // Returns the old value, or undefined if entry was not in the cache.
  set(key :K, value :V) : V | undefined;

  // Remove entry <key> from cache and return its value.
  // Returns the removed value, or undefined if not found.
  remove(key :K) : V | undefined;

  // Removes all entries
  removeAll();

  // Return an array containing all keys of entries stored in the cache object, in
  // arbitrary order.
  keys() : Array<K>;

  // Call `fun` for each entry. Starting with the newest entry if `desc` is a true
  // value, otherwise starts with the oldest (head) enrty and moves towards the tail.
  // context, Object key, Object value, LRUCache self
  forEach(
    fun :(context :any, key :K, value :V, self :LRUCache<K,V>)=>void,
    context? :any,
    desc? :boolean
  ) : void;

  // Returns a JSON (array) representation
  toJSON() : Array<{key :K, value :V}>;

  // Returns a human-readable text representation
  toString() : string;
}
```

If you need to perform any form of finalization of items as they are evicted from the cache, wrapping the `shift` method is a good way to do it:

```js
let c = new LRUCache(123);
c.shift = function() {
  let entry = LRUCache.prototype.shift.call(this);
  doSomethingWith(entry);
  return entry;
}
```

The internals calls `shift` as entries need to be evicted, so this method is guaranteed to be called for any item that's removed from the cache. The returned entry must not include any strong references to other entries. See note in the documentation of `LRUCache.prototype.put (Object key, Object value) -> Object entry`.



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
