![g3 Logo](imgs/g3-200x134.png)
# {@link g3.Class} usage
`g3.Class` is a factory that produces class constructors with some unique characteristics like:

1) unlimited depth inheritance, 

2) constructor definition,

3) definition of `prototype` members,

4) definition of static members, 

5) definition of instance (per object) members,

6) use of function or object mixins

and much more.

User supplies just an object where it defines the class members using some special keys:
- `constructor` for (2),

- `prototype` for (3) which defines a new object with keys the prototype names,

- `STATIC` for (4) which defines a new object with keys the names of the static members,

- any other key defines an instance member.

![class ex.](imgs/class-1.jpg)

##Test
A [test](https://centurianii.github.io/g3/test-g3Class-1.html) page is built: 
an evaluator page filled with code tabs that apply tests on `Class` generator.

### License
part of g3 library under MIT license
