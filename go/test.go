package main

import (
	"fmt"
	"math"
	"math/rand"
)

func add(a, b int) int {
	return a + b
}

func swap(x, y int) (int, int) {
	return y, x
}

func main() {
	var c, d int = 10, 20
	e, f, g := false, true, "yes"
	fmt.Println(e, f, g)
	fmt.Println(c, d)
	fmt.Println(swap(c, d))
	fmt.Println(add(10, 2))
	fmt.Println(math.Pi)
	fmt.Printf(" hahahh  %d hahahah", rand.Intn(10))
}
