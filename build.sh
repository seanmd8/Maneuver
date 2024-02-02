#!/bin/sh
python staple.py
start chrome --new-window $(PWD)/Maneuver.html    # Opens a new window, but says "this site can't be reached"
