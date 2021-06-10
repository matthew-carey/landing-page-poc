# landing-page-poc

This is a project designed to work with the existing implementation of Bootstrap in Hoot Home. It's vanilla JS, HTML and JSON at the moment with the majority of the images as SVG.

The purpose is to demonstrate the ability to change the appearance of the app through a few variables.

## Features

By appending a querystring onto the index page URL the user can change the content and look of this site. To add a querystring add a `?` to the end of the URL in your browser's address bar.  Then add parameters and values (`parameter=value`) as described below. Chain together multiple variables with `&`. Example `index.html?result=maybe&color=75868c&secondary=f57f29&brand=w`

1. **Page content:** Use the parameter `result=` to change the content in this portion of the page. The acceptable values for this parameter are: `success`, `maybe`, or `failure`.

2. **Primary color:** Use the parameter `color=` to change the primary color used throughout the page. The acceptable values for this parameter are 6-character hexadecimal (a-f, 0-9) strings (ex. `e20074` or `00a880`). *Notes: Do not include the `#`. 3-character hex shortcodes will not work.*

3. **Secondary color:** Use the parameter `secondary=` to change the secondary color used throughout the page. The acceptable values for this parameter the same as `color=` above. *Note that the secondary color is currently only shown with `result=maybe` or `result=success`.*

4. **Brand:** Use the parameter `brand=` to change the images in the sidebar. The acceptable values for this parameter are: `r` for Hoot or `w` for UMX. *Note that this only changes the sidebar at the moment, not all mentions of product names, links, etc.*

5. **Multi-language support:** The text in the main portion of the page can be displayed in English, French, or German depending on the preferred langauge set in your browser. [Click here for instructions on changing your browser's preferred language.](https://www.computerhope.com/issues/ch001904.htm) *Note that the translations are from Google Translate and may not be perfect.*

## To-do

- Better breakpoints for smaller screens. This has not been optimized for mobile or tablet.
- Better handling of sidebar overflow/scroll on smaller screens.
- Build process utilizing SCSS, code minification, and actual templating.
- More content for sidebar nav to get to. In reality this would most likely be implemented with React, but that plus routing are outside the scope of this current POC.
- Address styling for things like `#sidebar ul li.active>a, a[aria-expanded="true"]`
- Better application of SVG and CSS re-coloring (multiple functions could be refactored and combined, )
- Investigate solution akin to SCSS lighten with plain CSS (as I don't have an build process with SCSS at the moment). [CSS filter looks promising](https://css-tricks.com/almanac/properties/f/filter/).

## Bugs

- Safari bug for sidebar footer (stays in place when sidebar is collapsed).
- SVGs do not recolor based on querystring variables on Android.