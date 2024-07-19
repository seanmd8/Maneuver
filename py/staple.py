# Simple python file to combine all the js files in the source folder into a single js.
# Resorted to this as neither ES6 nor cjs worked locally without a server.

import os
import argparse

def main(mode):
    if mode == "test":
        staple("source", "ManeuverTest.js", True)
    elif mode == "build":
        source_folders = get_folders_in("source")
        staple(source_folders, "Maneuver.js", True)
        staple("css", "ManeuverStyles.css")

def staple(folders, destination, jsd_enabled = False):
    # Concatonates each file in the given folder into one document which is saved as the destination. 
    # If jsd enabled is true, enables it in the resulting document.
    if not type(folders) is list:
        folders = [folders]
    body = ""
    if(jsd_enabled):
        body = "// @ts-check\n"
    for f in folders:
        body += read_files_recursively(f)
    write_file(destination, body)

def read_files_recursively(folder):
    source = os.listdir(folder)
    body = ""
    for f in source:
        contents_path = folder + "/" + f
        if(os.path.isfile(contents_path)):
            body += read_file(contents_path)
            body += "\n"
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

def get_folders_in(folder):
    source = os.listdir(folder)
    folders = []
    for f in source:
        contents_path = folder + "/" + f
        if(os.path.isdir(contents_path)):
            folders.append(contents_path)
    return folders




if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('mode', type=str, help='build || test')
    args = parser.parse_args()

    main(args.mode)