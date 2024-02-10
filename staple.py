# Simple python file to combine all the js files in the source folder into a single js.
# Resorted to this as neither ES6 nor cjs worked locally without a server.

import os
def main():
    staple("./source", "Maneuver.js", True)
    staple("./css", "ManeuverStyles.css")

def staple(folder, destination, jsd_enabled = False):
    # Concatonates each file in the given folder into one document which is saved as the destination. 
    # If jsd enabled is true, enables it in the resulting document.
    body = ""
    if(jsd_enabled):
        body = "// @ts-check\n"
    body += read_files_recursively(folder)
    write_file(destination, body)

def read_files_recursively(folder):
    source = os.listdir(folder)
    body = ""
    for i in range(len(source)):
        contents_path = folder + "/" + source[i]
        if(os.path.isfile(contents_path)):
            body += read_file(contents_path)
        if(os.path.isdir(contents_path)):
            body += read_files_recursively(contents_path)
    return body

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