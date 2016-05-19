#!/usr/bin/env python3

import urllib.request

import sys

if (len(sys.args) != 1) {
    raise ValueError('Usage: ./scrape.py <url>');
}

url = sys.args[1]
page = urllib.request.urlopen(url)
herp = page.read()
print(herp)