(
	echo Testing...
	npm test
) && (
	echo Publishing $1...
	apm publish $1
)
