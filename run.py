import json
from sys import argv
with open("test.txt", "w") as f:
    f.write(argv[1])
data = json.loads(argv[1])
json.dump(data, open("test.json", "w"))

