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
  size :number;

  // Maximum number of items this map can hold
  limit :number;

  // Least recently-used entry
  oldest :Entry<K,V>;

  // Most recently-used entry
  newest :Entry<K,V>;

  // Put <value> into the cache associated with <key>. Replaces any existing entry
  // with the same key.
  // Returns any entry which was removed to make room for a new entry, or undefined.
  // Note: The behavior of this method changed between v0.1 and v0.2 where in v0.1
  // putting multiple values with the same key would store all values (accessible
  // via forEach and other forms of traversal.) v0.2 stores exactly one value per key.
  put(key :K, value :V) : Entry<K,V> | undefined;

  // Purge the least recently used (oldest) entry from the cache.
  // Returns the removed entry or undefined if the cache was empty.
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
  find(key :K) : Entry<K,V> | undefined;

  // Update the value of entry with <key>.
  // Returns the old value, or undefined if entry was not in the cache.
  set(key :K, value :V) : V | undefined;

  // Remove entry <key> from cache and return its value.
  // Returns the removed value, or undefined if not found.
  remove(key :K) : V | undefined;

  // Removes all entries
  // Returns nothing.
  removeAll(): void;

  // Return an array containing all keys of entries stored in the cache object, in
  // arbitrary order.
  keys() : Array<K>;

  // Call `fun` for each entry. Starting with the newest entry if `desc` is a true
  // value, otherwise starts with the oldest (head) enrty and moves towards the tail.
  // context, Object key, Object value, LRUCache self
  forEach(
    fun      :(context :any, key :K, value :V, self :LRUCache<K,V>)=>void,
    context? :any,
    desc?    :boolean
  ) : void;

  // Returns a JSON (array) representation
  toJSON() : Array<{key :K, value :V}>;

  // Returns a human-readable text representation
  toString() : string;
}
