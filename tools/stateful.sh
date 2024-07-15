#!/bin/bash
# Small helper function that can understand [stateful json](https://github.com/kennedn/Stateful/wiki/JSON-Protocol) and mimic RESTful calls using curl
# Expects a stateful JSON file on the same dirpath called 'stateful.json'

# Function to perform a curl request
curl_request() {
  local method=$1
  local url=$2
  local data=$3
  local print=$4

  out="1> /dev/null"
  [ -n "${print}" ] && out="| jq"
  curl_str="curl -s -X \"${method}\" -d \"${data}\" \"${url}\""
  eval $curl_str $headers $out
}

# Function to handle CallType.LOCAL
local_request() {
  local button=$1
  local base_url=$2

  local method url data
  read -r method url data <<<"$(jq -r '[.method, .url, (.data | tostring | gsub("\""; "\\\""))] | join(" ")' <<<"${button}")"

  if [[ ! "${url}" =~ ^http ]]; then
    url="${base_url}${url}"
  fi
  
  # Perform the local request
  curl_request "${method}" "${url}" "${data}"
}

# Function to handle CallType.STATUS_ONLY
status_only_request() {
  local button=$1
  local base_url=$2

  local status_method status_url status_data
  read -r status_method status_url status_data <<<"$(jq -r '[.status.method, .status.url, (.status.data | tostring | gsub("\""; "\\\""))] | join(" ")' <<<"${button}")"

  if [[ ! "${status_url}" =~ ^http ]]; then
    status_url="${base_url}${status_url}"
  fi

  # Perform the status request
  curl_request "${status_method}" "${status_url}" "${status_data}" print
}

# Function to handle CallType.STATEFUL
stateful_request() {
  local button=$1
  local base_url=$2

  local method url data status_method status_url status_data
  read -r method url data status_method status_url status_data <<<"$(jq -r '[.method, .url, (.data | tostring | gsub("\""; "\\\"")), .status.method, .status.url, (.status.data | tostring | gsub("\""; "\\\""))] | join(" ")' <<<"${button}")"

  if [[ ! "${url}" =~ ^http ]]; then
    url="${base_url}${url}"
  fi
  
  if [[ ! "${status_url}" =~ ^http ]]; then
    status_url="${base_url}${status_url}"
  fi

  # Perform the initial request
  curl_request "${method}" "${url}" "${data}"

  # Perform the status request
  curl_request "${status_method}" "${status_url}" "${status_data}" print
}


JSON_FILENAME="$(dirname "$(readlink -f "$0")")/stateful.json"

# Read the input arguments
TILE=$1
BUTTON=$2

# Check if the correct number of arguments are provided, print tile or button info if not
if [ "$#" -eq 0 ]; then
    jq -r '.tiles[].payload.texts | .[-1] | gsub(" "; "_") | select(. != "")' <"${JSON_FILENAME}"
    exit 0
elif [ "$#" -eq 1 ]; then
    jq -r --arg tile_str "${TILE}" '.tiles[].payload.texts | select(.[-1] == ($tile_str)) | .[:-1][] | gsub(" "; "_") | select(. != "")' <"${JSON_FILENAME}"
    exit 0
fi

base_url=$(jq -r '.base_url' <"${JSON_FILENAME}")
headers=$(jq -r '.headers | to_entries | map("-H \"\(.key): \(.value)\"") | join(" ")' <"${JSON_FILENAME}")

button=$(jq -rc --arg tile_str "${TILE}" --arg button_str "${BUTTON}" '.base_url as $base_url | .headers as $headers | .tiles[] | . as $tile | .payload.texts | (.[:-1] | index($button_str | gsub("_"; " "))) as $button_idx | select(.[-1] == ($tile_str)) | select($button_idx != null) | $tile.buttons | [.up,.up_hold,.mid,.mid_hold,.down,.down_hold][$button_idx]' <"${JSON_FILENAME}")
button_type=$(jq -r '.type' <<<"${button}")

[ -z "${button}" ] && echo "No results" && exit 1

headers="${headers} $(jq -r '.headers | select(. != null) | to_entries | map("-H \"\(.key): \(.value)\"") | join(" ")' <<<"${button}")"
headers="${headers} $(jq -r '.status.headers | select(. != null) | to_entries | map("-H \"\(.key): \(.value)\"") | join(" ")' <<<"${button}")"

case $button_type in
0)
  local_request "${button}" "${base_url}"
  ;;
1)
  stateful_request "${button}" "${base_url}"
  ;;
2)
  status_only_request "${button}" "${base_url}"
  ;;
3)
  echo "Button Disabled"
  ;;
*)
  echo "Unknown button type '$button_type' for button '$button'"
  ;;
esac

