(
	printf "Checking Code Style... "
	standard && (
		echo "passed"
	) || (
		echo "failed" >&2
		exit 2
	)
)
