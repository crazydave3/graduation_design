package main

import "fmt"

type rect struct {
	width, height int
}
type circle struct {
	r  int
	pi int
}

func (r *rect) area() int {
	return r.width * r.height
}
func (c *circle) area() int {
	return c.pi * c.r * c.r
}
func (r *rect) perim() int {
	return 2 * (r.width + r.height)
}
func (c *circle) perim() int {
	return 2 * c.pi * c.r
}

func main() {
	rect1 := rect{10, 5}
	circle1 := circle{10, 5}
	fmt.Println(rect1.area())
	fmt.Println(circle1.area())
	fmt.Println(rect1.perim())
	fmt.Println(circle1.perim())
}
