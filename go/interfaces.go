package main

import (
	"fmt"
	"math"
)

type geometry interface {
	arae() float64
	perim() float64
}
type rect struct {
	width, height float64
}

type circle struct {
	radius float64
}

func (r *rect) arae() float64 {
	return r.width * r.height
}

func (c *circle) arae() float64 {
	return math.Pi * c.radius * c.radius
}

func (r *rect) perim() float64 {
	return 2 * (r.height + r.width)
}

func (c *circle) perim() float64 {
	return 2 * math.Pi * c.radius
}

func measure(g geometry) {
	fmt.Println(g, "arae is:", g.arae())
	fmt.Println(g, "perim is:", g.perim())
}

func main() {
	rect1 := rect{2, 4}
	circle1 := circle{3}

	measure(&rect1)
	measure(&circle1)
}
