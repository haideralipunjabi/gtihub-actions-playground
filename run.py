import json
import os

data = os.getenv("github.event.inputs.workflow_data")
json.dump(data,open(f'{data["title"]}.json','w'))
