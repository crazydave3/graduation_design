package main

import "fmt"

type person struct {
	name string
	age  int
}

func newPerson(name string) *person {
	p := person{name: name}
	p.age = 42
	return &p
}

func main() {
	fmt.Println(person{"bob", 20})
	fmt.Println(person{name: "Alice", age: 30})
	fmt.Println(person{name: "Fred"})
	fmt.Println(person{age: 35})
	fmt.Println(&person{name: "Ann", age: 40})
	fmt.Println(newPerson("jonn"))
	s := person{"sean", 50}
	sl := &s
	fmt.Println("sl name:", sl.name)
	sl.age = 55
	fmt.Println("sl age:", sl.age)

}
