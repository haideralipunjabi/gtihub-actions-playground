import json
import os

data = os.getenv("workflow_data")
json.dump(data,open(f'{data["title"]}.json','w'))
