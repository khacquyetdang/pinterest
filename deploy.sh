#!/bin/bash
token=$1;
url=$2;
curl -H "token: $token" $url; 