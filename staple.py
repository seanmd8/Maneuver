import os
def main():
    source = os.listdir("./source")
    destination = "Maneuver.js"
    body = ""
    for i in range(len(source)):
        body += read_file("./source/" + source[i])
    write_file(destination, body)

def read_file(file_name):
    f = open(file_name, "r")
    text = f.read()
    f.close()
    return text

def write_file(file_name, text):
    f = open(file_name, "w")
    f.write(text)
    f.close()


main()