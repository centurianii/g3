![g3 Logo](imgs/g3-200x134.png)
# {@link g3.Highlight} example class
We implement this class as an example of the **hybrid** class system.

It abstracts four libraries and the use of the class follows the `switchboard` 
approach; user supplies different object-values to the same method `init()` and 
the system responds accordingly by loading some files and applying modifications 
on nodes.

A [test](https://centurianii.github.io/g3/test-g3Highlight-1.html) page is built: 
an evaluator page filled with code tabs and stripped off the highlighting/loading 
library that normaly is attached to the evaluator (see 
[evaluator generic](https://centurianii.github.io/g3/test-g3evaluator-1.html) 
because in this case we actually want to test highlighting.

### License
part of g3 library under MIT license
