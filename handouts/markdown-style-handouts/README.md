# Use Markdown to Style Handouts

## About

This process relies ont eh api scripts for markdown-handouts

### Getting Started
Create a new **"Handout"** named **"Style Sheet"** and in the **"GM Notes"** place:
```
[css]
h1 {color: red;}
```
**Save changes.**
In the **"Description & Notes"** section you should see the processed **CSS**
```
[css](-LxpMeYSNUYwZIVXxguT)
h1 {color: red;}
```
> **NOTE:** The "-LxpMeYSNUYwZIVXxguT"` part is the object id for your handout. It will not be the same as you see in this example.
That is the "link" for this style sheet. ***Copy*** *it to the clipboard.*
Create a new **"Handout"** named **"Markdown Handout"** and in the **"GM Notes"** place:
```
[md]
[css](-LxpMeYSNUYwZIVXxguT)
# This Heading should be red.
```
(You should ***paste*** in what you *copied to the clipboard* to the second line.)
> **NOTE:** The "-LxpMeYSNUYwZIVXxguT"` part is the object id for your handout. It will not be the same as you see in this example.
**Save changes.**
In the **"Description & Notes"** section you should see the processed **Markdown.**
It should be large red text reading:
<span style="font-size: 2em; font-weight: bolder; color: red;">This Heading should be red.</span>
(if you tire of the "Getting Started" or "Example" handouts, delete this script or archive the handouts.)