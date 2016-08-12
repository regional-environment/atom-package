(
	echo Checking Code Style
	standard && (
		echo "Acceptable Code Style"
	) || (
		echo "Bad Code Style" >&2
		exit 2
	)
) && (
	echo Result of \`require\(\'$(pwd)\'\)\`
	node -p "require('.')"
)
