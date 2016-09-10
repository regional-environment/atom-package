
cleandir () (
	cd $1
	echo Directory "$1"
	rm -rfv tmp temp *.tmp *.temp *.log npm-debug.log*
)

cleandir .
cleandir lib
cleandir sh
