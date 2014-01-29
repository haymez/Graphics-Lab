<html>
	<body>
		<h1>Done by: Bidur Shrestha</h1>
		<h2>This branch is merged with keypad.</h2>
		<h3>Instructions on including keypad:</h3>

		1. In the head section of index page, add followings:
				<code>
					<pre>
						<link rel="stylesheet" href="css/jquery-ui-custom.css">
						<link rel="stylesheet" href="css/NumPadStyle.css">
					</pre>
				</code>
		2. In body section of the index page, add followings:
				<code>
					<pre>
						<script src="js/NumpadDesign.js"></script> //Before any other javascripts are included
						<script src="js/jquery-ui.js"></script> //At the end of body
						<script src="js/Click.js"></script> //At the end of body after including jquery-ui.js
					</pre>
				</code>

		3. Make sure to have following javascript files in js folder which should be located in same folder as index.html
				a. Click.js
				b. NumpadDesign.js
				c. jquery-ui.js
		
		4. Make sure to have other required files for design in css folder, which should also be located in same folder as index.html
				a. jquery-ui-custom.css
				b. NumpadStyle.css
	</body>
</html>
