package main

import (
	"fmt"
	"os"
	"sort"
)

type byLength []string

func (s byLength) Len() int {
	return len(s)
}

func (s byLength) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}

func (s byLength) Less(i, j int) bool {
	return len(s[i]) < len(s[j])
}

func main() {
	strings := []string{"t", "s", "g", "b"}
	sort.Strings(strings)

	ints := []int{50, 30, 40, 70}
	sort.Ints(ints)

	issorted := sort.IntsAreSorted(ints)

	fmt.Println(strings, ints, issorted)

	fmt.Println("-------------sorting-by-functions-------------")

	fruits := []string{"peach", "banana", "kiwi"}
	sort.Sort(byLength(fruits))
	fmt.Println("fruits:", fruits)

	fmt.Println("-------------panic-------------")

	// panic("a problem")

	_, err := os.Create("/tmp")
	if err != nil {
		panic(err)
	}

}
