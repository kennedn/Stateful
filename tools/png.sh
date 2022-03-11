#!/bin/bash
cleanup() {
  [ -f "${debug_file}" ] && rm "${debug_file}"
}
trap cleanup EXIT

working_dir=$(dirname "$(readlink -f "$0")")
cd "${working_dir}/.."
i=1
[ "$1" == "clay" ] && CLAY=1
#[ "$1" == "clay_png" ] && CLAY_PNG=1
[ "$1" == "debug" ] && DEBUG=1 && debug_file=$(mktemp)
[ -n "$DEBUG" ] && echo "NAME,PNG,WEBP,REDUCTION" > "$debug_file"
total_png_size=0
total_webp_size=0
while read -r img; do
  name=$(jq -r '.name' <<<"$img" | sed 's/ICON_\(.\)\(.*\)/\1\L\2/')
  path="resources/$(jq -r '.file' <<<"$img")"
  if [ -n "$CLAY" ]; then
    b64="data:image/png;base64,$(base64 -w0 "$path")"
  fi
  [ -n "$DEBUG" ] && b64_png="data:image/png;base64,$(base64 -w0 "$path")"
  md5=$(printf "$i" | md5sum | head -c 8)
  if [ -n "$CLAY" ]; then
    echo -e "{\"src\": \"$b64\",\"label\": \"$name\",\"value\": \"$md5\"},"
  elif [ -n "$DEBUG" ]; then
    png_size="${#b64_png}"
    webp_size="${#b64}"
    echo "$name,$png_size B,$webp_size B,$((png_size/webp_size*100))%" >> "$debug_file"
    total_png_size=$((total_png_size + png_size))
    total_webp_size=$((total_webp_size + webp_size))
  else 
    echo "\"$md5\": $i, //$name"
  fi
  ((i++))
done <<< "$(jq -c '.pebble.resources[][] | select((.type == "png") and (.file | startswith("icons")) and (.name != "ICON_OVERFLOW"))' package.json)"
if [ -n "$DEBUG" ]; then
    column -t -s ',' "$debug_file"
    echo -e "\nTotal PNG size: $((total_png_size/1024)) kB, Total WEBP size: $((total_webp_size/1024)) kB, Total Reduction: $((total_png_size/total_webp_size*100))%"
fi
  
