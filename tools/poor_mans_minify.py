#!/usr/bin/env python3
### Creates a minified version of clay_function.js, stripping comments and newlines. Using commercial
### minifiers appears to break some functionality within the script (namely field validation).
### Due to the nature of clay_function, it is converted to a string and sent up to the clay,
### A byproduct of this is that comments are also sent, making minification desirable.
import re

def remove_comments(string):
    pattern = r"(\".*?\"|\'.*?\')|(/\*.*?\*/|//[^\r\n]*$)"
    # first group captures quoted strings (double or single)
    # second group captures comments (//single-line or /* multi-line */)
    regex = re.compile(pattern, re.MULTILINE|re.DOTALL)
    def _replacer(match):
        # if the 2nd group (capturing comments) is not None,
        # it means we have captured a non-quoted (real) comment string.
        if match.group(2) is not None:
            return "" # so we will return empty to remove the comment
        else: # otherwise, we will return the 1st group
            return match.group(1) # captured quoted-string
    return regex.sub(_replacer, string).replace("\n","")

with open("../src/pkjs/data/clay_function.js") as infile, open("../src/pkjs/data/clay_function.min.js", "w") as outfile:
  outfile.write(remove_comments(infile.read()))

