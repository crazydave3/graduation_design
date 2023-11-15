package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	timer1 := time.NewTimer(2 * time.Second)
	<-timer1.C
	fmt.Println("timer 1 filed")

	timer2 := time.NewTimer(2 * time.Second)

	go func() {
		<-timer2.C
		fmt.Println("timer 2 filed")
	}()
	stop := timer2.Stop()
	if stop {
		fmt.Println("timer 2 stop")
	}
	fmt.Println("--------Tikcer--------")
	ticker := time.NewTicker(500 * time.Millisecond)
	done := make(chan bool, 1)

	go func() {
		for {
			select {
			case <-done:
				return
			case t := <-ticker.C:
				fmt.Println(t)
			}
		}
	}()

	time.Sleep(1700 * time.Millisecond)
	ticker.Stop()
	done <- true
	fmt.Println("done")

	fmt.Println("--------worker-pools--------")

	nums := 5
	jobs := make(chan int, nums)
	results := make(chan int, nums)

	for i := 1; i <= 3; i++ {
		go worker(i, jobs, results)
	}

	for j := 1; j <= nums; j++ {
		jobs <- j
	}
	close(jobs)

	for k := 1; k <= nums; k++ {
		<-results
	}

	fmt.Println("--------waitgroups--------")
	var wk sync.WaitGroup

	for i := 1; i <= 5; i++ {
		wk.Add(1)
		i := i
		go func() {
			defer wk.Done()
			worker1(i)
		}()
	}
	wk.Wait()

}
func worker(id int, jobs <-chan int, results chan<- int) {
	for i := range jobs {
		fmt.Println("worker ", id, " start job", i)
		time.Sleep(time.Second)
		fmt.Println("worker ", id, " finish job", i)
		results <- i * 2
	}
}
func worker1(id int) {
	fmt.Printf("Worker %d starting\n", id)
	time.Sleep(time.Second)
	fmt.Printf("Worker %d done\n", id)
}
