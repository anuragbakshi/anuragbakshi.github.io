# Create aliases for comonly used libraries
$ = jQuery
_ = createjs

# List of properties used later in the code
PAGE_BACK_COLOR = '#FFFF00'
FLIP_TRIGGER_AREA_SIZE = 50

###
TEST URLS
###
window.urls = ['http://www.apple.com/', 'http://www.facebook.com/', 'http://www.google.com/', 'http://twitter.com/', 'http://www.youtube.com/']

# Code to run on document load
$ ->
	# Use PreloadJS to create a new load queue for the flipbook pages
	window.preload = new _.LoadQueue()
	preload.addEventListener 'complete', onResourcesLoaded

	# Tell the load queue to load the flipbook images
	# loadManifest = []
	# for i in [0..4] by 1
	# 	loadManifest.push
	# 		id: "page#{i}"
	# 		src: "pages/#{i}.jpg"

	loadManifest = ({id: "page#{i}", src: "pages/#{i}.jpg"} for i in [0..4])

	preload.loadManifest loadManifest

###
PRELOAD HANDLER
###
window.onResourcesLoaded = ->
	# Create a new stage using the canvas object and enable mouse hover events
	window.stage = new _.Stage 'main-canvas'
	stage.enableMouseOver()

	window.pages = (new FlipbookPage new _.Bitmap(preload.getResult "page#{i}"), urls[i] for i in [0..4])

	# Load the pages from the preload queue
	# window.pages = []
	# for i in [0..4] by 1
	# 	pages.push new _.Bitmap preload.getResult "page#{i}"

	# Create a new container to hold all the pages
	window.flipBook = new _.Container()
	# Store the size of a page as a property
	flipBook.pageSize = pages[0].image.size()

	# Add the flipbook to the stage and position it correctly
	stage.addChild flipBook
	flipBook.x = flipBook.pageSize.width / 2
	flipBook.y = flipBook.pageSize.height / 2

	# Calculate the bounds of the corner of the page, which when clicked will trigger the animation
	window.globalFlipTriggerPoint = flipBook.localToGlobal FLIP_TRIGGER_AREA_SIZE, flipBook.pageSize.height - FLIP_TRIGGER_AREA_SIZE

	window.currentPage = 0
	flipBook.addChild pages[currentPage].image

	window.lineOfSymmetry = {}
	window.clipShape = new _.Shape()
	window.clipShapeReflection = new _.Shape()

	window.pageCorner =
		size: 0
	window.cornerClipShape = new _.Shape()
	window.cornerClipShapeReflection = new _.Shape()

	window.flippingPage = no
	window.fadingPage = no
	window.foldingCorner = no

	flipBook.addEventListener 'click', onClick
	flipBook.addEventListener 'mouseover', onMouseOver
	flipBook.addEventListener 'mouseout', onMouseOut

	_.Ticker.setFPS 40
	_.Ticker.addEventListener 'tick', onTick

	stage.update()

###
EVENT HANDLERS
###
window.onClick = (event) ->
	unless animating()
		if withinFlipTriggerBounds event
			window.flippingPage = yes
			window.foldingCorner = no

			pageCorner.size = 0
			onFoldComplete()

			# if ++currentPage < pages.length
			# 	flipBook.addChild pages[currentPage].image
			# else
			# 	window.currentPage = 0

			++currentPage
			currentPage %= pages.length
			flipBook.addChild pages[currentPage].image

			lineOfSymmetry.hotspot = 0
			lineOfSymmetry.theta = 45

			clipShapeReflection.alpha = 1

			_.Tween.get(lineOfSymmetry)
				.to(
					hotspot: flipBook.pageSize.height
					theta: 90
				, 1000)
				.call onFlipComplete
		else
			redirect pages[currentPage].url

window.onMouseOver = (event) ->
	unless animating()
		window.foldingCorner = yes

		flipBook.addChild pages[(currentPage + 1) % pages.length].image

		_.Tween.removeTweens pageCorner
		_.Tween.get(pageCorner)
			.to
				size: FLIP_TRIGGER_AREA_SIZE
			, 500

window.onMouseOut = (event) ->
	unless animating()
		_.Tween.removeTweens pageCorner
		_.Tween.get(pageCorner)
			.to(
				size: 0
			, 500)
			.call onFoldComplete

