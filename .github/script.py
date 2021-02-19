import requests
from bs4 import BeautifulSoup as soup
import os
login_url = "http://prereg.iium.edu.my/login1.php?fname=f383524"
auth_url = "http://prereg.iium.edu.my/ora6.php?"
data_url = "http://prereg.iium.edu.my/available.php?&s_code="
chat_id = os.environ["CHAT_ID"]
telegram_api = "https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s"

telegram_token = os.environ["TOKEN"]

s_code = "TQB 2001E"

auth_data = {
    "mat": os.environ["MAT"],
    "pin": os.environ["PIN"],
    "firsttime":1,
    "toggle_sem": 0,
    "Submit": "Login"
}

r = requests.get(login_url)
cookies = r.cookies.get_dict()

requests.post(auth_url,auth_data,cookies=cookies)
r = requests.get(data_url+s_code,cookies=cookies)
rows = soup(r.text).select("tr")[1:]
out = {}
for row in rows:
    cols = row.select("td")
    out[cols[1].text] = cols[2].text

msg = "\n".join([f"Section: {k}, Vacancy: {v}" for k,v in out.items()])
requests.get(telegram_api%(telegram_token,chat_id,msg))
