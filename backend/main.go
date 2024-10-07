package main

import (
    "fmt"
    "log"
    "os"
    "net/url"
    "net/http"
)

func readFile(w http.ResponseWriter, r *http.Request) {
    filePath, err := url.QueryUnescape(r.PathValue("path"))
    content, err := os.ReadFile(filePath)
    if err != nil {
        log.Print(err)
    }
    fmt.Printf("Read %s\n", filePath)
    w.Write(content)
}

func main() {
 //    fileName := "logFile.log"
	//
	// // open log file
	// logFile, err := os.OpenFile(fileName, os.O_APPEND|os.O_RDWR|os.O_CREATE, 0644)
	// if err != nil {
	// 	log.Panic(err)
	// }
	// defer logFile.Close()
 //    log.SetOutput(logFile)
	//
    http.HandleFunc("GET /read/{path}", readFile)

    err := http.ListenAndServe(":8000", nil)
    if err != nil {
        log.Print(err)
    }
}
