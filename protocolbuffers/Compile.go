package main

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

//protoc  Services/ProtocolBuffers/Chat/chat.proto --go_out=plugins=grpc:.
func main() {
	err := filepath.Walk(".",
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if strings.HasSuffix(path, ".proto") {
				p := strings.ReplaceAll(path, "", "")
				cmd := exec.Command("protoc", p, "--go_out=plugins=grpc:.")
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