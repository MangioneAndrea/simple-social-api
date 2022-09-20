package main

// pnpm install -g ts-protoc-gen

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"runtime"
	"strings"
)

const dbDir = "../db"
const goDir = "../go"
const tsDir = "../ts/protocolbuffers"

//protoc  Services/ProtocolBuffers/Chat/chat.proto --go_out=plugins=grpc:.
func main() {
	goPath := os.Getenv("GOPATH")
	var currentPath string

	pc := make([]uintptr, 1000)
	n := runtime.Callers(0, pc)
	frames := runtime.CallersFrames(pc[:n])
	for {
		frame, more := frames.Next()
		if !more {
			break
		}
		if strings.Contains(frame.File, "Compile.go") {
			currentPath = strings.ReplaceAll(frame.File, "Compile.go", "")
		}
	}
	err := os.MkdirAll(tsDir, os.ModePerm)
	if err != nil && !os.IsExist(err) {
		panic(err)
	}

	err = filepath.Walk(".",
		func(p string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if strings.HasSuffix(p, ".proto") {
				fmt.Println(p)
				props := []string{
					currentPath + p,
					"-I", currentPath,
					"--go_out=plugins=grpc:" + dbDir,
					"--go_out=plugins=grpc:" + goDir,
					"--ts_out=" + tsDir,
				}
				if runtime.GOOS == "windows" {
					props = append(props, "-IC:/proto3/include/protobuf", "-I"+path.Join(goPath, "/src"))
				}
				cmd := exec.Command("protoc", props...)

				dir, err := os.Getwd()
				cmd.Dir = dir
				var stderr bytes.Buffer
				cmd.Stderr = &stderr
				_, err = cmd.Output()
				if stderr.String() != "" {
					fmt.Print(stderr.String())
				}
				if err != nil {
					return err
				}
			}
			return nil
		})
	fmt.Print(err)
	if err == nil {
		fmt.Print("All protocol buffers compiled")
	}
}
