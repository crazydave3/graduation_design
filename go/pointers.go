package main

import "fmt"

func main() {
	i := 1
	zeroval(i)
	fmt.Println("i:", i)
	zeroptr(&i)
	fmt.Println("i:", i)
	fmt.Println("pointer:", &i)
}
func zeroval(ival int) {
	ival = 0
}
func zeroptr(iptr *int) {
	*iptr = 0
}
