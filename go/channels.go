package main

import (
	"fmt"
	"time"
)

func main() {
	message := make(chan string)

	go func() { message <- "ping" }()

	msg := <-message
	fmt.Println(msg)

	//channel-buffering
	fmt.Println("----------channel-buffering-----------")

	message1 := make(chan string, 2)

	message1 <- "hello"
	message1 <- "world"

	fmt.Println(<-message1)
	fmt.Println(<-message1)

	//channel-synchronization
	fmt.Println("----------channel-synchronization-----------")

	done := make(chan bool, 2)
	go worker(done)
	// worker((done))
	<-done

	//channel-directions.go
	fmt.Println("----------channel-directions-----------")
	pings := make(chan string, 1)
	pongs := make(chan string, 1)
	// ping(pings, "hello,world")
	pings <- "heloo"
	pong(pings, pongs)
	fmt.Println(<-pongs)

	fmt.Println("----------select----------")
	c1 := make(chan string)
	c2 := make(chan string)
	go func() {
		time.Sleep(1 * time.Second)
		c1 <- "one"
	}()
	go func() {
		time.Sleep(1 * time.Second)
		c2 <- "two"
	}()

	for i := 0; i < 2; i++ {
		select {
		case msg1 := <-c1:
			fmt.Println(msg1)
		case msg2 := <-c2:
			fmt.Println(msg2)
		}
	}
	fmt.Println("----------timeout----------")
	t1 := make(chan string, 1)
	go func() {
		time.Sleep(2 * time.Second)
		t1 <- "result1"
	}()
	select {
	case msg1 := <-t1:
		fmt.Println(msg1)
	case <-time.After(1 * time.Second):
		fmt.Println("timeout1")
	}
	t2 := make(chan string, 1)
	go func() {
		time.Sleep(2 * time.Second)
		t2 <- "result2"
	}()
	select {
	case msg2 := <-t2:
		fmt.Println(msg2)
	case <-time.After(3 * time.Second):
		fmt.Println("timeout2")
	}

	fmt.Println("----------non-blocking-channel-operations----------")
	non := make(chan string)
	non1 := make(chan string)

	select {
	case msg := <-non:
		fmt.Println(msg)
	default:
		fmt.Println("no message received")
	}
	msg1 := "222"

	select {
	case non <- msg1:
		fmt.Println(<-non)
	default:
		fmt.Println("no message send")
	}

	select {
	case msg2 := <-non:
		fmt.Println(msg2)
	case msg3 := <-non1:
		fmt.Println(msg3)
	default:
		fmt.Println("no activity")
	}

	fmt.Println("----------closing-channels----------")
	jobs := make(chan int, 5)
	done1 := make(chan bool, 1)
	go func() {
		for {
			j, more := <-jobs
			if more {
				fmt.Println("reveived job ", j)
			} else {
				fmt.Println("reveived all job")
				done1 <- true
				return
			}
		}
	}()

	for i := 1; i <= 3; i++ {
		jobs <- i
		fmt.Println("sent job", i)
	}
	close(jobs)
	fmt.Println("send all jobs")
	<-done1

	fmt.Println("----------range-over-channels----------")
	range1 := make(chan int, 2)
	range1 <- 1
	range1 <- 2
	close(range1)
	for ran := range range1 {
		fmt.Println(ran)
	}
}
func worker(done chan bool) {
	fmt.Print("working...")
	time.Sleep(time.Second)
	fmt.Println("done")
	done <- true
}

func ping(pings chan<- string, msg string) {
	pings <- msg
}

func pong(pings <-chan string, pongs chan<- string) {
	msg := <-pings
	pongs <- msg
}
