interface LRUCacheEntry<K,V> {
  older :LRUCacheEntry<K,V>;
  newer :LRUCacheEntry<K,V>;
  key   :K;
  value :V;
}

interface LRUCacheStatic<K,V> {
  new<K,V>(limit :number): LRUCacheStatic<K,V>;

  // Put <value> into the cache associated with <key>.
  // Returns the entry which was removed to make room for the new entry. Otherwise
  // undefined is returned (i.e. if there was enough room already).
  put(key :K, value :V) : LRUCacheStatic<K,V> | undefined;

  // Purge the least recently used (oldest) entry from the cache.
  // Returns the removed entry or undefined if the cache was empty.
  shift() : LRUCacheEntry<K,V> | undefined;

  // Get and register recent use of <key>.
  // Returns the value associated with <key> or undefined if not in cache.
  get(key :K) : V | undefined;

  // Check if <key> is in the cache without registering recent use. Feasible if
  // you do not want to chage the state of the cache, but only "peek" at it.
  // Returns the entry associated with <key> if found, or undefined if not found.
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
    fun :(context :any, key :K, value :V, self :LRUCacheStatic<K,V>)=>void,
    context? :any,
    desc? :boolean
  ) : void;

  // Returns a JSON (array) representation
  toJSON() : string;

  // Returns a human-readable text representation
  toString() : string;
}

declare module "lru-fast" {
  export = LRUCache;
}
declare var LRUCache: LRUCacheStatic<any,any>;
