$ = jQuery
_ = createjs

$ ->
	window.preload = new _.LoadQueue()
	preload.addEventListener "complete", onResourcesLoaded

	preload.loadManifest [
		{ id: "page0", src: "pages/0.jpg" }
		{ id: "page1", src: "pages/1.jpg"}
	]

window.onResourcesLoaded = ->
	window.stage = new _.Stage "main-canvas"

	window.pageBitmaps = []
	pageBitmaps.push new _.Bitmap preload.getResult "page0"
	pageBitmaps.push new _.Bitmap preload.getResult "page1"

	window.flipBook = new _.Container()
	flipBook.pageSize = pageBitmaps[0].size()
	for page in pageBitmaps
		flipBook.addChild page

	stage.addChild flipBook
	flipBook.x = flipBook.pageSize.width
	flipBook.y = flipBook.pageSize.height

	# window.yellowBitmap = new _.Bitmap preload.getResult "yellow"
	# yellowBitmap.x = -flipBook.pageSize.width

	# for i in [0...2] by 1
	# 	image = new _.Bitmap "pages/#{i}.jpg"

	# 	pageBitmaps.push image
	# 	stage.addChild image

	# currentPage = 0

	# console.log mousePosition

	# console.log hotspot

	window.lineOfSymmetry = {}
	window.clipShape = new _.Shape()
	window.areaC = new _.Shape()
	window.animating = false

	# stage.addChild clipShape

	stage.addEventListener "click", onClick

	_.Ticker.setFPS 40
	_.Ticker.addEventListener "tick", onTick

	stage.update()

window.onClick = ->
	if not animating
		window.animating = true

		# lineOfSymmetry.hotspot = (flipBook.localToGlobal flipBook.pageSize.width, 0).x
		lineOfSymmetry.hotspot = 0
		lineOfSymmetry.theta = 45

		flipBook.addChild pageBitmaps[0]

		_.Tween.get(lineOfSymmetry)
			.to
				# hotspot: 0
				hotspot: flipBook.pageSize.width
				theta: 90
			, 2000

window.onTick = ->
	if animating
		# lineOfSymmetry.hotspot = flipBook.pageSize.width - stage.mouseX
		# lineOfSymmetry.theta = 45 + ((45 * lineOfSymmetry.hotspot) / flipBook.pageSize.width)
		lineOfSymmetry.h = lineOfSymmetry.hotspot * Math.tan toRadians lineOfSymmetry.theta
# (flipBook.pageSize.width - lineOfSymmetry.hotspot)
		topIntersection =  flipBook.pageSize.height / Math.tan toRadians lineOfSymmetry.theta
		console.log topIntersection
		vertices = 
			if topIntersection > lineOfSymmetry.hotspot
				[
					new _.Point 0, 0
					new _.Point lineOfSymmetry.hotspot, -lineOfSymmetry.h
					new _.Point lineOfSymmetry.hotspot, 0
				]
			else
				[
					new _.Point 0, 0
					new _.Point topIntersection, -flipBook.pageSize.height
					new _.Point lineOfSymmetry.hotspot, -flipBook.pageSize.height
					new _.Point lineOfSymmetry.hotspot, 0
				]

		clipShape.graphics = new _.Graphics().drawPolygon vertices
		clipShape.x = flipBook.pageSize.width - lineOfSymmetry.hotspot
		clipShape.y = flipBook.pageSize.height

		pageBitmaps[0].mask = clipShape

		areaC.graphics = new _.Graphics().beginFill("#FFFF00").drawPolygon vertices
		areaC.x = flipBook.pageSize.width - lineOfSymmetry.hotspot
		areaC.y = flipBook.pageSize.height
		# Dont scale -1. Needs to flip over x=hotspot.
		areaC.scaleX = -1
		areaC.rotation = 180 - 2 * lineOfSymmetry.theta

		# yellowBitmap.mask = areaC
		# flipBook.addChild yellowBitmap
		flipBook.addChild areaC

		stage.update()

window.toRadians = (degrees) ->
	Math.PI * degrees / 180

_.DisplayObject.prototype.size = (width, height) ->
	if width? and height?
		@.scaleX = width / @.image.width
		@.scaleY = height / @.image.height
	else
		width: @.scaleX * @.image.width
		height: @.scaleY * @.image.height

_.Graphics.prototype.drawPolygon = (vertices) ->
	@.moveTo vertices[0].x, vertices[0].y
	for i in [1...vertices.length] by 1
		@.lineTo vertices[i].x, vertices[i].y

	@.closePath()





