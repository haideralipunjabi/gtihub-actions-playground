import json
import os

data = os.environ.get("workflow_data")
print(data)
json.dump(data,open(f'{data["title"]}.json','w'))
