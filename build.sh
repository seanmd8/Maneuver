#!/bin/sh
python py/staple.py build
start chrome --new-window $(PWD)/Maneuver.html
# Run using ./build.sh in a bash terminal
