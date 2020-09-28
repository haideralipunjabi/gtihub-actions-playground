import json
import os

data = json.loads(os.environ.get("workflow_data"))
json.dump(data,open(f'{data["name"]}.json','w'))
