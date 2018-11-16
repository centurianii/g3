![g3 Logo](imgs/g3-200x134.png)
# {@link g3.hybrid} class system
As `hybrid` class we define a class that is built in a special way with the help 
of {@link g3.hybrid} or {@link g3.headless} as root classes and which exposes 
some interesting characteristics:

1) all instance properties are stored in `this.instance`,

2) defaults during (re-)initialization are stored in `this.defaults`,

3) nodes used during (re-)initializations are stored in `this.nodes` and added to
   `this.allNodes`,

4) the special member `defaults` under `STATIC` at the class definitions of the 
   hierarchy tree behave "paradoxically", they are inherited in such a way that: 

4.1) every child class overwrites the **common** members of parent and 
     **inherits** the not common ones in `defaults`,
    
4.2) every child class applies on top of `defaults` the user options supplied and
    
4.3) finally, the result of all the above mergings is stored in instance member 
     `this.defaults` and `this.instance.lastDefaults`,

5) every class contains a static member `Class.instances` which can store every 
   created object under a specific name if user desires so that there is no need
   to store objects from now on,

6) the constructor of a class calls `this.init` or `this.initn` where `n > 1` for 
   the second and higher classes in the hierarchy and this method calls in turn 
   only 3 methods: `this.switch` (inherited), `this.getNodes` (inherited) and 
   `this.build` or `this.buildn`, 

7) a user can call repeatedly `this.init` as it happens during construction 
   passing new options every time, 

8) the class defines a plugin for use by an external library like jQuery if and 
   when user desires having all the methods and properties of the class and

9) there is a plugin integrated system that user can:

9.1) activate globaly at the constructor defining new prototype methods from 
     plugin ones or

9.2) activate plugin methods per object during their construction. 

The above, form a design in which the user alters options instead of calling methods, 
an approach that simulates a switchboard that controls the behavior of an object.

In fact, the object behaves as the model class that accepts requests (actions) 
from the view or internally and responds accordingly.

This approach resembles a state machine or the SAM methodology of view-actions-model
and at the same time organizes the code in an unseen level.

The image denotes the merging process of static `defaults` during inheritance.

![hybrid ex.](imgs/hybrid-1.jpg)

### License
part of g3 library under MIT license
