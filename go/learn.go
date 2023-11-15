package main

import (
	"fmt"
	"time"
)

func main() {
	i := 1
	sum := 0
	sum1 := 0
	//for
	for i <= 10 {
		sum += i
		i++
	}
	for j := 1; j <= 9; j++ {
		sum1 += j
	}
	//if else
	if sum == sum1 {
		fmt.Println("same")
	} else {
		fmt.Println("different")
	}
	fmt.Println("sum is:", sum)
	fmt.Println("sum1 is:", sum1)
	//switch
	t := time.Now()
	switch {
	case t.Hour() < 12:
		fmt.Println("less than 12")
	default:
		fmt.Println("more than 12")
	}
	switch t.Weekday() {
	case time.Saturday, time.Sunday:
		fmt.Println("weekend")
	default:
		fmt.Println("weekday")
	}
	//arr
	var a [5]int
	fmt.Printf("%v\n", a)
	fmt.Println("a:", a)
	a[4] = 10
	fmt.Println("a:", a)
	b := [5]int{1, 3, 5, 7, 9}
	fmt.Println("b:", b)
	//slice
	s := make([]string, 3)
	fmt.Println("s:", s)
	s[0] = "one"
	s[1] = "two"
	s[2] = "three"
	fmt.Println("set:", s)
	fmt.Println("get:", s[1])
	fmt.Println("len:", len(s), len(a))
	news := append(s, "four")
	s = append(s, "four", "five")
	fmt.Println("news:", news)
	copys := make([]string, len(s))
	copy(copys, s)
	fmt.Println("copys:", s)
	slice := s[1:4]
	fmt.Println("slice:", slice)
	slice = s[:4]
	fmt.Println("slice:", slice)
	slice = s[1:]
	fmt.Println("slice:", slice)
	declare := []string{"hello", "my", "daling"}
	fmt.Println("declare:", declare)
	//map
	m := make(map[string]int)
	m["m1"] = 11
	m["m2"] = 22
	fmt.Println("m:", m, len(m))
	k1 := m["m1"]
	fmt.Println("k1", k1)
	delete(m, "m2")
	fmt.Println("m:", m, len(m))
	getm2, havem2 := m["m2"]
	getm, havem := m["m1"]
	fmt.Println(getm2, havem2)
	fmt.Println(getm, havem)
	newmap := map[int]string{1: "111", 2: "222"}
	fmt.Println("newmap:", newmap)
	//range
	nums := []int{2, 3, 4}
	rangesum := 0
	for index, num := range nums {
		rangesum += num
		fmt.Println("rangesum:", rangesum, "index:", index)
	}
	kvs := map[string]string{"fruit": "apple", "food": "bread"}
	fmt.Println("kvs:", kvs)
	for key, value := range kvs {
		fmt.Println("key:", key, "value:", value)
	}
	for key := range kvs {
		fmt.Println("key:", key)
	}
	for index, char := range "gogo" {
		fmt.Println("index:", index, "char:", char)
	}
	//func
	plustest, multest := plus(2, 3, "kkkkk")
	fmt.Println("plustest:", plustest)
	fmt.Println("multest:", multest)
	total(1, 2)
	total(1, 2, 3)
	funcmap := []int{1, 2, 3, 4}
	fmt.Println("funcmap", funcmap)
	total(funcmap...)
}
func plus(a, b int, d string) (int, int) {
	fmt.Println("d in func:", d)
	return a + b, a * b
}
func total(nums ...int) {
	fmt.Println("change variable:", nums)
	sum := 0
	for _, num := range nums {
		sum += num
	}
	fmt.Println("sum is:", sum)
}
