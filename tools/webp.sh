#!/bin/bash
cleanup() {
  [ -f "${debug_file}" ] && rm "${debug_file}"
}
trap cleanup EXIT

working_dir=$(dirname "$(readlink -f "$0")")
is_prod=$(awk '/DEBUG:/{if (substr($2,1,1) == 0) print "true"}' ../src/pkjs/modules/globals.js)
[ -n "$is_prod" ] && BASE_URL="https://github.com/kennedn/Stateful/raw/master/resources/icons/" || BASE_URL="https://github.com/kennedn/Stateful/raw/working/resources/icons/"

cd "${working_dir}/.."
i=1
[ "$1" == "clay" ] && CLAY=1
[ "$1" == "clay_png" ] && CLAY_PNG=1
[ "$1" == "debug" ] && DEBUG=1 && debug_file=$(mktemp)
[ -n "$DEBUG" ] && echo "NAME,PNG,WEBP,REDUCTION" > "$debug_file"
total_png_size=0
total_webp_size=0
echo "module.exports = ["
while read -r img; do
  name=$(jq -r '.name' <<<"$img" | sed 's/ICON_\(.\)\(.*\)/\L\1\L\2/')
  capital_name=$(jq -r '.name' <<<"$img" | sed 's/ICON_\(.\)\(.*\)/\1\L\2/')
  path="resources/$(jq -r '.file' <<<"$img")"
  if [ -n "$CLAY_PNG" ]; then
    b64="data:image/png;base64,$(base64 -w0 "$path")"
  else
    webp=${path/.png/.webp}
    cwebp -q 60 "$path" -o "$webp" &> /dev/null || exit 1
    b64="data:image/webp;base64,$(base64 -w0 "$webp")"
    rm "$webp"
  fi
  [ -n "$DEBUG" ] && b64_png="data:image/png;base64,$(base64 -w0 "$path")"
  md5=$(printf "$i" | md5sum | head -c 8)
  if [ -n "$CLAY" ] || [ -n "$CLAY_PNG" ]; then
#    echo -e "{\n\t\"src\": {\"$b64\",\"label\": \"$name\",\"value\": \"$md5\"},"
    echo -e "  {\n    \"src\": {\n      \"url\": \"${BASE_URL}${name}.png\",\n      \"webp\": \"${b64}\"\n    },\n    \"resource\": ${i},\n    \"label\": \"${capital_name}\",\n    \"value\": \"${md5}\"\n  },"
  elif [ -n "$DEBUG" ]; then
    png_size="${#b64_png}"
    webp_size="${#b64}"
    echo "$name,${png_size} B,${webp_size} B,$((png_size/webp_size*100))%" >> "$debug_file"
    total_png_size=$((total_png_size + png_size))
    total_webp_size=$((total_webp_size + webp_size))
  else 
    echo "\"$md5\": $i, //$name"
  fi
  ((i++))
done <<< "$(jq -c '.pebble.resources[][] | select((.type == "png") and (.file | startswith("icons")) and (.name != "ICON_OVERFLOW") and (.name != "ICON_QUESTION") and (.name != "ICON_TICK") and (.name != "ICON_CROSS"))' package.json)"
echo "];"
if [ -n "$DEBUG" ]; then
    column -t -s ',' "$debug_file"
    echo -e "\nTotal PNG size: $((total_png_size/1024)) kB, Total WEBP size: $((total_webp_size/1024)) kB, Total Reduction: $((total_png_size/total_webp_size*100))%"
fi
  

