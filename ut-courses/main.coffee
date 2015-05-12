# links = [
# 	source: "Microsoft"
# 	target: "Amazon"
# ,
# 	source: "Microsoft"
# 	target: "HTC"
# ,
# 	source: "Samsung"
# 	target: "Apple"
# ,
# 	source: "Motorola"
# 	target: "Apple"
# ,
# 	source: "Nokia"
# 	target: "Apple"
# ,
# 	source: "HTC"
# 	target: "Apple"
# ,
# 	source: "Kodak"
# 	target: "Apple"
# ,
# 	source: "Microsoft"
# 	target: "Barnes & Noble"
# ,
# 	source: "Microsoft"
# 	target: "Foxconn"
# ,
# 	source: "Oracle"
# 	target: "Google"
# ,
# 	source: "Apple"
# 	target: "HTC"
# ,
# 	source: "Microsoft"
# 	target: "Inventec"
# ,
# 	source: "Samsung"
# 	target: "Kodak"
# ,
# 	source: "LG"
# 	target: "Kodak"
# ,
# 	source: "RIM"
# 	target: "Kodak"
# ,
# 	source: "Sony"
# 	target: "LG"
# ,
# 	source: "Kodak"
# 	target: "LG"
# ,
# 	source: "Apple"
# 	target: "Nokia"
# ,
# 	source: "Qualcomm"
# 	target: "Nokia"
# ,
# 	source: "Apple"
# 	target: "Motorola"
# ,
# 	source: "Microsoft"
# 	target: "Motorola"
# ,
# 	source: "Motorola"
# 	target: "Microsoft"
# ,
# 	source: "Huawei"
# 	target: "ZTE"
# ,
# 	source: "Ericsson"
# 	target: "ZTE"
# ,
# 	source: "Kodak"
# 	target: "Samsung"
# ,
# 	source: "Apple"
# 	target: "Samsung"
# ,
# 	source: "Kodak"
# 	target: "RIM"
# ,
# 	source: "Nokia"
# 	target: "Qualcomm"
# ]

# nodes = {}
# Compute the distinct nodes from the links.
# Use elliptical arc path segments to doubly-encode directionality.

tick = ->
	path.attr "d", linkArc
	circle.attr "transform", transform
	text.attr "transform", transform
	return

linkArc = (d) ->
	dx = d.target.x - d.source.x
	dy = d.target.y - d.source.y
	dr = Math.sqrt(dx * dx + dy * dy)
	
	"M#{d.source.x},#{d.source.y}A#{dr},#{dr} 0 0,1 #{d.target.x},#{d.target.y}"

transform = (d) -> "translate(#{d.x},#{d.y})"

# for link in links
# 	link.source = nodes[link.source] or (nodes[link.source] = name: link.source)
# 	link.target = nodes[link.target] or (nodes[link.target] = name: link.target)

width = window.innerWidth
height = window.innerHeight

initializeGraph = (data) ->
	window.courses = {}
	for d in data
		courses[d.id] = d

	# window.nodes = {}
	window.links = []
	for id, c of courses
		for p in c.prereqs
			unless courses[p]?
				console.log p
				courses[p] =
					prereqs_desc: ""
					prereqs: []
					prereq_type: ""
					title: p
					id: p

	# for id, c of courses
	# 	nodes[id] = name: id

	# console.log nodes
	for id, c of courses
		for p in c.prereqs
			links.push
				source: courses[p]
				target: courses[id]

	console.log courses, links

	window.force = d3.layout
		.force()
		.nodes d3.values courses
		.links links
		.size [width, height]
		.linkDistance 100
		.charge -250
		.on "tick", tick
		.start()

	window.svg = d3
		.select "body"
		.append "svg"
		.attr "width", width
		.attr "height", height

	window.marker = svg
		.append "defs"
		.append "marker"
		.attr "id", "marker-arrow"
		.attr "viewBox", "0 -5 10 10"
		.attr "refX", 15
		.attr "refY", -1.5
		.attr "markerWidth", 6
		.attr "markerHeight", 6
		.attr "orient", "auto"
		.append "path"
		.attr "d", "M0,-5L10,0L0,5"

	window.path = svg
		.append "g"
		.selectAll "path"
		.data force.links()
		.enter()
		.append "path"
		.attr "class", "link"
		.attr "marker-end", "url(#marker-arrow)"

	window.circle = svg
		.append "g"
		.selectAll "circle"
		.data force.nodes()
		.enter()
		.append "circle"
		.attr "r", 5
		.call force.drag

	window.text = svg
		.append "g"
		.selectAll "text"
		.data force.nodes()
		.enter()
		.append "text"
		.attr "x", 8
		.attr "y", ".31em"
		.text (d) -> d.title

$.getJSON "ut_courses.json", initializeGraph