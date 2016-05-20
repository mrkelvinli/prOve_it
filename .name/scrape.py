#!/usr/bin/env python3

import urllib.request
import sys

if (len(sys.argv) != 2):
    str = ''
    for arg in sys.argv:
        str += arg + ' '
    raise ValueError('Usage: ./scrape.py <url>, current command: ' + str);

url = sys.argv[1]
# print("       > url: " + url + "\n\n\n\n")
page = urllib.request.urlopen(url)
herp = page.read()
print(herp)