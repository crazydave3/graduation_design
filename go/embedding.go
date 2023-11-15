package main

import "fmt"

type base struct {
	num int
}

type container struct {
	base
	name string
}

func (b base) describe() string {
	return fmt.Sprintf("base with num=%v\n", b.num)
}

func main() {
	c := container{
		base: base{
			10,
		},
		name: "width",
	}
	fmt.Printf("c:{num:%v,str:%v}\n", c.num, c.name)
	c.describe()
	fmt.Println("also num:", c.base.num)
	fmt.Println("describe:", c.describe())
	type describer interface {
		describe() string
	}
	var des describer = c
	fmt.Println("describer:", des.describe())
}
