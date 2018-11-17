![g3 Logo](imgs/g3-200x134.png)
# {@link g3.Loader} example class
We implement this class as an example of the **headless** class system that is 
stripped off the node handling methods.

A loader is a critical tool when one library depends on another and we want to 
run some functions between the loading of 2 different files. This is not an 
everyday situation though.

A [test](https://centurianii.github.io/g3/test-g3Loader-1.html) page is built: 
an evaluator page filled with code tabs and stripped off the highlighting/loading 
library that normaly is attached to the evaluator (see 
[evaluator generic](https://centurianii.github.io/g3/test-g3evaluator-1.html) 
because in this case we actually want to test loading.

### License
part of g3 library under MIT license