window.onTick = ->
	if flippingPage
		# Page turn
		lineOfSymmetry.h = lineOfSymmetry.hotspot * Math.tan toRadians lineOfSymmetry.theta

		topIntersection =  flipBook.pageSize.width / Math.tan toRadians lineOfSymmetry.theta
		
		vertices = 
			if topIntersection > lineOfSymmetry.hotspot
				[
					new _.Point 0, 0
					new _.Point lineOfSymmetry.h, lineOfSymmetry.hotspot
					new _.Point 0, lineOfSymmetry.hotspot
				]
			else
				[
					new _.Point 0, 0
					new _.Point flipBook.pageSize.width, topIntersection
					new _.Point flipBook.pageSize.width, lineOfSymmetry.hotspot
					new _.Point 0, lineOfSymmetry.hotspot
				]

		clipShape.graphics.clear().drawPolygon vertices
		clipShape.x = 0
		clipShape.y = flipBook.pageSize.height - lineOfSymmetry.hotspot

		pages[currentPage].image.mask = clipShape

		clipShapeReflection.graphics.clear().beginFill(PAGE_BACK_COLOR).drawPolygon vertices
		clipShapeReflection.x = 0
		clipShapeReflection.y = flipBook.pageSize.height - lineOfSymmetry.hotspot
		
		clipShapeReflection.scaleY = -1
		clipShapeReflection.rotation = 180 - 2 * lineOfSymmetry.theta

		flipBook.addChild clipShapeReflection

	# Corner fold
	if foldingCorner
		vertices = [
			new _.Point 0, 0
			new _.Point 0, -pageCorner.size
			new _.Point pageCorner.size, 0
		]

		cornerClipShape.graphics.clear().drawPolygon vertices
		cornerClipShape.x = 0
		cornerClipShape.y = flipBook.pageSize.height

		pages[(currentPage + 1) % pages.length].image.mask = cornerClipShape

		cornerClipShapeReflection.graphics.clear().beginFill(PAGE_BACK_COLOR).drawPolygon vertices
		cornerClipShapeReflection.x = pageCorner.size
		cornerClipShapeReflection.y = flipBook.pageSize.height - pageCorner.size

		cornerClipShapeReflection.scaleX = -1
		cornerClipShapeReflection.scaleY = -1

		flipBook.addChild cornerClipShapeReflection

	if animating() or foldingCorner then stage.update()

window.onFlipComplete = ->
	window.flippingPage = no
	window.fadingPage = yes

	flipBook.removeChild pages[currentPage - 1]?.image

	delete pages[currentPage].image.mask

	_.Tween.get(clipShapeReflection)
			.to(
				alpha: 0
				y: -50
				rotation: -10
			, 200)
			.call onFadeComplete

window.onFadeComplete = ->
	window.fadingPage = no

	onMouseOut()
	onMouseOver()

window.onFoldComplete = ->
	window.foldingCorner = no

	flipBook.removeChild cornerClipShapeReflection
	delete pages[currentPage].image.mask

###
UTILITY FUNCTIONS
###
window.toRadians = (degrees) ->
	Math.PI * degrees / 180

window.animating = ->
	flippingPage or fadingPage

window.withinFlipTriggerBounds = (event) ->
	event.stageX < globalFlipTriggerPoint.x and event.stageY > globalFlipTriggerPoint.y

window.redirect = (url, newTab, delay) ->
	if delay?
		setTimeout ->
			redirect url, newTab
		, delay
	else if newTab
		open url
	else
		location.href = url

###
CUSTOM CLASSES
###
class FlipbookPage
	constructor: (@image, @url) ->

###
PROTOTYPE EXTENSIONS
###
_.DisplayObject::size = (width, height) ->
	if width? and height?
		@scaleX = width / @image.width
		@scaleY = height / @image.height
	else
		width: @scaleX * @image.width
		height: @scaleY * @image.height

_.Graphics::drawPolygon = (vertices) ->
	@moveTo vertices[0].x, vertices[0].y
	for i in [1...vertices.length] by 1
		@lineTo vertices[i].x, vertices[i].y

	@closePath()