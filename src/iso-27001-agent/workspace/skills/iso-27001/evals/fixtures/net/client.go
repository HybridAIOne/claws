// Synthetic fixture — an insecure HTTP client. Not real code.
// Exercises: tls-disabled RISK (certificate verification turned off).
package net

import (
	"crypto/tls"
	"net/http"
)

func client() *http.Client {
	// RISK: disables TLS certificate verification — A.8.24 / A.8.21 gap.
	tr := &http.Transport{TLSClientConfig: &tls.Config{InsecureSkipVerify: true}}
	return &http.Client{Transport: tr}
}
