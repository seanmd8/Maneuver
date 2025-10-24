#!/bin/bash
python py/staple.py build
start chrome --new-window $(PWD)/index.html
# Run using ./build.sh in a bash terminal
