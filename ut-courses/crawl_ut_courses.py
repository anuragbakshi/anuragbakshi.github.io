from http.client import *
from pyquery import PyQuery as pq
import re

def process_course_dom(dom):
	items = dom("td")
	# print(dom)

	id_code = pq(items[0]).text()
	name = pq(items[1]).text()
	prereq_type = pq(items[2]).text()

	# print(id_code, name, prereq_type)

	info_link = pq(items[0])("a")
	prereqs_url = "/registrar/preq/" + re.findall("(?<=').*?(?=')", info_link.attr("onclick"))[0].replace(" ", "%20")

	conn = HTTPSConnection("utdirect.utexas.edu")
	conn.request(
		"GET", prereqs_url,
		"",
		{"Cookie": "utlogin-prod=AQIC5wM2LY4Sfczs3uDqjPu22U86IO-uXyTrKKurBrUgoEk.*AAJTSQACMDIAAlMxAAIwNgACU0sAFC0zMjM1OTgwMTQ5ODk3NzkzNTY3*;"}
	)

	response = conn.getresponse()
	prereq_dom = pq(response.read().decode("utf-8").replace("\r", ""))

	# print(prereq_dom)

	prereqs = prereq_dom("body > span.text").text()
	prereqs = prereqs[prereqs.find("Prerequisite: ") + 14:]

	return {"id": id_code, "name": name, "prereq_type": prereq_type, "prereqs": prereqs}

conn = HTTPSConnection("utdirect.utexas.edu")
conn.request(
	"POST", "/registrar/preq/list.WBX",
	"s_submit=Y&s_sem=9&s_ccyy=2015&s_start_dpt=C+S&s_start_nbr=",
	{
		"Content-Type": "application/x-www-form-urlencoded",
		"Cookie": "utlogin-prod=AQIC5wM2LY4Sfczs3uDqjPu22U86IO-uXyTrKKurBrUgoEk.*AAJTSQACMDIAAlMxAAIwNgACU0sAFC0zMjM1OTgwMTQ5ODk3NzkzNTY3*;"
	}
)

response = conn.getresponse()
dom = pq(response.read().decode("utf-8").replace("\r", ""))

courses = list(map(process_course_dom, [pq(c)("td") for c in dom("table.tbg tr.tb")]))

print(courses)

# courses = eval(open("ut_courses.txt").read())

# print({"id_code": [c["id"] for c in courses], "name": [c["name"] for c in courses], "prereq_type": [c["prereq_type"] for c in courses], "prereqs": [c["prereqs"] for c in courses]})
