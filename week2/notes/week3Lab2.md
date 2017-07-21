#### reduce page load time
* 
* put the resource on different domain, since pallarlal request on the same domain is limited
* but has DNS look up problem, we can do DNS prefetch
* also can do resource prefetching

### Database Index
* fast retrival
* B-tree, order N, each node can store at most N-1 key, has at most N children
* Binary-serach tree, b-tree order 2
* B-tree is not suitable for sequencial insert data, since the tree structure changed frequantly
* B+-tree, only the key in the leaf node can have a pointer to its value
* link between leaf node
* B+ tree can store more keys since only leaf node store value
* locality, since leaf nodes are linked, can reduce memory operation. but if we use SSD, then not a big improvemnt. but can optimize disk i/o
* index is also store in disk, read index is also disk i/o
* B+ tree has a additional pointer to the beginning of the leaf node
* optimize search by range

### MongoDB
* single document => modify the fields in single document, it is atomic. However, single document should fit in one machine
* 2PC
* advance: flexible: schema-less, scalability

### Garbage collector
* reference counting: cannot detect circular reference 