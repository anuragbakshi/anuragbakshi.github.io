$ "#graph-container"
	.width window.innerWidth
	.height window.innerHeight

initializeGraph = (data) ->
	console.log data

	window.G = new jsnx.DiGraph
	 
	G.addNodesFrom [1, 2, 3, 4, 5, 9]
	G.addCycle [1, 2, 3, 4, 5]
	G.addEdgesFrom [[1, 9], [9, 1]]

	console.log G
	 
	jsnx.draw G, 
		element: "#graph-container"
		withLabels: true
		nodeStyle:
			fill: "#0064C7"
		
		labelStyle:
			fill: "white"

$.getJSON "/ut_courses.json", initializeGraph