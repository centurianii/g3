![g3 Logo](imgs/g3-200x134.png)
# {@link g3.evaluator} testing tool
This is a testing tool capable of code execution as in the Dev Tools console of 
your browser.

Commands are written and executed in a specific area with the title _**`Blackboard`**_ 
and the results are printed **on page** in an area with title _**`Console`**_.

Some characteristics of this tool:

1) implements an _on the page_ `console.log()`,

2) analyzes any object, host, native or custom with the help of {@link g3.debug},

3) uses a `console.log` that user types at the _**`Blackboard`**_ which writes 
   at the _**`Console`**_ area and accepts 2 arguments, a value and an integer 
   denoting the analyzed depth of the passed value,
   
![Blackboard & Console](imgs/blackboard-console.png)

4) there are 2 areas that serve a load/remove of any `.css` file at the `head` of 
   the page:

4.1) _**`Add/Remove .css library`**_ and 

![Add/Remove .css](imgs/add-remove-css.png)

4.2) _**`Load .css library`**_,

![Load .css](imgs/load-css.png)

5) there are 2 areas that serve a load/remove of any `.js` file at the bottom of 
   the `body`:

5.1) _**`Add/Remove .js library`**_ and 

![Add/Remove .js](imgs/add-remove-js.png)

5.2) _**`Load .js library`**_,

![Load .js](imgs/load-js.png)

6) area _**`Manage stub/frame`**_ loads/removes any page in a `iframe` from button 
   `Load file in frame` and `Remove frame` respectively,
   
![Manage stub/frame](imgs/manage-stub-frame.png)

7)  buttons `Clone frame to stub-HEAD` and `Remove cloned` in _**`Manage stub/frame`**_ 
    clone/remove a frame on page respectively; the cloning happens as follows:

7.1) frame header libraries go on page `header` and 

7.2) frame scripts of `body` go to the bottom of the page's `body`,

8) _**`Add/Remove panel`**_ area creates panels that collect tabs of code,

![Add/Remove panel](imgs/add-remove-panel.png)

9) code from _**`Blackboard`**_ area can be saved to panels,

10) code from a highlighted tab in a panel can be loaded to the _**`Blackboard`**_ 
    area for execution,

11) a tab of code can be deleted,

12) _**`Load html`**_ area can load the actual contents of the evaluation page 
    so that it can be used by the user to update the page,

![Load html](imgs/load-html.png)

13) at the moments the user's work is not saved after a browser's refresh but it's
    up to the user to collect the contents from _**`Load html`**_ area.

### License
part of g3 library under MIT license
