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

const dbDir = "db"
const goDir = "go"
const tsDir = "ts/src"

//protoc  Services/ProtocolBuffers/Chat/chat.proto --go_out=plugins=grpc:.
func main() {
	goPath := os.Getenv("GOPATH")
	var absPath string

	pc := make([]uintptr, 1000)
	n := runtime.Callers(0, pc)
	frames := runtime.CallersFrames(pc[:n])
	for {
		frame, more := frames.Next()
		if !more {
			break
		}
		if strings.Contains(frame.File, "Compile.go") {
			absPath = filepath.Dir(frame.File)
			break
		}
	}

	parentPath := filepath.Dir(absPath)

	fmt.Println(absPath)
	fmt.Println(parentPath)

	err := os.MkdirAll(tsDir, os.ModePerm)

	if err != nil && !os.IsExist(err) {
		panic(err)
	}

	protoTsPath := filepath.Join(absPath, "/node_modules/.bin/protoc-gen-ts.CMD")

	fmt.Println(protoTsPath)

	err = filepath.Walk(absPath,
		func(p string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if strings.Contains(p, "node_modules") {
				return nil
			}
			if strings.HasSuffix(p, ".proto") {
				props := []string{
					p,
					"-I", parentPath,
					"--go_out=plugins=grpc:" + filepath.Join(parentPath, dbDir),
					"--go_out=plugins=grpc:" + filepath.Join(parentPath, goDir),
					"--plugin=protoc-gen-ts=" + protoTsPath,
					"--ts_out=service=grpc-node,mode=grpc-js:" + filepath.Join(parentPath, tsDir),
					//"--grpc_out=" + filepath.Join(parentPath, tsDir),
					"--js_out=import_style=commonjs,binary:" + filepath.Join(parentPath, tsDir),
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
	if err == nil {
		fmt.Print("All protocol buffers compiled")
	} else {
		fmt.Print(err)
	}
}
