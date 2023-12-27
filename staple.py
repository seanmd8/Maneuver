# Simple python file to combine all the js files in the source folder into a single js.
# Resorted to this as neither ES6 nor cjs worked locally without a server.

import os
def main():
    source = os.listdir("./source")
    destination = "Maneuver.js"
    body = ""
    for i in range(len(source)):
        body += read_file("./source/" + source[i])
    write_file(destination, body)

def read_file(file_name):
    # Reads the given file and returns it's text.
    f = open(file_name, "r")
    text = f.read()
    f.close()
    return text

def write_file(file_name, text):
    # Writes the text to a file overwriting it's current content.
    f = open(file_name, "w")
    f.write(text)
    f.close()


main()