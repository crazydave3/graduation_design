package main

import (
	"errors"
	"fmt"
)

func errortest(i int) (int, error) {
	if i == 10 {
		return -1, errors.New("can't work with 10")
	}
	return i, nil
}

type argError struct {
	arg  int
	prob string
}

func (e *argError) Error() string {
	return fmt.Sprintf("%d - %s", e.arg, e.prob)
}
func f2(i int) (int, error) {
	if i == 10 {
		return -1, &argError{i, "can't work with"}
	}
	return i, nil
}
func main() {
	for _, i := range []int{3, 10} {
		if r, e := errortest(i); e == nil {
			fmt.Println(r, "is work")
		} else {
			fmt.Printf("%v is faild:%v\n", i, e)
		}
	}

	for _, i := range []int{3, 10} {
		if r, e := f2(i); e == nil {
			fmt.Println(r, "is work")
		} else {
			fmt.Printf("%v is faild:%v\n", i, e)
		}
	}

	_, e := f2(1)
	if eg, ok := e.(*argError); ok {
		fmt.Println(eg.arg)
		fmt.Println(eg.prob)
	}

}
